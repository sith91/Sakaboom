import { PlatformId } from './types';

export interface SocialPost {
  platform: PlatformId;
  content: string;
  likes: number;
  url: string;
  postType?: 'photo' | 'video';
  image?: string;
  video?: string;
  submitter?: string;
  submitterReputation?: number;
  verificationScore?: number;
  upvotesCount?: number;
  downvotesCount?: number;
  flairs?: string[];
  tags?: string[];
  submissions?: { submitter: string; description: string; timestamp: string; reputation?: number }[];
  type?: 'link' | 'location' | 'event' | 'text';
  eventDate?: string;
  venue?: string;
  address?: string;
  trendingReason?: string;
  crossPlatforms?: PlatformId[];
  viralScore?: number;
  sentiment?: 'bullish' | 'neutral' | 'debated' | 'viral';
  takeaways?: string[];
  authorHandle?: string;
  isShoppable?: boolean;
  price?: string;
  shopHandle?: string;
  buyUrl?: string;
}

export interface Business {
  id: number;
  name: string;
  avatar: string;
  category: string;
  followers: string;
  location: string;
  socialPosts: SocialPost[];
  collectionId?: number;
}

export interface Collection {
  id: number;
  name: string;
  description: string;
  tag: string;
  image: string;
}

export const initialCollections: Collection[] = [
  { id: 1, name: "🚀 Frontier AI & Robotics", description: "Breakthrough models, research papers, and live robotics demos.", tag: "tech", image: "🤖" },
  { id: 2, name: "☕ World-Class Coffee & Cafes", description: "Aesthetic single-origin roasters and hidden espresso gems.", tag: "travel", image: "☕" },
  { id: 3, name: "👗 Aesthetic Fashion & Design", description: "Curated independent fashion, handmade textiles, and timeless apparel.", tag: "fashion", image: "✨" },
  { id: 4, name: "🎨 Cyberpunk & 3D Generative Art", description: "Cutting-edge neural shaders, Blender nodes, and AI aesthetics.", tag: "design", image: "✨" },
  { id: 5, name: "⚡ Viral Internet Moments", description: "The top viral sensations currently setting social feeds on fire.", tag: "viral", image: "🔥" },
];

