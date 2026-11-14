'use client';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Search, LogIn, UserPlus, LogOut, LayoutDashboard, X, User, Globe, Wallet, Flame, Star, Zap, Activity } from 'lucide-react';
import Link from 'next/link';
import { LogoIcon, Facebook as FacebookIcon } from '@/components/icons';
import { useToast } from '@/hooks/use-toast';
import { Avatar, AvatarFallback, AvatarImage } from '../ui/avatar';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { useState } from 'react';
import AppSidebar from './sidebar';
import { Post } from '@/lib/types';
import { cn } from '@/lib/utils';
import { useEffect } from 'react';
import { auth, googleProvider, facebookProvider, walletProvider, signInWithPopup, signOut, onAuthStateChanged } from '@/lib/supabase';



interface AppHeaderProps {
  onSearchChange: (query: string) => void;
  posts: Post[];
  sortMethod: string;
  onSortChange: (method: string) => void;
  onFilterClick: () => void;
  advancedTagsCount: number;
  onDiscover?: () => void;
  isDiscovering?: boolean;
  onTagClick?: (tag: string) => void;
  allTags?: string[];
}

export default function AppHeader({ 
  onSearchChange,
  posts,
  sortMethod,
  onSortChange,
  onFilterClick,
  advancedTagsCount,
  onDiscover,
  isDiscovering,
  onTagClick,
  allTags
}: AppHeaderProps) {
  const { toast } = useToast();
  const [user, setUser] = useState<any>(null);
  const [isMobileSearchOpen, setMobileSearchOpen] = useState(false);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
    });
    return () => unsubscribe();
  }, []);

  const handleGoogleSignIn = async () => {
    try {
      await signInWithPopup(auth, googleProvider);
      toast({ title: 'Successfully signed in with Google!' });
    } catch (error: any) {
      toast({ title: 'Sign in failed', description: error.message, variant: 'destructive' });
    }
  };

  const handleFacebookSignIn = async () => {
    try {
      await signInWithPopup(auth, facebookProvider);
      toast({ title: 'Successfully signed in with Facebook!' });
    } catch (error: any) {
      toast({ title: 'Sign in failed', description: error.message, variant: 'destructive' });
    }
  };

  const handleWalletSignIn = async () => {
    try {
      await signInWithPopup(auth, walletProvider);
      toast({ title: 'Successfully connected Wallet!' });
    } catch (error: any) {
      toast({ title: 'Sign in failed', description: error.message, variant: 'destructive' });
    }
  };

  const handleSignOut = async () => {
    try {
      await signOut(auth);
      toast({
        title: "Signed Out",
        description: "You have been successfully signed out.",
      });
    } catch (error: any) {
      toast({ title: 'Sign out failed', description: error.message, variant: 'destructive' });
    }
  };


  return (
    <div className="w-full relative shadow-sm z-50">
      {/* Live Marquee Ticker */}
      <div className="w-full bg-black/90 border-b border-boom/20 overflow-hidden flex items-center h-9 relative">
        <div className="absolute inset-y-0 left-0 w-24 z-10 bg-gradient-to-r from-black via-black/80 to-transparent pointer-events-none" />
        <div className="absolute inset-y-0 right-0 w-24 z-10 bg-gradient-to-l from-black via-black/80 to-transparent pointer-events-none" />
        
        <div className="absolute left-0 z-20 flex items-center h-full px-4 bg-black border-r border-boom/20 shadow-[10px_0_15px_-3px_rgba(0,0,0,0.8)]">
           <Activity className="w-3 h-3 text-boom animate-pulse mr-2"/>
           <span className="text-[10px] font-black uppercase tracking-widest text-boom">Trending Flairs</span>
        </div>

        <div className="flex whitespace-nowrap animate-ticker group hover:[animation-play-state:paused] text-[11px] font-bold text-white/60 ml-28 uppercase tracking-wide">
          {/* Double the array for seamless infinite scroll loop */}
          {[1, 2].map((copyIndex) => (
              <div key={copyIndex} className="flex items-center">
                {(allTags || []).slice(0, 15).map((tag, tagIndex) => (
                  <span key={`${copyIndex}-${tagIndex}`} onClick={() => onTagClick && onTagClick(tag)} className="flex items-center gap-1.5 mx-6 cursor-pointer hover:text-white transition-colors">
                     <Flame className="w-3 h-3 text-primary"/> #{tag}
                  </span>
                ))}
                <span className="flex items-center gap-1.5 mx-6 text-white/90">
                   <Star className="w-3 h-3 text-yellow-500 fill-yellow-500"/> SAKA ARCHITECT: <span className="text-boom">Web3 Indexer</span>
                </span>
                <span className="flex items-center gap-1.5 mx-6 text-white/90">
                   <Zap className="w-3 h-3 text-boom fill-boom"/> NETWORK VOLUME: <span className="text-white">12,450 BOOMS/HR</span>
                </span>
             </div>
          ))}
        </div>
      </div>

    <header className="sticky top-0 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 text-foreground">
      <div className="container mx-auto flex h-16 items-center justify-between gap-4 px-4 md:px-6">
        <Link href="/home" className="flex items-center gap-3 mr-4 group transition-all">
          <div className="group-hover:rotate-12 transition-transform duration-300">
            <LogoIcon />
          </div>
          <span className="text-2xl font-bold font-headline tracking-tight text-foreground hidden sm:inline-block">
            Sakaboom
          </span>
        </Link>
        
        {/* Desktop Search */}
        <div className="relative hidden md:flex items-center flex-1 max-w-2xl group">
          <div className="absolute -inset-0.5 bg-gradient-to-r from-primary to-boom rounded-full blur opacity-10 group-focus-within:opacity-30 transition duration-500"></div>
          <div className="relative flex items-center w-full">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              type="search"
              placeholder="Search human-curated indices..."
              className="w-full h-11 rounded-full bg-secondary/50 backdrop-blur-sm border-white/5 pl-11 pr-24 focus:bg-secondary/80 transition-all shadow-inner"
              onChange={(e) => onSearchChange(e.target.value)}
            />
            <div className="absolute right-3 top-1/2 -translate-y-1/2">
               <Button 
                 variant="ghost" 
                 size="sm" 
                 onClick={onDiscover}
                 disabled={isDiscovering}
                 className="h-7 px-3 rounded-full bg-primary/10 text-primary border border-primary/20 hover:bg-primary/20 transition-all font-bold text-[10px] uppercase tracking-wider"
               >
                 {isDiscovering ? (
                   <div className="flex items-center gap-2">
                     <div className="w-2 h-2 bg-primary animate-ping rounded-full" />
                     Discovering...
                   </div>
                 ) : (
                   "Saka Discovery"
                 )}
               </Button>
            </div>
          </div>
        </div>

        {/* Mobile Search - Revealed */}
        {isMobileSearchOpen && (
          <div className="absolute top-0 left-0 w-full h-full bg-background z-20 flex items-center px-4 md:hidden">
            <div className="relative w-full">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                type="search"
                placeholder="Search..."
                className="w-full rounded-full bg-secondary/80 pl-9"
                onChange={(e) => onSearchChange(e.target.value)}
                autoFocus
              />
            </div>
            <Button variant="ghost" size="icon" onClick={() => setMobileSearchOpen(false)}>
              <X className="h-5 w-5"/>
            </Button>
          </div>
        )}

        <div className={cn("flex items-center gap-1 md:gap-2 ml-auto", isMobileSearchOpen && 'opacity-0')}>
          {/* Mobile Search Trigger */}
          <Button variant="ghost" size="icon" className="md:hidden" onClick={() => setMobileSearchOpen(true)}>
            <Search />
          </Button>


          
          <Popover>
            <PopoverTrigger asChild>
                <Button variant="outline" size="icon">
                  <LayoutDashboard className="w-5 h-5" />
                </Button>
            </PopoverTrigger>
            <PopoverContent className="w-80" align="end">
              <AppSidebar 
                posts={posts}
                isPopover={true} 
                sortMethod={sortMethod}
                onSortChange={onSortChange}
                onFilterClick={onFilterClick}
                advancedTagsCount={advancedTagsCount}
              />
            </PopoverContent>
          </Popover>
          {user ? (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="relative h-9 w-9 rounded-full">
                  <Avatar className="h-9 w-9">
                    <AvatarImage src={user.photoURL || ''} alt={user.displayName || ''} />
                    <AvatarFallback>{user.displayName?.charAt(0)}</AvatarFallback>
                  </Avatar>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="w-56" align="end" forceMount>
                <DropdownMenuLabel className="font-normal">
                  <div className="flex flex-col space-y-1">
                    <p className="text-sm font-medium leading-none">{user.displayName}</p>
                    <p className="text-xs leading-none text-muted-foreground">
                      {user.email}
                    </p>
                  </div>
                </DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={handleSignOut}>
                  <LogOut className="mr-2 h-4 w-4" />
                  <span>Log out</span>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          ) : (
             <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline"><LogIn className="mr-0 md:mr-2 h-4 w-4" /><span className="hidden md:inline">Log in</span></Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent>
                <DropdownMenuItem onClick={handleGoogleSignIn}>
                  <svg className="mr-2 h-4 w-4" aria-hidden="true" focusable="false" data-prefix="fab" data-icon="google" role="img" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 488 512"><path fill="currentColor" d="M488 261.8C488 403.3 381.5 512 244 512 111.8 512 0 400.2 0 261.8 0 123.8 111.8 12.5 244 12.5c72.6 0 134.3 29.3 179.9 74.5L356.1 154.3c-34.4-33.4-85.3-54.3-138.2-54.3-109.1 0-198.3 88.3-198.3 197.8s89.2 197.8 198.3 197.8c114.9 0 181.7-83.3 185.5-161.4H244V261.8h244z"></path></svg>
                  <span>Google</span>
                </DropdownMenuItem>
                <DropdownMenuItem onClick={handleFacebookSignIn}>
                  <FacebookIcon className="mr-2 h-4 w-4" />
                  <span>Facebook</span>
                </DropdownMenuItem>
                <DropdownMenuItem onClick={handleWalletSignIn}>
                  <Wallet className="mr-2 h-4 w-4 text-boom" />
                  <span>Wallet</span>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          )}
        </div>
      </div>
    </header>
    </div>
  );
}
