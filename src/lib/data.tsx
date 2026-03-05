import type { Post, Platform, Category, TrendingTag, FilterTagGroup, UserProfileData, Submission } from './types';
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
  Link2,
  BrainCircuit,
  MapPin,
} from 'lucide-react';
import { Instagram, Twitter, Youtube, Tiktok, Facebook, Linkedin, Weibo, WeChat, ShareChat, Roposo } from '@/components/icons';


export const platforms: Record<string, Platform> = {
  instagram: { id: 'instagram', name: 'Instagram', icon: <Instagram className="w-4 h-4"/>, color: '#E4405F', gradient: 'linear-gradient(45deg, #405DE6, #5851DB, #833AB4, #C13584, #E1306C, #FD1D1D)', category: 'social' },
  twitter: { id: 'twitter', name: 'Twitter/X', icon: <Twitter className="w-4 h-4" />, color: '#1DA1F2', category: 'social' },
  youtube: { id: 'youtube', name: 'YouTube', icon: <Youtube className="w-4 h-4" />, color: '#FF0000', category: 'social' },
  tiktok: { id: 'tiktok', name: 'TikTok', icon: <Tiktok className="w-4 h-4" />, color: '#000000', category: 'social' },
  facebook: { id: 'facebook', name: 'Facebook', icon: <Facebook className="w-4 h-4" />, color: '#1877F2', category: 'social' },
  linkedin: { id: 'linkedin', name: 'LinkedIn', icon: <Linkedin className="w-4 h-4" />, color: '#0A66C2', category: 'social' },
  weibo: { id: 'weibo', name: 'Weibo', icon: <Weibo className="w-4 h-4" />, color: '#df2029', category: 'social' },
  wechat: { id: 'wechat', name: 'WeChat', icon: <WeChat className="w-4 h-4" />, color: '#09B83E', category: 'social' },
  sharechat: { id: 'sharechat', name: 'ShareChat', icon: <ShareChat className="w-4 h-4" />, color: '#5F259F', category: 'social' },
  roposo: { id: 'roposo', name: 'Roposo', icon: <Roposo className="w-4 h-4" />, color: '#000000', category: 'social' },
  openart: { id: 'openart', name: 'OpenArt', icon: <BrainCircuit className="w-4 h-4" />, color: '#3B82F6', category: 'ai' },
  higgsfield: { id: 'higgsfield', name: 'Higgsfield', icon: <BrainCircuit className="w-4 h-4" />, color: '#D946EF', category: 'ai' },
  location: { id: 'location', name: 'Location', icon: <MapPin className="w-4 h-4" />, color: '#34A853', category: 'location' },
  unknown: { id: 'unknown', name: 'Website', icon: <Link2 className="w-4 h-4" />, color: '#808080', category: 'web' },
};

const findImage = (id: string) => {
  const img = PlaceHolderImages.find(i => i.id === id);
  if (!img) return { imageUrl: `https://picsum.photos/seed/${id}/600/400`, imageHint: 'placeholder' };
  return { imageUrl: img.imageUrl, imageHint: img.imageHint };
}

const createSubmissions = (submitter: string, description: string, timestamp: Date): Submission[] => {
    return [{ submitter, description, timestamp }];
};

