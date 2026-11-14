'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';
import { AccountProfile, Post } from './types';

const initialProfiles: AccountProfile[] = [
  {
    id: 'alex-scout',
    accountType: 'user',
    handle: '@cyberscout_alex',
    displayName: 'Alex Rivera',
    email: 'alex@frontier.ai',
    avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&q=80&w=400',
    bannerImage: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&q=80&w=1400',
    bio: '⚡ Multi-network scout indexing frontier AI breakthroughs, neural silicon architectures, and open-weights reasoning models across X, Reddit, and YouTube.',
    tagline: 'Senior AI Research Curator & Scout',
    category: 'Technology & Frontier AI',
    location: 'San Francisco, CA',
    verified: true,
    theme: 'cyberpunk',
    layoutMode: 'masonry',
    pageBackground: 'https://images.unsplash.com/photo-1579783900882-c0d3dad7b119?auto=format&fit=crop&q=80&w=1600',
    backgroundDim: 80,
    backgroundBlur: 6,
    followersCount: '24.1k',
    followingCount: '480',
    reputationScore: 1420,
    createdAt: '2023-11-04',
    socialLinks: {
      twitter: 'https://twitter.com/ai_insider',
      youtube: 'https://youtube.com/@alex_silicon',
      reddit: 'https://reddit.com/u/CodeWhisperer',
      website: 'https://alexrivera.dev'
    },
    actionButtons: [
      { id: 'btn-alex-1', label: '⚡ Follow Research on X (Twitter)', url: 'https://twitter.com/ai_insider', platform: 'twitter', isPrimary: true, enabled: true },
      { id: 'btn-alex-2', label: '🎥 Silicon Die Breakdown (YouTube)', url: 'https://youtube.com/@alex_silicon', platform: 'youtube', isPrimary: true, enabled: true },
      { id: 'btn-alex-3', label: '🤖 r/LocalLLaMA Benchmarks', url: 'https://reddit.com/u/CodeWhisperer', platform: 'reddit', isPrimary: false, enabled: true },
      { id: 'btn-alex-4', label: '🌐 Open-Weights Research Wiki', url: 'https://alexrivera.dev', platform: 'website', isPrimary: false, enabled: true }
    ],
    posts: [
      {
        id: 601,
        media: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&q=80&w=1080',
        platform: 'twitter',
        text: '🚨 Breakthrough: New reasoning model solves complex IMO Math Olympiad problems autonomously in under 12 seconds with step-by-step verification proofs.',
        caption: '🚨 Breakthrough: New reasoning model solves complex IMO Math Olympiad problems autonomously in under 12 seconds with step-by-step verification proofs.',
        booms: 18450,
        averageRating: 5.0,
        boomers: 3,
        comments: 310,
        submitter: 'cyberscout_alex',
        isVerified: true,
        tags: ['ai', 'machine-learning', 'reasoning', 'benchmarks', 'tech'],
        url: 'https://twitter.com/ai_insider/status/imo-math-solver',
        isNew: true,
        isBoomed: true,
        hasVideo: false,
        shares: 920,
        timestamp: new Date(Date.now() - 3600000 * 5),
        viralScore: 98,
        sentiment: 'bullish',
        trendingReason: 'Viral debate on X & Reddit over AGI milestones and benchmark authenticity.',
        takeaways: [
          'Zero-shot reasoning accuracy surpassed previous benchmark by 34%',
          'Open-weights model repository trending #1 on HuggingFace',
          'Engineers from MIT and DeepMind analyzing methodology'
        ],
        submissions: [
          {
            submitter: 'quant_researcher',
            description: 'First saw this on X. The 12-second proof generation is unprecedented compared to OpenAI o1-preview latency.',
            timestamp: new Date(Date.now() - 3600000 * 5).toISOString(),
            reputation: 580
          },
          {
            submitter: 'benchmark_critic',
            description: 'Double-checked the synthetic evaluation dataset. The IMO geometry problems were held out cleanly.',
            timestamp: new Date(Date.now() - 3600000 * 2).toISOString(),
            reputation: 340
          }
        ]
      },
      {
        id: 602,
        media: 'https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?auto=format&fit=crop&q=80&w=1080',
        platform: 'reddit',
        text: 'r/LocalLLaMA Megathread: Community-led distillation benchmark proves 3B model outperforms 70B models on coding tasks.',
        caption: 'r/LocalLLaMA Megathread: Community-led distillation benchmark proves 3B model outperforms 70B models on coding tasks.',
        booms: 9200,
        averageRating: 4.8,
        boomers: 2,
        comments: 180,
        submitter: 'cyberscout_alex',
        isVerified: true,
        tags: ['reddit', 'localllama', 'open-source', 'coding', 'llm'],
        url: 'https://reddit.com/r/LocalLLaMA/comments/distill_bench',
        isNew: false,
        isBoomed: false,
        hasVideo: false,
        shares: 610,
        timestamp: new Date(Date.now() - 3600000 * 8),
        viralScore: 91,
        sentiment: 'debated',
        trendingReason: 'Over 850 active comments comparing quantized weights and Apple Silicon performance.',
        submissions: [
          {
            submitter: 'hacker_ethos',
            description: 'Tested the llama.cpp GGUF 4-bit quant on an M1 Mac Mini. 110 tokens/sec sustained.',
            timestamp: new Date(Date.now() - 3600000 * 8).toISOString(),
            reputation: 410
          }
        ]
      },
      {
        id: 603,
        media: 'https://images.unsplash.com/photo-1579783900882-c0d3dad7b119?auto=format&fit=crop&q=80&w=1080',
        platform: 'youtube',
        video: 'https://assets.mixkit.co/videos/preview/mixkit-circuit-board-with-glowing-signals-32867-large.mp4',
        text: 'Deep Dive: How Next-Gen Neural Silicon Architecture is 10x faster than current GPUs without consuming extra wattage.',
        caption: 'Deep Dive: How Next-Gen Neural Silicon Architecture is 10x faster than current GPUs without consuming extra wattage.',
        booms: 42000,
        averageRating: 4.9,
        boomers: 2,
        comments: 540,
        submitter: 'cyberscout_alex',
        isVerified: true,
        tags: ['hardware', 'silicon', 'chips', 'engineering', 'future'],
        url: 'https://youtube.com/watch?v=neural-silicon-chip',
        isNew: false,
        isBoomed: true,
        hasVideo: true,
        shares: 1400,
        timestamp: new Date(Date.now() - 3600000 * 12),
        viralScore: 94,
        sentiment: 'bullish',
        trendingReason: 'Ranked #2 on YouTube Tech Trending with 1.4M views.',
        submissions: [
          {
            submitter: 'chip_architect',
            description: 'Full silicon die breakdown. The optical photonic layer eliminates copper heat bottlenecks.',
            timestamp: new Date(Date.now() - 3600000 * 12).toISOString(),
            reputation: 320
          }
        ]
      }
    ]
  }
];

