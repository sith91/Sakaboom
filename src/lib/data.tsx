import type { Post, Platform, Category, TrendingTag, FilterTagGroup } from './types';
import { PlaceHolderImages } from './placeholder-images';
import {
  Code2,
  Newspaper,
  Gamepad2,
  Film,
  Dumbbell,
  FlaskConical,
  Plane,
  GraduationCap,
} from 'lucide-react';
import { Instagram, Twitter, Youtube, Tiktok, Facebook, Linkedin } from '@/components/icons';


export const platforms: Record<string, Platform> = {
  instagram: { id: 'instagram', name: 'Instagram', icon: <Instagram className="w-4 h-4"/>, color: '#E4405F', gradient: 'linear-gradient(45deg, #405DE6, #5851DB, #833AB4, #C13584, #E1306C, #FD1D1D)' },
  twitter: { id: 'twitter', name: 'Twitter/X', icon: <Twitter className="w-4 h-4" />, color: '#1DA1F2' },
  youtube: { id: 'youtube', name: 'YouTube', icon: <Youtube className="w-4 h-4" />, color: '#FF0000' },
  tiktok: { id: 'tiktok', name: 'TikTok', icon: <Tiktok className="w-4 h-4" />, color: '#000000' },
  facebook: { id: 'facebook', name: 'Facebook', icon: <Facebook className="w-4 h-4" />, color: '#1877F2' },
  linkedin: { id: 'linkedin', name: 'LinkedIn', icon: <Linkedin className="w-4 h-4" />, color: '#0A66C2' },
};

const findImage = (id: string) => {
  const img = PlaceHolderImages.find(i => i.id === id);
  if (!img) return { imageUrl: `https://picsum.photos/seed/${id}/600/400`, imageHint: 'placeholder' };
  return { imageUrl: img.imageUrl, imageHint: img.imageHint };
}

