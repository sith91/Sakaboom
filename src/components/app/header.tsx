'use client';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Search, LogIn, UserPlus, LogOut } from 'lucide-react';
import Link from 'next/link';
import { LogoIcon } from '@/components/icons';
import { useAuth, useUser } from '@/firebase';
import { signInWithPopup, GoogleAuthProvider, signOut } from 'firebase/auth';
import { useToast } from '@/hooks/use-toast';
import { Avatar, AvatarFallback, AvatarImage } from '../ui/avatar';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { doc, getDoc, setDoc, serverTimestamp } from 'firebase/firestore';
import { useFirestore } from '@/firebase';


interface AppHeaderProps {
  onSearchChange: (query: string) => void;
}

export default function AppHeader({ onSearchChange }: AppHeaderProps) {
  const auth = useAuth();
  const user = useUser();
  const firestore = useFirestore();
  const { toast } = useToast();

  const handleGoogleSignIn = async () => {
    if (!auth || !firestore) return;
    const provider = new GoogleAuthProvider();
    try {
      const result = await signInWithPopup(auth, provider);
      const user = result.user;
      const userRef = doc(firestore, "users", user.uid);
      const userDoc = await getDoc(userRef);
      if (!userDoc.exists()) {
        await setDoc(userRef, {
          uid: user.uid,
          email: user.email,
          displayName: user.displayName,
          photoURL: user.photoURL,
          createdAt: serverTimestamp(),
        });
      }
      toast({
        title: "Signed In",
        description: `Welcome back, ${user.displayName}!`,
      });
    } catch (error) {
      console.error("Error signing in with Google: ", error);
      toast({
        variant: "destructive",
        title: "Sign In Failed",
        description: "Could not sign in with Google. Please try again.",
      });
    }
  };

  const handleSignOut = async () => {
    if (!auth) return;
    try {
      await signOut(auth);
      toast({
        title: "Signed Out",
        description: "You have been successfully signed out.",
      });
    } catch (error) {
      console.error("Error signing out: ", error);
      toast({
        variant: "destructive",
        title: "Sign Out Failed",
        description: "Could not sign out. Please try again.",
      });
    }
  };


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
        <div className="flex items-center gap-2">
          {user ? (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="relative h-8 w-8 rounded-full">
                  <Avatar className="h-8 w-8">
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
            <div className="hidden items-center gap-2 md:flex">
              <Button variant="outline" onClick={handleGoogleSignIn}>
                <LogIn className="mr-2 h-4 w-4" /> Log in
              </Button>
              <Button onClick={handleGoogleSignIn}>
                <UserPlus className="mr-2 h-4 w-4" /> Sign up
              </Button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
