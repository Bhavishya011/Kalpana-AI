"use client";

import {
  createContext,
  useContext,
  useEffect,
  useState,
  ReactNode,
} from "react";
import {
  onAuthStateChanged,
  User,
  GoogleAuthProvider,
  signInWithPopup,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signOut,
} from "firebase/auth";
import { auth } from "./firebase";
import { usePathname, useRouter } from "next/navigation";
import { i18n } from "../i18n/i18n-config";
import { LoadingKolam } from "@/components/loading-kolam";

type AuthContextType = {
  user: User | null;
  loading: boolean;
  signInWithGoogle: () => Promise<any>;
  signInWithEmail: (email: string, pass: string) => Promise<any>;
  signUpWithEmail: (email: string, pass: string) => Promise<any>;
  signOutUser: () => Promise<void>;
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  const signInWithGoogle = () => {
    const provider = new GoogleAuthProvider();
    return signInWithPopup(auth, provider);
  };

  const signInWithEmail = (email: string, pass: string) => {
    return signInWithEmailAndPassword(auth, email, pass);
  };

  const signUpWithEmail = (email: string, pass: string) => {
    return createUserWithEmailAndPassword(auth, email, pass);
  };

  const signOutUser = async () => {
    try {
      // Clear local storage and cookies first
      localStorage.removeItem('auth-user');
      document.cookie = 'firebase-session=; path=/; max-age=-1;';
      
      // Then sign out from Firebase
      await signOut(auth);
      
      // Force reload to ensure clean state
      window.location.href = '/';
    } catch (error) {
      console.error('Sign out error:', error);
      // Force clear even on error
      localStorage.removeItem('auth-user');
      document.cookie = 'firebase-session=; path=/; max-age=-1;';
      window.location.href = '/';
    }
  };

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      try {
        setUser(user);
        
        if (user) {
          // Get fresh token and set cookie
          const session = await user.getIdToken(true); // Force refresh
          document.cookie = `firebase-session=${session}; path=/; max-age=${60 * 60 * 24 * 7}; secure; samesite=strict`;
          
          // Also store in localStorage for persistence across tabs
          localStorage.setItem('auth-user', JSON.stringify({
            uid: user.uid,
            email: user.email,
            displayName: user.displayName
          }));
        } else {
          // Clear both cookie and localStorage
          document.cookie = 'firebase-session=; path=/; max-age=-1;';
          localStorage.removeItem('auth-user');
        }
      } catch (error) {
        console.error('Auth state change error:', error);
        // Clear auth data on error
        document.cookie = 'firebase-session=; path=/; max-age=-1;';
        localStorage.removeItem('auth-user');
        setUser(null);
      }

      setLoading(false);
    });

    // Check for persisted auth state on initial load
    const persistedUser = localStorage.getItem('auth-user');
    if (persistedUser && !auth.currentUser) {
      // Wait a bit for Firebase to initialize
      setTimeout(() => {
        if (!auth.currentUser) {
          // Clear stale data
          localStorage.removeItem('auth-user');
          document.cookie = 'firebase-session=; path=/; max-age=-1;';
        }
      }, 2000);
    }

    return () => unsubscribe();
  }, []);

  if (loading) {
    return (
      <div className="flex h-screen items-center justify-center">
        <LoadingKolam />
      </div>
    );
  }

  return (
    <AuthContext.Provider
      value={{ user, loading, signInWithGoogle, signInWithEmail, signUpWithEmail, signOutUser }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