interface AuthContextType {
  activeProfile: AccountProfile;
  allProfiles: AccountProfile[];
  switchProfile: (profileId: string) => void;
  updateActiveProfile: (updated: Partial<AccountProfile>) => void;
  createNewProfile: (newProfile: Partial<AccountProfile>) => AccountProfile;
  isAuthModalOpen: boolean;
  setAuthModalOpen: (open: boolean) => void;
  isCustomizerOpen: boolean;
  setCustomizerOpen: (open: boolean) => void;
  addPostToActiveProfile: (post: Post) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [profiles, setProfiles] = useState<AccountProfile[]>(initialProfiles);
  const [activeProfileId, setActiveProfileId] = useState<string>('alex-scout');
  const [isAuthModalOpen, setAuthModalOpen] = useState(false);
  const [isCustomizerOpen, setCustomizerOpen] = useState(false);

  // Load persisted session on mount and strip any legacy business profiles
  useEffect(() => {
    try {
      const savedProfiles = localStorage.getItem('sakaboom_profiles');
      const savedActiveId = localStorage.getItem('sakaboom_active_profile_id');
      if (savedProfiles) {
        const parsed: AccountProfile[] = JSON.parse(savedProfiles);
        const userOnly = parsed.filter((p: any) => p.accountType === 'user');
        if (userOnly.length > 0) {
          setProfiles(userOnly);
          if (savedActiveId && userOnly.some(p => p.id === savedActiveId)) {
            setActiveProfileId(savedActiveId);
          } else {
            setActiveProfileId(userOnly[0].id);
          }
        }
      }
    } catch (e) {
      console.warn('LocalStorage error reading profile state:', e);
    }
  }, []);

