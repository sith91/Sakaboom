'use client';

import { IndexCollection } from '@/lib/types';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import { FolderHeart, Zap } from 'lucide-react';
import Image from 'next/image';

interface CollectionCardProps {
  collection: IndexCollection;
  onClick?: (collection: IndexCollection) => void;
}

export default function CollectionCard({ collection, onClick }: CollectionCardProps) {
  return (
    <Card 
      className="overflow-hidden cursor-pointer group hover:border-primary/50 transition-all duration-300 glass-dark"
      onClick={() => onClick?.(collection)}
    >
      <div className="relative h-40 w-full overflow-hidden">
        <Image 
          src={collection.image} 
          alt={collection.name} 
          fill 
          className="object-cover group-hover:scale-110 transition-transform duration-500 opacity-60 group-hover:opacity-100"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-background via-background/20 to-transparent" />
        <div className="absolute bottom-3 left-3 flex items-center gap-2">
           <Badge className="bg-primary/80 backdrop-blur-md rounded-full shadow-lg">
             {collection.postIds.length} Indices
           </Badge>
        </div>
      </div>
      <CardContent className="p-4 space-y-3">
        <div className="flex justify-between items-start">
          <h3 className="font-headline font-bold text-lg group-hover:text-primary transition-colors leading-tight">
            {collection.name}
          </h3>
          <FolderHeart className="w-5 h-5 text-muted-foreground group-hover:text-boom transition-colors" />
        </div>
        
        <p className="text-sm text-muted-foreground line-clamp-2 leading-relaxed">
          {collection.description}
        </p>

        <div className="flex flex-wrap gap-1.5 pt-2">
          {collection.tags.slice(0, 3).map(tag => (
            <span key={tag} className="text-[10px] uppercase tracking-wider font-bold text-muted-foreground/60">
              #{tag}
            </span>
          ))}
        </div>

        <div className="pt-2 flex items-center justify-between border-t border-white/5">
           <div className="flex items-center gap-2">
              <div className="w-5 h-5 rounded-full bg-secondary flex items-center justify-center text-[10px] text-white overflow-hidden">
                {collection.curator.charAt(0).toUpperCase()}
              </div>
              <span className="text-xs text-muted-foreground">@{collection.curator}</span>
           </div>
           <div className="flex items-center gap-1 text-boom">
             <Zap className="w-3 h-3 fill-current" />
             <span className="text-xs font-bold">{collection.booms}</span>
           </div>
        </div>
      </CardContent>
    </Card>
  );
}
