'use client';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Search, LogIn, UserPlus } from 'lucide-react';
import Link from 'next/link';
import { LogoIcon } from '@/components/icons';

interface AppHeaderProps {
  onSearchChange: (query: string) => void;
}

export default function AppHeader({ onSearchChange }: AppHeaderProps) {
  return (
    <header className="sticky top-0 z-50 w-full border-b bg-card shadow-sm">
      <div className="container mx-auto flex h-16 items-center gap-4 px-4 md:px-6">
        <Link href="/" className="flex items-center gap-2">
          <LogoIcon />
          <span className="text-xl font-bold font-headline text-primary">Trendify</span>
        </Link>
        <div className="relative ml-auto flex-1 md:grow-0">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            type="search"
            placeholder="Search for booming content..."
            className="w-full rounded-full bg-background pl-8 md:w-[200px] lg:w-[320px]"
            onChange={(e) => onSearchChange(e.target.value)}
          />
        </div>
        <div className="hidden items-center gap-2 md:flex">
          <Button variant="outline">
            <LogIn className="mr-2 h-4 w-4" /> Log in
          </Button>
          <Button>
            <UserPlus className="mr-2 h-4 w-4" /> Sign up
          </Button>
        </div>
      </div>
    </header>
  );
}
