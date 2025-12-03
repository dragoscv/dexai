'use client';

import React, { createContext, useContext, useEffect, useState } from 'react';
import {
    User as FirebaseUser,
    GoogleAuthProvider,
    signInWithPopup,
    signOut as firebaseSignOut,
    onAuthStateChanged,
} from 'firebase/auth';
import { doc, getDoc, setDoc, updateDoc } from 'firebase/firestore';
import { auth, db } from './firebase';
import type { User } from '@/types';

interface AuthContextType {
    user: User | null;
    firebaseUser: FirebaseUser | null;
    loading: boolean;
    signInWithGoogle: () => Promise<void>;
    signOut: () => Promise<void>;
    getIdToken: () => Promise<string | null>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
    const [firebaseUser, setFirebaseUser] = useState<FirebaseUser | null>(null);
    const [user, setUser] = useState<User | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
            setFirebaseUser(firebaseUser);

            if (firebaseUser) {
                // Fetch or create user document in Firestore
                const userRef = doc(db, 'users', firebaseUser.uid);
                const userSnap = await getDoc(userRef);

                if (userSnap.exists()) {
                    // Update last login
                    await updateDoc(userRef, {
                        lastLoginAt: new Date(),
                    });

                    setUser(userSnap.data() as User);
                } else {
                    // Create new user document
                    const newUser: User = {
                        uid: firebaseUser.uid,
                        displayName: firebaseUser.displayName || 'Utilizator',
                        photoURL: firebaseUser.photoURL,
                        email: firebaseUser.email || '',
                        createdAt: new Date() as any,
                        totalPoints: 0,
                        dailyPoints: 0,
                        wordsDiscovered: 0,
                        lastLoginAt: new Date() as any,
                    };

                    await setDoc(userRef, newUser);
                    setUser(newUser);
                }
            } else {
                setUser(null);
            }

            setLoading(false);
        });

        return () => unsubscribe();
    }, []);

    const signInWithGoogle = async () => {
        const provider = new GoogleAuthProvider();
        try {
            await signInWithPopup(auth, provider);
        } catch (error) {
            console.error('Error signing in with Google:', error);
            throw error;
        }
    };

    const signOut = async () => {
        try {
            await firebaseSignOut(auth);
            setUser(null);
            setFirebaseUser(null);
        } catch (error) {
            console.error('Error signing out:', error);
            throw error;
        }
    };

    const getIdToken = async (): Promise<string | null> => {
        if (!firebaseUser) return null;
        try {
            return await firebaseUser.getIdToken();
        } catch (error) {
            console.error('Error getting ID token:', error);
            return null;
        }
    };

    return (
        <AuthContext.Provider
            value={{
                user,
                firebaseUser,
                loading,
                signInWithGoogle,
                signOut,
                getIdToken,
            }}
        >
            {children}
        </AuthContext.Provider>
    );
}

export function useAuth() {
    const context = useContext(AuthContext);
    if (context === undefined) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
}