export const initialPosts: Post[] = [
  {
    id: 1,
    media: findImage('1').imageUrl,
    mediaHint: findImage('1').imageHint,
    platform: "instagram",
    text: "New photoshoot in Dubai! The architecture here is absolutely breathtaking. 🇦🇪✨ #Dubai #Travel #Fashion #Photoshoot #MiaKhalifa",
    caption: "Living my best life in Dubai! The architecture, the culture, everything is simply amazing. Can't wait to share more from this trip! ✨🌆 #DubaiLife #TravelBlogger #Influencer #MiddleEast #LuxuryTravel",
    booms: 1247,
    comments: 892,
    submitter: "miakhalifa",
    isVerified: true,
    tags: ["Celebrity", "Influencer", "Lifestyle", "Travel", "Fashion", "Photography", "Dubai", "Entertainment", "Middle East", "Hotels", "Luxury"],
    url: "https://www.instagram.com/miakhalifa/?hl=en",
    isNew: true,
    isBoomed: false,
    hasVideo: false,
    shares: 345,
    timestamp: new Date(Date.now() - 1800000), // 30 minutes ago
    isCelebrity: true,
    followerCount: "8.7M",
    following: "423",
    postCount: "1.2k",
    location: "Dubai, United Arab Emirates",
    likes: "245k",
  },
  {
    id: 2,
    media: findImage('2').imageUrl,
    mediaHint: findImage('2').imageHint,
    platform: "instagram",
    text: "Beautiful hotel in Colombo with amazing ocean views! Perfect for a weekend getaway.",
    caption: "Just checked into this stunning hotel in Colombo! The ocean view from my room is absolutely breathtaking. Highly recommended for anyone visiting Sri Lanka! 🇱🇰✨ #Colombo #SriLanka #Travel #Hotels #Luxury #OceanView",
    booms: 842,
    comments: 156,
    submitter: "travelguru",
    isVerified: false,
    tags: ["Travel", "Hotels", "Colombo", "Sri Lanka", "Luxury", "Ocean View", "Accommodation", "Vacation"],
    url: "https://www.instagram.com/p/colombo-hotel/",
    isNew: false,
    isBoomed: false,
    hasVideo: false,
    shares: 42,
    timestamp: new Date(Date.now() - 86400000), // 1 day ago
    location: "Colombo, Sri Lanka",
    likes: "3.2k"
  },
  {
    id: 3,
    media: findImage('3').imageUrl,
    mediaHint: findImage('3').imageHint,
    platform: "twitter",
    text: "Amazing seafood restaurant in Colombo! Fresh catch every day. #Colombo #Food #Seafood",
    caption: "Discovered this hidden gem in Colombo! The seafood is incredibly fresh and the service is outstanding. A must-visit for food lovers! 🦐🐟 #ColomboEats #SriLankaFood #Seafood #Restaurants #Foodie",
    booms: 521,
    comments: 89,
    submitter: "foodexplorer",
    isVerified: true,
    tags: ["Food", "Restaurants", "Colombo", "Seafood", "Fine Dining", "Sri Lanka", "Culinary"],
    url: "https://x.com/foodexplorer/status/1700000000000000001",
    isNew: true,
    isBoomed: false,
    hasVideo: false,
    shares: 24,
    timestamp: new Date(Date.now() - 3600000), // 1 hour ago
    likes: "1.8k",
  },
  {
    id: 4,
    media: findImage('4').imageUrl,
    mediaHint: findImage('4').imageHint,
    platform: "youtube",
    text: "Complete travel guide to Colombo - Best hotels, restaurants and attractions!",
    caption: "Just published my comprehensive travel guide to Colombo! Covering the best hotels, restaurants, attractions, and hidden gems. Perfect for first-time visitors! 🇱🇰 #Colombo #TravelGuide #SriLanka #Hotels #Restaurants #TravelTips",
    booms: 934,
    comments: 203,
    submitter: "travelvlogger",
    isVerified: true,
    tags: ["Travel", "Colombo", "Hotels", "Restaurants", "Guide", "Tourism", "Sri Lanka", "Attractions"],
    url: "https://www.youtube.com/watch?v=colombo-guide",
    isNew: false,
    isBoomed: true,
    hasVideo: true,
    shares: 87,
    timestamp: new Date(Date.now() - 172800000), // 2 days ago
    views: "124k",
  },
  {
    id: 5,
    media: findImage('5').imageUrl,
    mediaHint: findImage('5').imageHint,
    platform: "instagram",
    text: "Luxury resort in Maldives with overwater bungalows! Paradise on earth.",
    caption: "This luxury resort in Maldives is absolutely incredible! Waking up to crystal clear waters right from your overwater bungalow is a dream come true. Perfect for honeymooners! 💑🌴 #Maldives #Luxury #Resorts #OverwaterBungalows #Honeymoon #Travel",
    booms: 1567,
    comments: 324,
    submitter: "luxurytraveler",
    isVerified: false,
    tags: ["Travel", "Resorts", "Maldives", "Luxury", "Overwater Bungalows", "Beaches", "Honeymoon", "Vacation"],
    url: "https://www.instagram.com/p/maldives-resort/",
    isNew: false,
    isBoomed: false,
    hasVideo: false,
    shares: 156,
    timestamp: new Date(Date.now() - 259200000), // 3 days ago
    location: "Maldives",
    likes: "8.9k"
  },
  {
    id: 6,
    media: findImage('6').imageUrl,
    mediaHint: findImage('6').imageHint,
    platform: "tiktok",
    text: "Street food tour in Bangkok! Insanely delicious and affordable.",
    caption: "Just spent 24 hours eating my way through Bangkok's street food scene! From pad thai to mango sticky rice, everything was amazing! 🍜🥭 #Bangkok #StreetFood #Thailand #FoodTour #Travel #Foodie",
    booms: 721,
    comments: 142,
    submitter: "streetfoodking",
    isVerified: false,
    tags: ["Food", "Street Food", "Bangkok", "Thailand", "Food Tour", "Travel", "Culinary"],
    url: "https://www.tiktok.com/@streetfoodking/video/bangkok-food",
    isNew: true,
    isBoomed: false,
    hasVideo: true,
    shares: 68,
    timestamp: new Date(Date.now() - 7200000), // 2 hours ago
    views: "2.1M",
  },
  {
    id: 7,
    media: findImage('7').imageUrl,
    mediaHint: findImage('7').imageHint,
    platform: "instagram",
    text: "Cozy cafe in Tokyo with the best matcha latte I've ever had!",
    caption: "Found this adorable hidden cafe in Tokyo! The matcha latte is perfection and the atmosphere is so cozy. Perfect spot for working or relaxing with friends. ☕️🍵 #Tokyo #Cafes #Matcha #Japan #Coffee #HiddenGems",
    booms: 432,
    comments: 78,
    submitter: "cafehopper",
    isVerified: true,
    tags: ["Cafes", "Tokyo", "Japan", "Coffee", "Matcha", "Food", "Travel", "Hidden Gems"],
    url: "https://www.instagram.com/p/tokyo-cafe/",
    isNew: false,
    isBoomed: true,
    hasVideo: false,
    shares: 32,
    timestamp: new Date(Date.now() - 43200000), // 12 hours ago
    location: "Tokyo, Japan",
    likes: "4.3k"
  },
];


export const trendingTags: TrendingTag[] = [
  { name: 'Celebrity News', icon: '🌟' },
  { name: 'Influencer Culture', icon: '📱' },
  { name: 'Social Media', icon: '📲' },
  { name: 'Entertainment', icon: '🎬' },
  { name: 'Lifestyle', icon: '✨' },
];

export const popularSidebarTags: string[] = ['Travel', 'Food', 'Technology', 'Fashion', 'Photography'];
