'use client';

import { useState, useEffect, use } from 'react';
import { mockCollections, initialPosts } from '@/lib/data';
import { notFound, useRouter } from 'next/navigation';
import Image from 'next/image';
import { Badge } from '@/components/ui/badge';
import PostCard from '@/components/app/post-card';
import { ArrowLeft, FolderHeart, Zap, ShieldCheck, Lock, Wallet } from 'lucide-react';
import Link from 'next/link';
import { auth, googleProvider, facebookProvider, walletProvider, signInWithPopup, onAuthStateChanged } from '@/lib/supabase';
import { Button } from '@/components/ui/button';
import { Facebook as FacebookIcon } from '@/components/icons';

interface CollectionPageProps {
  params: Promise<{ id: string }>;
}

export default function CollectionPage({ params }: CollectionPageProps) {
  const resolvedParams = use(params);
  const router = useRouter();
  const [user, setUser] = useState<any>(null);
  const [isLoadingAuth, setIsLoadingAuth] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
      setIsLoadingAuth(false);
    });
    return () => unsubscribe();
  }, []);

  const handleGoogleSignIn = async () => {
    try {
      await signInWithPopup(auth, googleProvider);
    } catch (error: any) {
      console.error(error);
    }
  };
  
  const handleFacebookSignIn = async () => {
    try {
      await signInWithPopup(auth, facebookProvider);
    } catch (error: any) {
      console.error(error);
    }
  };
  
  const handleWalletSignIn = async () => {
    try {
      await signInWithPopup(auth, walletProvider);
    } catch (error: any) {
      console.error(error);
    }
  };

  const collection = mockCollections.find(c => c.id === resolvedParams.id);
  
  if (!collection) {
    notFound();
  }

  if (isLoadingAuth) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="min-h-screen bg-black flex flex-col items-center justify-center text-center p-4">
        <div className="p-8 bg-white/5 border border-white/10 rounded-[2rem] backdrop-blur-xl flex flex-col items-center max-w-md w-full shadow-2xl">
          <Lock className="w-16 h-16 text-boom mb-6 animate-pulse drop-shadow-[0_0_15px_rgba(255,107,53,0.8)]" />
          <h1 className="text-3xl font-headline font-bold text-white mb-4">Sign-in to View</h1>
          <p className="text-white/60 mb-8">Curated collections are exclusive to our registered community. Please sign in to view them.</p>
          
          <div className="flex flex-col gap-3 w-full mb-6">
              <Button onClick={handleGoogleSignIn} variant="secondary" size="lg" className="rounded-xl w-full">
                <svg className="mr-2 h-5 w-5" aria-hidden="true" focusable="false" data-prefix="fab" data-icon="google" role="img" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 488 512"><path fill="currentColor" d="M488 261.8C488 403.3 381.5 512 244 512 111.8 512 0 400.2 0 261.8 0 123.8 111.8 12.5 244 12.5c72.6 0 134.3 29.3 179.9 74.5L356.1 154.3c-34.4-33.4-85.3-54.3-138.2-54.3-109.1 0-198.3 88.3-198.3 197.8s89.2 197.8 198.3 197.8c114.9 0 181.7-83.3 185.5-161.4H244V261.8h244z"></path></svg>
                Continue with Google
              </Button>
              <Button onClick={handleFacebookSignIn} variant="secondary" size="lg" className="rounded-xl w-full">
                  <FacebookIcon className="mr-2 h-5 w-5" />
                  Continue with Facebook
              </Button>
              <Button onClick={handleWalletSignIn} variant="default" size="lg" className="rounded-xl w-full bg-boom hover:bg-boom/90 text-white">
                  <Wallet className="mr-2 h-5 w-5" />
                  Connect Wallet
              </Button>
          </div>

          <Button onClick={() => router.push('/home')} variant="ghost" className="text-white/50 hover:text-white hover:bg-white/10 rounded-full h-10 px-6 w-full">
            <ArrowLeft className="w-4 h-4 mr-2" /> Return to Feed
          </Button>
        </div>
      </div>
    );
  }

  // Gather the exact posts assigned to this collection
  const postsInCollection = initialPosts.filter(post => collection.postIds.includes(post.id));

  return (
    <div className="bg-black min-h-screen text-foreground relative overflow-hidden">
      {/* Immersive Apple VisionOS style ambient background */}
      <div className="absolute inset-0 z-0">
        <Image 
          src={collection.image} 
          alt="Ambient Background" 
          fill 
          className="object-cover opacity-30 blur-3xl scale-110"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-black/20 via-black/80 to-black pointer-events-none" />
      </div>

      <div className="relative z-10 w-full">
        {/* Spatial Floating Header */}
        <header className="sticky top-0 w-full flex items-center justify-between p-6 bg-black/30 backdrop-blur-3xl border-b border-white/5 z-50 transition-all">
           <Link href="/home" className="flex items-center gap-2 text-white/70 hover:text-white transition-colors uppercase tracking-widest text-xs font-black">
             <ArrowLeft className="w-4 h-4 text-primary" /> Back to Nexus
           </Link>
           <div className="flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/5 border border-white/10 shadow-2xl backdrop-blur-2xl">
              <ShieldCheck className="w-4 h-4 text-boom" />
              <span className="text-xs font-medium text-white/90">Curated by @{collection.curator}</span>
           </div>
        </header>

        <main className="container mx-auto max-w-6xl py-12 px-4">
           {/* Immersive Collection Hero */}
           <div className="flex flex-col md:flex-row gap-10 items-end mb-16 animate-in fade-in slide-in-from-bottom-8 duration-700">
              <div className="relative w-48 h-48 sm:w-64 sm:h-64 rounded-3xl overflow-hidden shadow-[0_0_50px_-10px_rgba(109,40,217,0.5)] border border-white/20 shrink-0">
                 <Image 
                   src={collection.image} 
                   alt={collection.name} 
                   fill 
                   className="object-cover hover:scale-105 transition-transform duration-700" 
                 />
              </div>
              <div className="flex-1 space-y-4">
                 <div className="flex items-center gap-3">
                    <Badge className="bg-primary/20 text-primary border-primary/30 uppercase tracking-widest text-xs py-1">Web3 Index</Badge>
                    <Badge className="bg-boom/20 text-boom border-boom/30 uppercase tracking-widest text-xs py-1 flex items-center gap-1">
                      <Zap className="w-3 h-3 fill-boom" /> {collection.booms} Booms
                    </Badge>
                 </div>
                 <h1 className="text-5xl sm:text-7xl font-headline font-black tracking-tighter text-white drop-shadow-2xl">
                    {collection.name}
                 </h1>
                 <p className="text-lg sm:text-xl text-white/60 font-light leading-relaxed max-w-2xl">
                   {collection.description}
                 </p>
                 <div className="flex flex-wrap gap-2 pt-4">
                   {collection.tags.map(tag => (
                     <Badge key={tag} variant="secondary" className="glass-dark border-white/10 text-white/70">#{tag}</Badge>
                   ))}
                 </div>
              </div>
           </div>

           {/* Spatial Bento Grid Timeline */}
           <div className="animate-in fade-in slide-in-from-bottom-12 duration-1000 delay-200">
               <div className="flex items-center justify-between mb-8 pb-4 border-b border-white/10">
                 <h2 className="text-2xl font-bold flex items-center gap-2">
                   <FolderHeart className="w-6 h-6 text-primary" /> 
                   Indexed Perspectives ({postsInCollection.length})
                 </h2>
               </div>

               {postsInCollection.length > 0 ? (
                 <div className="bento-grid">
                   {postsInCollection.map((post, index) => (
                     <PostCard 
                       key={post.id} 
                       post={post} 
                       index={index} 
                     />
                   ))}
                 </div>
               ) : (
                 <div className="text-center py-32 rounded-3xl border border-dashed border-white/20 bg-white/5 backdrop-blur-xl">
                    <FolderHeart className="w-16 h-16 text-white/20 mx-auto mb-4" />
                    <p className="text-xl font-medium text-white/50">This collection is currently empty.</p>
                 </div>
               )}
           </div>
        </main>
      </div>
    </div>
  );
}
