'use client';

import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Search, ArrowRight } from 'lucide-react';
import { trendingTags } from '@/lib/data';
import { LogoIcon } from '@/components/icons';
import Link from 'next/link';

export default function LandingPage() {
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState('');

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      router.push(`/home?q=${encodeURIComponent(searchQuery.trim())}`);
    } else {
      router.push('/home');
    }
  };
  
  const handleTagClick = (tag: string) => {
     router.push(`/home?tags=${encodeURIComponent(tag)}`);
  }

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-background text-foreground p-4">
      <div className="max-w-2xl w-full text-center">
        <div className="flex justify-center items-center gap-4 mb-4">
          <LogoIcon />
          <h1 className="text-5xl md:text-6xl font-headline font-bold text-gradient">
            Trendify
          </h1>
        </div>

        <p className="text-lg md:text-xl text-muted-foreground mb-8">
          A search engine powered by people, for people.
        </p>

        <form onSubmit={handleSearch} className="relative mb-4">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
          <Input
            type="search"
            placeholder="What's trending today?"
            className="w-full h-14 pl-12 pr-4 rounded-full bg-secondary/80 text-lg"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </form>

        <div className="flex flex-wrap justify-center items-center gap-2 mb-10">
          <span className="text-sm font-medium text-muted-foreground">Hot Tags:</span>
          {trendingTags.map(tag => (
            <Button
              key={tag.name}
              variant="ghost"
              size="sm"
              className="rounded-full bg-secondary hover:bg-secondary/80 h-auto py-1 px-3"
              onClick={() => handleTagClick(tag.name)}
            >
              {tag.icon} {tag.name}
            </Button>
          ))}
        </div>
        
        <Link href="/home" passHref>
           <Button size="lg" className="rounded-full">
            Explore the Feed <ArrowRight className="ml-2 h-5 w-5" />
          </Button>
        </Link>
      </div>
       <footer className="absolute bottom-4 text-center text-sm text-muted-foreground">
        Discover what's trending across the web, powered by people like you.
      </footer>
    </div>
  );
}