export const initialPosts: Post[] = [
  {
    id: 1,
    media: findImage('1').imageUrl,
    mediaHint: findImage('1').imageHint,
    platform: "instagram",
    text: "Mia Khalifa's Latest Dubai Photoshoot",
    caption: "Living my best life in Dubai! The architecture, the culture, everything is simply amazing. Can't wait to share more from this trip! ✨🌆 #DubaiLife #TravelBlogger #Influencer #MiddleEast #LuxuryTravel",
    booms: 1247,
    boomers: 1,
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
    submissions: createSubmissions("miakhalifa", "Living my best life in Dubai! The architecture, the culture, everything is simply amazing. Can't wait to share more from this trip! ✨🌆 #DubaiLife #TravelBlogger #Influencer #MiddleEast #LuxuryTravel", new Date(Date.now() - 1800000)),
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
    text: "Stunning Ocean View Hotel in Colombo",
    caption: "Just checked into this stunning hotel in Colombo! The ocean view from my room is absolutely breathtaking. Highly recommended for anyone visiting Sri Lanka! 🇱🇰✨ #Colombo #SriLanka #Travel #Hotels #Luxury #OceanView",
    booms: 842,
    boomers: 1,
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
    submissions: createSubmissions("travelguru", "Just checked into this stunning hotel in Colombo! The ocean view from my room is absolutely breathtaking. Highly recommended for anyone visiting Sri Lanka! 🇱🇰✨ #Colombo #SriLanka #Travel #Hotels #Luxury #OceanView", new Date(Date.now() - 86400000)),
    location: "Colombo, Sri Lanka",
    likes: "3.2k"
  },
  {
    id: 3,
    media: findImage('3').imageUrl,
    mediaHint: findImage('3').imageHint,
    platform: "twitter",
    text: "Must-Try Seafood Restaurant in Colombo",
    caption: "Discovered this hidden gem in Colombo! The seafood is incredibly fresh and the service is outstanding. A must-visit for food lovers! 🦐🐟 #ColomboEats #SriLankaFood #Seafood #Restaurants #Foodie",
    booms: 521,
    boomers: 2,
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
    submissions: [
        {
            submitter: 'foodexplorer',
            description: "Discovered this hidden gem in Colombo! The seafood is incredibly fresh and the service is outstanding. A must-visit for food lovers! 🦐🐟 #ColomboEats #SriLankaFood #Seafood #Restaurants #Foodie",
            timestamp: new Date(Date.now() - 3600000)
        },
        {
            submitter: 'seafoodlover',
            description: "I second this! Best calamari in town. You have to try their garlic butter sauce.",
            timestamp: new Date(Date.now() - 1800000)
        }
    ],
    likes: "1.8k",
  },
  {
    id: 4,
    media: findImage('4').imageUrl,
    mediaHint: findImage('4').imageHint,
    platform: "youtube",
    text: "Your Complete Travel Guide to Colombo, Sri Lanka",
    caption: "Just published my comprehensive travel guide to Colombo! Covering the best hotels, restaurants, attractions, and hidden gems. Perfect for first-time visitors! 🇱🇰 #Colombo #TravelGuide #SriLanka #Hotels #Restaurants #TravelTips",
    booms: 934,
    boomers: 1,
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
    submissions: createSubmissions("travelvlogger", "Just published my comprehensive travel guide to Colombo! Covering the best hotels, restaurants, attractions, and hidden gems. Perfect for first-time visitors! 🇱🇰 #Colombo #TravelGuide #SriLanka #Hotels #Restaurants #TravelTips", new Date(Date.now() - 172800000)),
    views: "124k",
  },
  {
    id: 5,
    media: findImage('5').imageUrl,
    mediaHint: findImage('5').imageHint,
    platform: "instagram",
    text: "Paradise Found: Overwater Bungalows in the Maldives",
    caption: "This luxury resort in Maldives is absolutely incredible! Waking up to crystal clear waters right from your overwater bungalow is a dream come true. Perfect for honeymooners! 💑🌴 #Maldives #Luxury #Resorts #OverwaterBungalows #Honeymoon #Travel",
    booms: 1567,
    boomers: 1,
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
    submissions: createSubmissions("luxurytraveler", "This luxury resort in Maldives is absolutely incredible! Waking up to crystal clear waters right from your overwater bungalow is a dream come true. Perfect for honeymooners! 💑🌴 #Maldives #Luxury #Resorts #OverwaterBungalows #Honeymoon #Travel", new Date(Date.now() - 259200000)),
    location: "Maldives",
    likes: "8.9k"
  },
  {
    id: 6,
    media: findImage('6').imageUrl,
    mediaHint: findImage('6').imageHint,
    platform: "tiktok",
    text: "Bangkok Street Food: A 24-Hour Eating Guide",
    caption: "Just spent 24 hours eating my way through Bangkok's street food scene! From pad thai to mango sticky rice, everything was amazing! 🍜🥭 #Bangkok #StreetFood #Thailand #FoodTour #Travel #Foodie",
    booms: 721,
    boomers: 1,
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
    submissions: createSubmissions("streetfoodking", "Just spent 24 hours eating my way through Bangkok's street food scene! From pad thai to mango sticky rice, everything was amazing! 🍜🥭 #Bangkok #StreetFood #Thailand #FoodTour #Travel #Foodie", new Date(Date.now() - 7200000)),
    views: "2.1M",
  },
  {
    id: 7,
    media: findImage('7').imageUrl,
    mediaHint: findImage('7').imageHint,
    platform: "instagram",
    text: "The Perfect Matcha Latte at a Hidden Tokyo Cafe",
    caption: "Found this adorable hidden cafe in Tokyo! The matcha latte is perfection and the atmosphere is so cozy. Perfect spot for working or relaxing with friends. ☕️🍵 #Tokyo #Cafes #Matcha #Japan #Coffee #HiddenGems",
    booms: 432,
    boomers: 1,
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
    submissions: createSubmissions("cafehopper", "Found this adorable hidden cafe in Tokyo! The matcha latte is perfection and the atmosphere is so cozy. Perfect spot for working or relaxing with friends. ☕️🍵 #Tokyo #Cafes #Matcha #Japan #Coffee #HiddenGems", new Date(Date.now() - 43200000)),
    location: "Tokyo, Japan",
    likes: "4.3k"
  },
  {
    id: 8,
    media: findImage('13').imageUrl,
    mediaHint: findImage('13').imageHint,
    platform: "openart",
    text: "Futuristic Cityscape created with OpenArt",
    caption: "Exploring the creative possibilities of generative AI. This piece was generated on OpenArt with just a few text prompts. The future is here! #AIArt #GenerativeAI #OpenArt #DigitalArt",
    booms: 650,
    boomers: 1,
    comments: 120,
    submitter: "ai_enthusiast",
    isVerified: false,
    tags: ["AI", "GenerativeArt", "OpenArt", "DigitalArt", "Futurism"],
    url: "https://openart.ai/artwork/12345",
    isNew: true,
    isBoomed: false,
    hasVideo: false,
    shares: 55,
    timestamp: new Date(Date.now() - 9000000), // 2.5 hours ago
    submissions: createSubmissions("ai_enthusiast", "Exploring the creative possibilities of generative AI. This piece was generated on OpenArt with just a few text prompts. The future is here! #AIArt #GenerativeAI #OpenArt #DigitalArt", new Date(Date.now() - 9000000))
  },
  {
    id: 9,
    media: findImage('14').imageUrl,
    mediaHint: findImage('14').imageHint,
    platform: "higgsfield",
    text: "Short film 'Starlight' animated with Higgsfield",
    caption: "Incredible what's possible now. Animated this entire short using Higgsfield's video generation tools. Mind-blowing results from simple text prompts. #Higgsfield #AIVideo #Animation #TextToVideo",
    booms: 780,
    boomers: 1,
    comments: 150,
    submitter: "video_creator",
    isVerified: true,
    tags: ["AI", "Video", "Higgsfield", "Animation", "ShortFilm"],
    url: "https://higgsfield.ai/v/67890",
    isNew: false,
    isBoomed: false,
    hasVideo: true,
    shares: 90,
    timestamp: new Date(Date.now() - 64800000), // 18 hours ago
    submissions: createSubmissions("video_creator", "Incredible what's possible now. Animated this entire short using Higgsfield's video generation tools. Mind-blowing results from simple text prompts. #Higgsfield #AIVideo #Animation #TextToVideo", new Date(Date.now() - 64800000))
  },
  {
    id: 10,
    media: findImage('15').imageUrl,
    mediaHint: findImage('15').imageHint,
    platform: "location",
    text: "Eiffel Tower, Paris - A must-see landmark",
    caption: "The iconic Eiffel Tower in Paris. A breathtaking sight, especially at night when it sparkles. Planning a trip? Don't miss this spot! #Paris #EiffelTower #Travel #France #Landmark",
    booms: 990,
    boomers: 1,
    comments: 210,
    submitter: "paris_lover",
    isVerified: false,
    tags: ["Travel", "Paris", "France", "Landmark", "Tourism"],
    url: "https://www.google.com/maps/place/Eiffel+Tower",
    isNew: false,
    isBoomed: false,
    hasVideo: false,
    shares: 110,
    timestamp: new Date(Date.now() - 345600000), // 4 days ago
    submissions: createSubmissions("paris_lover", "The iconic Eiffel Tower in Paris. A breathtaking sight, especially at night when it sparkles. Planning a trip? Don't miss this spot! #Paris #EiffelTower #Travel #France #Landmark", new Date(Date.now() - 345600000))
  },
  {
    id: 11,
    media: findImage('16').imageUrl,
    mediaHint: findImage('16').imageHint,
    platform: "unknown",
    text: "The Rise of People-Powered Search Engines",
    caption: "Fascinating article on The Verge about how community-driven platforms are changing the way we discover content online. Is this the future of search? #Tech #SearchEngine #Community #Web3",
    booms: 550,
    boomers: 1,
    comments: 95,
    submitter: "web_innovator",
    isVerified: false,
    tags: ["Technology", "Search", "Web", "Community", "FutureTech"],
    url: "https://www.theverge.com/2024/1/1/12345678/people-powered-search-engine-future",
    isNew: true,
    isBoomed: false,
    hasVideo: false,
    shares: 45,
    timestamp: new Date(Date.now() - 21600000), // 6 hours ago
    submissions: createSubmissions("web_innovator", "Fascinating article on The Verge about how community-driven platforms are changing the way we discover content online. Is this the future of search? #Tech #SearchEngine #Community #Web3", new Date(Date.now() - 21600000))
  }
];


export const trendingTags: TrendingTag[] = [
  { name: 'Celebrity News', icon: '🌟' },
  { name: 'Influencer Culture', icon: '📱' },
  { name: 'Social Media', icon: '📲' },
  { name: 'Entertainment', icon: '🎬' },
  { name: 'Lifestyle', icon: '✨' },
];

export const popularSidebarTags: string[] = ['Travel', 'Food', 'Technology', 'Fashion', 'Photography'];


export const mockUserProfile: UserProfileData = {
  user: {
    uid: '12345',
    displayName: 'Jane Doe',
    email: 'jane.doe@example.com',
    photoURL: 'https://i.pravatar.cc/150?u=jane_doe',
    createdAt: new Date(),
    points: 25,
    sharesData: true,
  },
  sharedPosts: [
    initialPosts[2],
    initialPosts[4]
  ],
  viewedPosts: [
    initialPosts[0],
    initialPosts[1],
    initialPosts[3],
    initialPosts[6]
  ]
};