export const businesses: Business[] = [
  {
    id: 1,
    name: "Frontier AI Watch",
    avatar: "🤖",
    category: "Technology",
    followers: "142k",
    location: "San Francisco, CA",
    collectionId: 1,
    socialPosts: [
      {
        platform: "twitter",
        content: "🚨 Breakthrough: New reasoning model solves complex IMO Math Olympiad problems autonomously in under 12 seconds with step-by-step verification proofs.",
        likes: 18450,
        url: "https://twitter.com/ai_insider/status/imo-math-solver",
        image: "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&q=80&w=1080",
        submitter: "quant_researcher",
        submitterReputation: 580,
        verificationScore: 99,
        upvotesCount: 420,
        downvotesCount: 3,
        trendingReason: "Viral debate on X & Reddit over AGI milestones and benchmark authenticity.",
        crossPlatforms: ["twitter", "reddit", "youtube"],
        viralScore: 98,
        sentiment: "bullish",
        takeaways: [
          "Zero-shot reasoning accuracy surpassed previous benchmark by 34%",
          "Open-weights model repository trending #1 on HuggingFace",
          "Engineers from MIT and DeepMind analyzing methodology"
        ],
        authorHandle: "@ai_insider",
        tags: ["ai", "machine-learning", "reasoning", "benchmarks", "tech"],
        submissions: [
          {
            submitter: "quant_researcher",
            description: "First saw this on X. The 12-second proof generation is unprecedented compared to OpenAI o1-preview latency.",
            timestamp: new Date(Date.now() - 3600000 * 5).toISOString(),
            reputation: 580
          },
          {
            submitter: "benchmark_critic",
            description: "Double-checked the synthetic evaluation dataset. The IMO geometry problems were held out cleanly—zero data contamination.",
            timestamp: new Date(Date.now() - 3600000 * 2).toISOString(),
            reputation: 340
          },
          {
            submitter: "ml_engineer_sam",
            description: "Tested the 7B quantized weights locally on dual RTX 4090s. Replicates the paper's proof steps accurately.",
            timestamp: new Date(Date.now() - 1800000).toISOString(),
            reputation: 210
          }
        ]
      },
      {
        platform: "youtube",
        content: "Deep Dive: How Next-Gen Neural Silicon Architecture is 10x faster than current GPUs without consuming extra wattage.",
        likes: 42000,
        url: "https://youtube.com/watch?v=neural-silicon-chip",
        video: "https://assets.mixkit.co/videos/preview/mixkit-circuit-board-with-glowing-signals-32867-large.mp4",
        submitter: "chip_architect",
        submitterReputation: 320,
        verificationScore: 97,
        upvotesCount: 890,
        downvotesCount: 12,
        trendingReason: "Ranked #2 on YouTube Tech Trending with 1.4M views in 24 hours.",
        crossPlatforms: ["youtube", "reddit", "twitter"],
        viralScore: 94,
        sentiment: "bullish",
        takeaways: [
          "Optical interconnects reduce thermal throttling to near zero",
          "Demonstrated training Llama-3 class models in 4 hours on desktop rig",
          "Pre-orders opening Q3 for research labs"
        ],
        authorHandle: "SiliconBreakdown",
        tags: ["hardware", "silicon", "chips", "engineering", "future"],
        submissions: [
          {
            submitter: "chip_architect",
            description: "Full silicon die breakdown. The optical photonic layer eliminates copper heat bottlenecks.",
            timestamp: new Date(Date.now() - 3600000 * 12).toISOString(),
            reputation: 320
          },
          {
            submitter: "hardware_fanatic",
            description: "This makes rack-scale liquid cooling obsolete for small data centers. Huge milestone.",
            timestamp: new Date(Date.now() - 3600000 * 3).toISOString(),
            reputation: 180
          }
        ]
      },
      {
        platform: "reddit",
        content: "r/LocalLLaMA Megathread: Community-led distillation benchmark proves 3B model outperforms 70B models on coding tasks.",
        likes: 9200,
        url: "https://reddit.com/r/LocalLLaMA/comments/distill_bench",
        image: "https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?auto=format&fit=crop&q=80&w=1080",
        submitter: "hacker_ethos",
        submitterReputation: 410,
        verificationScore: 96,
        upvotesCount: 1540,
        downvotesCount: 22,
        trendingReason: "Over 850 active comments comparing quantized weights and Apple Silicon performance.",
        crossPlatforms: ["reddit", "twitter"],
        viralScore: 91,
        sentiment: "debated",
        takeaways: [
          "Runs at 120 tokens/sec on an M2 MacBook Air",
          "Code refactoring capabilities tested against Python, Rust, and TypeScript",
          "Full quantization recipes shared open-source"
        ],
        authorHandle: "u/CodeWhisperer",
        tags: ["reddit", "localllama", "open-source", "coding", "llm"],
        submissions: [
          {
            submitter: "hacker_ethos",
            description: "Tested the llama.cpp GGUF 4-bit quant on an M1 Mac Mini. 110 tokens/sec sustained for 15 minutes.",
            timestamp: new Date(Date.now() - 3600000 * 8).toISOString(),
            reputation: 410
          },
          {
            submitter: "rust_coder_dan",
            description: "Refactored a 500-line async Tokio server using this 3B model. It caught an obscure lifetime bug that Claude missed.",
            timestamp: new Date(Date.now() - 3600000 * 2).toISOString(),
            reputation: 290
          }
        ]
      }
    ]
  },
  {
    id: 2,
    name: "Kurasu Kyoto Roastery",
    avatar: "☕",
    category: "Food & Travel",
    followers: "89k",
    location: "Kyoto, Japan",
    collectionId: 2,
    socialPosts: [
      {
        platform: "tiktok",
        content: "The hypnotic 3-pour V60 technique from master baristas in Kyoto that extracted the floral notes of Ethiopia Gesha 🌸☕",
        likes: 128000,
        url: "https://tiktok.com/@kyotocoffee/video/v60-masterclass",
        video: "https://assets.mixkit.co/videos/preview/mixkit-coffee-roasting-machine-working-close-up-34316-large.mp4",
        submitter: "tokyofoodie",
        submitterReputation: 640,
        verificationScore: 99,
        upvotesCount: 3400,
        downvotesCount: 15,
        trendingReason: "Viral recipe trend crossing 12M views on TikTok with thousands of home barista recreations.",
        crossPlatforms: ["tiktok", "instagram", "youtube"],
        viralScore: 99,
        sentiment: "viral",
        takeaways: [
          "Precise 91°C water temp with 1:16 brew ratio",
          "Special spiral swirl method releases jasmine aromatics",
          "Cafe named top destination for international coffee pilgrims"
        ],
        authorHandle: "@kyotocoffee",
        tags: ["coffee", "kyoto", "japan", "v60", "barista", "aesthetic"],
        submissions: [
          {
            submitter: "tokyofoodie",
            description: "Tried this recipe at home with a Timemore C3 grinder (14 clicks). The clarity and peach notes are unbelievable!",
            timestamp: new Date(Date.now() - 3600000 * 20).toISOString(),
            reputation: 640
          },
          {
            submitter: "barista_claire",
            description: "Visited their shop near Kyoto Station last week. They use custom ceramic drippers made in Arita. 10/10 experience.",
            timestamp: new Date(Date.now() - 3600000 * 6).toISOString(),
            reputation: 430
          }
        ]
      },
      {
        platform: "location",
        content: "Hidden courtyard cafe inside a 120-year-old Machiya townhouse near Gion with tranquil zen garden seating.",
        likes: 14500,
        url: "https://maps.google.com/?q=Kyoto+Machiya+Coffee",
        image: "https://images.unsplash.com/photo-1554118811-1e0d58224f24?auto=format&fit=crop&q=80&w=1080",
        submitter: "travel_curator",
        submitterReputation: 720,
        verificationScore: 100,
        upvotesCount: 650,
        downvotesCount: 2,
        type: "location",
        address: "Higashiyama Ward, Kyoto 605-0862, Japan",
        trendingReason: "Ranked #1 hidden gem cafe in Kyoto on social maps.",
        crossPlatforms: ["instagram", "location"],
        viralScore: 89,
        sentiment: "bullish",
        takeaways: [
          "Quiet tea garden ambiance away from tourist crowds",
          "Serves signature matcha canelés alongside specialty drip",
          "Best visited during morning golden hour (8:30 AM)"
        ],
        tags: ["kyoto", "japan", "travel", "hidden-gem", "zen", "spots"],
        submissions: [
          {
            submitter: "travel_curator",
            description: "Hidden behind a wooden sliding door with no English sign. Order the hand-dripped Gesha and sit facing the moss rock garden.",
            timestamp: new Date(Date.now() - 3600000 * 24).toISOString(),
            reputation: 720
          },
          {
            submitter: "kyoto_wanderer",
            description: "Best rainy afternoon spot in Gion. Very peaceful and no photography allowed in the main corridor.",
            timestamp: new Date(Date.now() - 3600000 * 4).toISOString(),
            reputation: 390
          }
        ]
      }
    ]
  },
  {
    id: 3,
    name: "Cybernetic Aesthetics Lab",
    avatar: "🎨",
    category: "Design & Generative Art",
    followers: "65k",
    location: "Tokyo / Berlin",
    collectionId: 3,
    socialPosts: [
      {
        platform: "openart",
        content: "Neural Glassmorphic Cityscape: Real-time procedural rendering with reactive volumetric lighting and cyber-refractions.",
        likes: 24600,
        url: "https://openart.ai/discovery/cyber-glass-city",
        image: "https://images.unsplash.com/photo-1579783900882-c0d3dad7b119?auto=format&fit=crop&q=80&w=1080",
        submitter: "neo_artist",
        submitterReputation: 490,
        verificationScore: 98,
        upvotesCount: 920,
        downvotesCount: 8,
        trendingReason: "Top starred generative artwork of the month on AI Art feeds.",
        crossPlatforms: ["openart", "twitter", "threads"],
        viralScore: 95,
        sentiment: "viral",
        takeaways: [
          "Custom multi-prompt node combining raytracing & neural textures",
          "HD 4K wallpaper render available under Creative Commons",
          "Featured on Digital Art Tokyo 2026 expo gallery"
        ],
        authorHandle: "@neo_renderer",
        tags: ["ai-art", "cyberpunk", "glassmorphism", "generative", "design"],
        submissions: [
          {
            submitter: "neo_artist",
            description: "Created using ComfyUI with a custom refractive glass LoRA. The caustics were rendered at 60fps.",
            timestamp: new Date(Date.now() - 3600000 * 18).toISOString(),
            reputation: 490
          },
          {
            submitter: "shader_wizard",
            description: "Inspected the workflow graph—the multi-pass lighting pass over the neon signs is masterclass level.",
            timestamp: new Date(Date.now() - 3600000 * 7).toISOString(),
            reputation: 350
          }
        ]
      },
      {
        platform: "threads",
        content: "Why brutalist UI is making a massive comeback across luxury tech and fashion websites in 2026 🖤🧵",
        likes: 8300,
        url: "https://threads.net/@design_architect/post/brutalist-revival",
        image: "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&q=80&w=1080",
        submitter: "ui_director",
        submitterReputation: 310,
        verificationScore: 95,
        upvotesCount: 380,
        downvotesCount: 14,
        trendingReason: "Sparked a 200+ reply design debate across Threads and X.",
        crossPlatforms: ["threads", "twitter"],
        viralScore: 88,
        sentiment: "debated",
        takeaways: [
          "Heavy monospace typography combined with sleek dark mode",
          "Micro-interactions replacing bulky gradients",
          "Balancing accessibility with avant-garde aesthetics"
        ],
        authorHandle: "@design_architect",
        tags: ["design", "ui", "ux", "threads", "trends", "brutalism"],
        submissions: [
          {
            submitter: "ui_director",
            description: "Wrote this breakdown after redesigning 3 fashion e-commerce flagships. Monospace + high contrast is converting 22% better.",
            timestamp: new Date(Date.now() - 3600000 * 15).toISOString(),
            reputation: 310
          },
          {
            submitter: "product_lead_eva",
            description: "Agreed on aesthetics, but watch out for screen reader accessibility on raw monospaced tables.",
            timestamp: new Date(Date.now() - 3600000 * 5).toISOString(),
            reputation: 420
          }
        ]
      }
    ]
  },
  {
    id: 4,
    name: "Global Electronic Festival",
    avatar: "⚡",
    category: "Events & Music",
    followers: "210k",
    location: "Amsterdam, Netherlands",
    socialPosts: [
      {
        platform: "instagram",
        content: "Midnight stage reveal: 360-degree holographic laser dome over Amsterdam docks for ADE 2026 🌌🔊",
        likes: 64000,
        url: "https://instagram.com/p/ade2026-dome-reveal",
        image: "https://images.unsplash.com/photo-1470225620780-dba8ba36b745?auto=format&fit=crop&q=80&w=1080",
        submitter: "rave_pulse",
        submitterReputation: 520,
        verificationScore: 99,
        upvotesCount: 1800,
        downvotesCount: 20,
        type: "event",
        eventDate: "October 22-26, 2026",
        venue: "NDSM Wharf, Amsterdam",
        address: "NDSM-Plein 28, 1033 WB Amsterdam",
        trendingReason: "Viral festival visual going viral across Instagram reels & TikTok music clips.",
        crossPlatforms: ["instagram", "tiktok", "youtube"],
        viralScore: 97,
        sentiment: "viral",
        takeaways: [
          "Custom spatial audio rig engineered by L-Acoustics",
          "Featuring 45 global underground electronic producers",
          "Phase 2 tickets sold out in 3 minutes"
        ],
        authorHandle: "@amsterdam_dance_event",
        tags: ["event", "music", "festival", "amsterdam", "electronic", "hologram"],
        submissions: [
          {
            submitter: "rave_pulse",
            description: "The acoustics inside the NDSM dome will be unmatched. 32-channel surround sound with 3D laser projection mapping.",
            timestamp: new Date(Date.now() - 3600000 * 10).toISOString(),
            reputation: 520
          },
          {
            submitter: "sound_engineer_kai",
            description: "Tested the sub-bass transducers at the warehouse rehearsal last night. Prepare for chest-rattling low-end.",
            timestamp: new Date(Date.now() - 3600000 * 2).toISOString(),
            reputation: 380
          }
        ]
      }
    ]
  },
  {
    id: 5,
    name: "Boho Style Studio",
    avatar: "👗",
    category: "Sustainable Fashion & Atelier",
    followers: "78k",
    location: "Portland, OR",
    collectionId: 3,
    socialPosts: [
      {
        platform: "instagram",
        content: "Summer Linen Capsule: Handwoven organic Japanese linen maxi dress in terracotta & sage 🌿👗 Sustainable craft edition.",
        likes: 19800,
        url: "https://instagram.com/p/boho-summer-linen-drop",
        image: "https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?auto=format&fit=crop&q=80&w=1080",
        submitter: "boho_style_studio",
        submitterReputation: 620,
        verificationScore: 99,
        upvotesCount: 780,
        downvotesCount: 2,
        trendingReason: "Viral sustainable fashion highlight appreciated for certified organic craftsmanship.",
        crossPlatforms: ["instagram", "tiktok"],
        viralScore: 96,
        sentiment: "viral",
        takeaways: [
          "100% GOTS certified organic linen with natural plant-based dyes",
          "Includes hidden pockets and adjustable drawstring waist",
          "Free worldwide carbon-neutral shipping on orders over $100"
        ],
        authorHandle: "@boho_style_studio",
        tags: ["fashion", "linen", "sustainable", "style", "design"],
        submissions: [
          {
            submitter: "fashion_curator_zoe",
            description: "Received mine in 3 days! The linen weight is substantial yet breathable. Fits true to size (wearing Size S, 5'6\").",
            timestamp: new Date(Date.now() - 3600000 * 18).toISOString(),
            reputation: 510
          },
          {
            submitter: "slow_fashion_guide",
            description: "Verified the stitching and seam finishes. Double French seams throughout—rare quality for this price point.",
            timestamp: new Date(Date.now() - 3600000 * 6).toISOString(),
            reputation: 430
          },
          {
            submitter: "portland_shopper",
            description: "Visited their local pop-up shop last weekend. The terracotta color in person is even richer than photos.",
            timestamp: new Date(Date.now() - 3600000 * 1).toISOString(),
            reputation: 280
          }
        ]
      }
    ]
  }
];
