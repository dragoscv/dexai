'use client';

import { useState } from 'react';
import { signOut } from 'firebase/auth';
import Link from 'next/link';
import { auth } from '@/lib/firebase';
import { useAuth } from '@/lib/auth-context';
import AuthModal from './AuthModal';
import UserAvatar from './UserAvatar';

export default function AuthButton() {
    const { user, loading } = useAuth();
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isMenuOpen, setIsMenuOpen] = useState(false);

    const handleSignOut = async () => {
        try {
            await signOut(auth);
            setIsMenuOpen(false);
        } catch (error) {
            console.error('Error signing out:', error);
        }
    };

    if (loading) {
        return (
            <div className="h-10 w-24 bg-gray-200 animate-pulse rounded-lg"></div>
        );
    }

    if (!user) {
        return (
            <>
                <button
                    onClick={() => setIsModalOpen(true)}
                    className="bg-primary-600 hover:bg-primary-700 text-white font-semibold py-2 px-6 rounded-lg transition-colors shadow-sm hover:shadow"
                >
                    Autentificare
                </button>
                <AuthModal
                    isOpen={isModalOpen}
                    onClose={() => setIsModalOpen(false)}
                />
            </>
        );
    }

    return (
        <div className="relative">
            <button
                onClick={() => setIsMenuOpen(!isMenuOpen)}
                className="flex items-center gap-3 hover:bg-gray-100 rounded-lg py-2 px-3 transition-colors"
            >
                <UserAvatar name={user.displayName || 'User'} photoURL={user.photoURL} size="sm" />
                <div className="hidden md:block text-left">
                    <p className="text-sm font-semibold text-gray-900">
                        {user.displayName}
                    </p>
                    <p className="text-xs text-gray-600">
                        {user.totalPoints || 0} puncte
                    </p>
                </div>
                <svg
                    className={`w-4 h-4 text-gray-600 transition-transform ${isMenuOpen ? 'rotate-180' : ''
                        }`}
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                >
                    <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M19 9l-7 7-7-7"
                    />
                </svg>
            </button>

            {/* Dropdown Menu */}
            {isMenuOpen && (
                <>
                    <div
                        className="fixed inset-0 z-10"
                        onClick={() => setIsMenuOpen(false)}
                    ></div>
                    <div className="absolute right-0 mt-2 w-64 bg-white rounded-lg shadow-lg border border-gray-200 py-2 z-20">
                        <div className="px-4 py-3 border-b border-gray-100">
                            <p className="text-sm font-semibold text-gray-900">
                                {user.displayName}
                            </p>
                            <p className="text-xs text-gray-600">{user.email}</p>
                            <p className="text-xs text-primary-600 font-semibold mt-1">
                                {user.totalPoints || 0} puncte
                            </p>
                        </div>
                        <Link
                            href={`/user/${user.uid}`}
                            className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 transition-colors"
                        >
                            📊 Profilul meu
                        </Link>
                        <Link
                            href="/top"
                            className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 transition-colors"
                        >
                            🏆 Clasament
                        </Link>
                        <div className="border-t border-gray-100 mt-2 pt-2">
                            <button
                                onClick={handleSignOut}
                                className="block w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-50 transition-colors"
                            >
                                🚪 Deconectare
                            </button>
                        </div>
                    </div>
                </>
            )}
        </div>
    );
}
