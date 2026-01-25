import type { LucideIcon } from 'lucide-react';
import type { Timestamp } from 'firebase/firestore';

export type PlatformId = 'instagram' | 'twitter' | 'youtube' | 'tiktok' | 'facebook' | 'linkedin' | 'whatsapp' | 'reddit' | 'weibo' | 'wechat' | 'sharechat' | 'roposo' | 'unknown';

export interface Platform {
  id: PlatformId;
  name: string;
  icon: React.ReactNode;
  color: string;
  gradient?: string;
}

export interface Post {
  id: number;
  media: string;
  mediaHint: string;
  platform: PlatformId;
  text: string;
  caption: string;
  booms: number;
  boomers: number;
  comments: number;
  submitter: string;
  isVerified: boolean;
  tags: string[];
  url: string;
  isNew: boolean;
  isBoomed: boolean;
  hasVideo: boolean;
  shares: number;
  timestamp: Date;
  isCelebrity?: boolean;
  followerCount?: string;
  following?: string;
  postCount?: string;
  location?: string;
  likes?: string;
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

export interface UserProfileData {
  user: UserProfile;
  sharedPosts: Post[];
  viewedPosts: Post[];
}
