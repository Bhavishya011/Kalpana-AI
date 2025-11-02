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
  updateProfile,
} from "firebase/auth";
import { doc, setDoc, getDoc } from "firebase/firestore";
import { auth, db } from "./firebase";
import { usePathname, useRouter } from "next/navigation";
import { i18n } from "../i18n/i18n-config";
import { LoadingKolam } from "@/components/loading-kolam";

type UserProfile = {
  name: string;
  craftType: string;
  email: string;
  createdAt: Date;
};

type AuthContextType = {
  user: User | null;
  loading: boolean;
  signInWithGoogle: () => Promise<any>;
  signInWithEmail: (email: string, pass: string) => Promise<any>;
  signUpWithEmail: (email: string, pass: string, name?: string, craftType?: string) => Promise<any>;
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

  const signUpWithEmail = async (email: string, pass: string, name?: string, craftType?: string) => {
    // Create the user account
    const userCredential = await createUserWithEmailAndPassword(auth, email, pass);
    const user = userCredential.user;

    // Update display name if provided
    if (name) {
      await updateProfile(user, {
        displayName: name,
      });
    }

    // Store user profile in Firestore if name and craftType are provided
    if (name && craftType) {
      const userProfile: UserProfile = {
        name,
        craftType,
        email,
        createdAt: new Date(),
      };

      await setDoc(doc(db, "users", user.uid), userProfile);
      console.log("User profile created in Firestore:", userProfile);
    }

    return userCredential;
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
