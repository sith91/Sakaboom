'use client';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Search, LogIn, UserPlus, LogOut, LayoutDashboard, X } from 'lucide-react';
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


interface AppHeaderProps {
  onSearchChange: (query: string) => void;
  posts: Post[];
  sortMethod: string;
  onSortChange: (method: string) => void;
  onFilterClick: () => void;
  advancedTagsCount: number;
}

export default function AppHeader({ 
  onSearchChange,
  posts,
  sortMethod,
  onSortChange,
  onFilterClick,
  advancedTagsCount
}: AppHeaderProps) {
  const { toast } = useToast();
  const [user, setUser] = useState<any>(null); // Placeholder for user state
  const [isMobileSearchOpen, setMobileSearchOpen] = useState(false);

  const handleGoogleSignIn = () => {
    toast({ title: 'Sign in functionality to be implemented' });
  };

  const handleFacebookSignIn = () => {
    toast({ title: 'Sign in functionality to be implemented' });
  };

  const handleSignOut = async () => {
    toast({
      title: "Signed Out",
      description: "You have been successfully signed out.",
    });
  };


  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 text-foreground shadow-sm">
      <div className="container mx-auto flex h-16 items-center justify-between gap-4 px-4 md:px-6">
        <Link href="/" className="flex items-center gap-2 mr-4">
          <LogoIcon />
          <span className="text-xl font-bold font-headline text-primary hidden sm:inline-block">Trendify</span>
        </Link>
        
        {/* Desktop Search */}
        <div className="relative hidden md:flex items-center flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            type="search"
            placeholder="Search for booming content..."
            className="w-full rounded-full bg-secondary/80 pl-9 md:w-[300px] lg:w-[500px]"
            onChange={(e) => onSearchChange(e.target.value)}
          />
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
              </DropdownMenuContent>
            </DropdownMenu>
          )}
        </div>
      </div>
    </header>
  );
}
