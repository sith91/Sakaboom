// Independent Local Authentication Service (Replaces Google Firebase)
export const auth = {};
export const googleProvider = "google";
export const facebookProvider = "facebook";
export const walletProvider = "wallet";

let authStateListener: ((user: any) => void) | null = null;

export const signInWithPopup = async (authObj: any, provider: string) => {
  const dummyUser = {
    uid: Math.random().toString(36).substring(7),
    displayName: provider === "google" ? "Local Searcher (Google Mock)" : provider === "wallet" ? "Web3 Architect (Wallet Mock)" : "Local Searcher (FB Mock)",
    email: provider === "wallet" ? "0x8920...3A2f" : "local@sakaboom.invalid",
    photoURL: "https://api.dicebear.com/7.x/bottts/svg?seed=" + Math.random(),
  };
  localStorage.setItem('sakaboom_local_user', JSON.stringify(dummyUser));
  if (authStateListener) authStateListener(dummyUser);
  return { user: dummyUser };
};

export const signOut = async (authObj: any) => {
  localStorage.removeItem('sakaboom_local_user');
  if (authStateListener) authStateListener(null);
};

export const onAuthStateChanged = (authObj: any, callback: (user: any) => void) => {
  authStateListener = callback;
  if (typeof window !== 'undefined') {
    const stored = localStorage.getItem('sakaboom_local_user');
    if (stored) {
      callback(JSON.parse(stored));
    } else {
      callback(null);
    }
  }
  return () => { authStateListener = null; };
};