  const persistProfiles = (updatedProfiles: AccountProfile[], activeId: string) => {
    setProfiles(updatedProfiles);
    setActiveProfileId(activeId);
    try {
      localStorage.setItem('sakaboom_profiles', JSON.stringify(updatedProfiles));
      localStorage.setItem('sakaboom_active_profile_id', activeId);
    } catch (e) {
      console.warn('LocalStorage error persisting profile state:', e);
    }
  };

  const activeProfile = profiles.find(p => p.id === activeProfileId) || profiles[0];

  const switchProfile = (profileId: string) => {
    if (profiles.some(p => p.id === profileId)) {
      persistProfiles(profiles, profileId);
    }
  };

  const updateActiveProfile = (updated: Partial<AccountProfile>) => {
    const updatedProfiles = profiles.map(p => {
      if (p.id === activeProfileId) {
        return { ...p, ...updated, accountType: 'user' as const };
      }
      return p;
    });
    persistProfiles(updatedProfiles, activeProfileId);
  };

  const createNewProfile = (newProfileData: Partial<AccountProfile>): AccountProfile => {
    const newId = `profile-${Date.now()}`;
    const handle = newProfileData.handle?.startsWith('@') 
      ? newProfileData.handle 
      : `@${newProfileData.handle || 'new_creator'}`;

    const created: AccountProfile = {
      id: newId,
      accountType: 'user',
      handle,
      displayName: newProfileData.displayName || 'New Curator',
      email: newProfileData.email || `${handle.replace('@', '')}@sakaboom.io`,
      avatar: newProfileData.avatar || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&q=80&w=400',
      bannerImage: newProfileData.bannerImage || 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&q=80&w=1400',
      bio: newProfileData.bio || 'Curating the front page of social networks on Sakaboom.',
      tagline: newProfileData.tagline || 'Content Scout',
      category: newProfileData.category || 'Curator',
      location: newProfileData.location || 'Global',
      verified: true,
      theme: newProfileData.theme || 'cyberpunk',
      layoutMode: newProfileData.layoutMode || 'grid',
      followersCount: '1.2k',
      followingCount: '85',
      reputationScore: 100,
      createdAt: new Date().toISOString().split('T')[0],
      socialLinks: newProfileData.socialLinks || {},
      posts: []
    };

    const updatedProfiles = [created, ...profiles];
    persistProfiles(updatedProfiles, newId);
    return created;
  };

  const addPostToActiveProfile = (post: Post) => {
    const updatedProfiles = profiles.map(p => {
      if (p.id === activeProfileId) {
        return {
          ...p,
          posts: [post, ...p.posts]
        };
      }
      return p;
    });
    persistProfiles(updatedProfiles, activeProfileId);
  };

  return (
    <AuthContext.Provider
      value={{
        activeProfile,
        allProfiles: profiles,
        switchProfile,
        updateActiveProfile,
        createNewProfile,
        isAuthModalOpen,
        setAuthModalOpen,
        isCustomizerOpen,
        setCustomizerOpen,
        addPostToActiveProfile
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
