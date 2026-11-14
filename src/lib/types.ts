import type { LucideIcon } from 'lucide-react';
import type { Timestamp } from 'firebase/firestore';

export type PlatformId = 'instagram' | 'twitter' | 'youtube' | 'tiktok' | 'facebook' | 'linkedin' | 'whatsapp' | 'reddit' | 'threads' | 'weibo' | 'wechat' | 'sharechat' | 'roposo' | 'openart' | 'higgsfield' | 'location' | 'unknown' | 'web';

export type PlatformCategory = 'social' | 'ai' | 'web' | 'location';

export interface Platform {
  id: PlatformId;
  name: string;
  icon: React.ReactNode;
  color: string;
  gradient?: string;
  category: PlatformCategory;
}

export interface Submission {
  submitter: string;
  description: string;
  timestamp: Date | string;
  reputation?: number;
  votes?: number;
}

export interface Post {
  id: number;
  media: string;
  mediaHint?: string;
  video?: string;
  platform: PlatformId;
  text: string;
  caption: string;
  booms: number;
  averageRating: number;
  userRating?: number;
  boomers: number;
  comments: number;
  submitter: string;
  isVerified: boolean;
  tags: string[];
  url: string;
  isNew: boolean;
  isAiDiscovered?: boolean;
  isBoomed: boolean;
  hasVideo: boolean;
  shares: number;
  timestamp: Date;
  submissions: Submission[];
  isCelebrity?: boolean;
  followerCount?: string;
  following?: string;
  postCount?: string;
  location?: string;
  likes?: string | number;
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

export interface Category {
  name: string;
  icon?: LucideIcon;
}

export interface TrendingTag {
  name: string;
  icon: string;
}

export interface FilterTag {
  name: string;
  count: number;
}

export interface FilterTagGroup {
  label: string;
  icon: LucideIcon;
  tags: FilterTag[];
}

export type AccountType = 'user';
export type ProfileTheme = 'cyberpunk' | 'midnight' | 'gold' | 'emerald' | 'minimal';
export type LayoutMode = 'grid' | 'masonry' | 'compact';

export interface SocialLinks {
  instagram?: string;
  twitter?: string;
  tiktok?: string;
  youtube?: string;
  reddit?: string;
  threads?: string;
  shop?: string;
  website?: string;
  whatsapp?: string;
}

export interface ProfileButton {
  id: string;
  label: string;
  url: string;
  platform?: PlatformId | 'shop' | 'whatsapp' | 'website' | 'custom';
  icon?: string;
  color?: string;
  isPrimary?: boolean;
  enabled: boolean;
}

export interface AccountProfile {
  id: string;
  accountType: AccountType;
  handle: string; // e.g. @boho_style_studio or @cyberscout
  displayName: string;
  email?: string;
  avatar: string;
  bannerImage: string;
  pageBackground?: string; // Custom full-page wallpaper or gradient URL
  backgroundDim?: number; // 0 to 100 percentage
  backgroundBlur?: number; // 0 to 20 px
  bio: string;
  tagline?: string;
  category?: string;
  location?: string;
  verified: boolean;
  theme: ProfileTheme;
  layoutMode: LayoutMode;
  socialLinks: SocialLinks;
  actionButtons?: ProfileButton[]; // Ordered customizable button deck
  posts: Post[];
  followersCount: string | number;
  followingCount: string | number;
  reputationScore: number;
  createdAt: string;
  accentColor?: string;
  customLinks?: { title: string; url: string; icon?: string }[];
}

export interface UserProfile {
  uid: string;
  email?: string | null;
  displayName?: string | null;
  photoURL?: string | null;
  createdAt: Date;
  points: number;
  sharesData: boolean;
}

export interface Boom {
    userId: string;
    postId: string;
    createdAt: Timestamp;
}

export interface IndexCollection {
  id: string;
  name: string;
  description: string;
  curator: string;
  postIds: number[];
  tags: string[];
  image: string;
  isPrivate: boolean;
  booms: number;
  timestamp: Date;
}

export interface UserProfileData {
  user: UserProfile;
  sharedPosts: Post[];
  viewedPosts: Post[];
  collections: IndexCollection[];
}

