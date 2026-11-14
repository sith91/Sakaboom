import { Post } from '@/lib/types';

// ----------------------------------------------------------------------------
// PEER DISCOVERY REGISTRY
// In a true production deployment, this list is dynamically populated 
// into your Postgres database as new Nodes explicitly handshake and trust you.
// ----------------------------------------------------------------------------
const KNOWN_PEER_NODES = [
  'https://node-tokyo.sakaboom.invalid',
  'https://node-paris.sakaboom.invalid',
  'http://localhost:3001' // For local parallel testing
];

// Security Token used to authenticate Server-to-Server Webhook interactions
const FEDERATION_SECRET = process.env.FEDERATION_SECRET || 'SAKA_MESH_TEST_KEY_2026';

/**
 * Broadcasts a newly curated post to all friendly nodes in the Mesh Network.
 * This triggers asynchronously to prevent locking up the User's UI response.
 */
export async function broadcastNewPostToMesh(post: Post) {
  console.log(`[MESH] Broadcasting new index to ${KNOWN_PEER_NODES.length} peers...`);
  
  for (const peerUrl of KNOWN_PEER_NODES) {
    fetch(`${peerUrl}/api/federation/broadcast`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${FEDERATION_SECRET}`
      },
      body: JSON.stringify({ post }),
    }).catch(error => {
      // We explicitly swallow fetch errors so if a Node goes offline, 
      // it doesn't crash our isolated server's execution flow.
      console.warn(`[MESH] Peer ${peerUrl} unreachable: ${error.message}`);
    });
  }
}

/**
 * Fires a massive Scatter-Gather search query across all trusted Nodes.
 * If Node Tokyo has an article the Parisian Node missed, it gets unified here.
 */
export async function federatedSearch(query: string): Promise<Post[]> {
   const promises = KNOWN_PEER_NODES.map(async (peerUrl) => {
      try {
          const res = await fetch(`${peerUrl}/api/federation/sync?q=${encodeURIComponent(query)}`, {
             headers: { 'Authorization': `Bearer ${FEDERATION_SECRET}` }
          });
          if (res.ok) {
             const data = await res.json();
             return data.posts as Post[];
          }
      } catch (e) {
          console.warn(`[MESH] Peer ${peerUrl} unreachable for Deep Search.`);
      }
      return [];
   });

   // Wait for all remote servers to respond and violently flatten the arrays together
   const aggregatedDeepResults = await Promise.all(promises);
   return aggregatedDeepResults.flat();
}
