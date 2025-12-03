'use client';

import { useState, useEffect } from 'react';
import { toast } from 'sonner';
import { useAuth } from '@/lib/auth-context';
import type { VoteType, Word } from '@/types';

interface WordVotingButtonsProps {
    word: Word;
    className?: string;
}

interface VoteCounts {
    likes: number;
    dislikes: number;
    validations: number;
    errors: number;
}

export default function WordVotingButtons({ word, className = '' }: WordVotingButtonsProps) {
    const [currentVote, setCurrentVote] = useState<VoteType | null>(null);
    const [counts, setCounts] = useState<VoteCounts>({
        likes: word.likesCount || 0,
        dislikes: word.dislikesCount || 0,
        validations: word.validationsCount || 0,
        errors: word.errorsCount || 0,
    });
    const [isVoting, setIsVoting] = useState(false);
    const { user, getIdToken } = useAuth();

    // Fetch user's current vote on mount
    useEffect(() => {
        const fetchUserVote = async () => {
            if (!user) return;

            try {
                const token = await getIdToken();
                const headers: HeadersInit = {};
                if (token) {
                    headers['Authorization'] = `Bearer ${token}`;
                }

                const response = await fetch(`/api/words/${word.id}/vote`, {
                    headers,
                });

                const data = await response.json();
                if (data.success) {
                    setCurrentVote(data.data.userVote);
                    setCounts(data.data.counts);
                }
            } catch (error) {
                console.error('Error fetching vote:', error);
            }
        };

        fetchUserVote();
    }, [user, word.id, getIdToken]);

    const handleVote = async (voteType: VoteType) => {
        if (!user) {
            toast.error('Autentifică-te pentru a vota');
            return;
        }

        // Toggle vote if clicking same button
        const newVote = currentVote === voteType ? null : voteType;

        setIsVoting(true);

        try {
            const token = await getIdToken();
            const response = await fetch(`/api/words/${word.id}/vote`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`,
                },
                body: JSON.stringify({ voteType: newVote }),
            });

            const data = await response.json();

            if (data.success) {
                setCurrentVote(newVote);
                setCounts(data.data.counts);

                if (newVote === null) {
                    toast.success('Votul a fost eliminat');
                } else if (newVote === 'validate') {
                    toast.success('Mulțumim pentru validare!');
                } else if (newVote === 'report_error') {
                    toast.success('Eroarea a fost raportată. Mulțumim!');
                } else {
                    toast.success('Votul tău a fost înregistrat');
                }
            } else {
                toast.error(data.message || 'Eroare la votare');
            }
        } catch (error) {
            console.error('Vote error:', error);
            toast.error('Eroare la votare');
        } finally {
            setIsVoting(false);
        }
    };

    const getButtonClasses = (voteType: VoteType) => {
        const isActive = currentVote === voteType;
        const baseClasses = 'px-4 py-2 rounded-lg font-medium transition-all duration-200 flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed';

        if (isActive) {
            if (voteType === 'like') return `${baseClasses} bg-green-500 text-white hover:bg-green-600`;
            if (voteType === 'dislike') return `${baseClasses} bg-red-500 text-white hover:bg-red-600`;
            if (voteType === 'validate') return `${baseClasses} bg-primary-500 text-white hover:bg-primary-600`;
            if (voteType === 'report_error') return `${baseClasses} bg-amber-500 text-white hover:bg-amber-600`;
        }

        return `${baseClasses} bg-white border-2 border-gray-300 text-gray-700 hover:border-gray-400 hover:bg-gray-50`;
    };

    return (
        <div className={`flex flex-wrap gap-3 ${className}`}>
            {/* Like Button */}
            <button
                onClick={() => handleVote('like')}
                disabled={isVoting}
                className={getButtonClasses('like')}
                title={user ? 'Îmi place acest cuvânt' : 'Autentifică-te pentru a vota'}
            >
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M2 10.5a1.5 1.5 0 113 0v6a1.5 1.5 0 01-3 0v-6zM6 10.333v5.43a2 2 0 001.106 1.79l.05.025A4 4 0 008.943 18h5.416a2 2 0 001.962-1.608l1.2-6A2 2 0 0015.56 8H12V4a2 2 0 00-2-2 1 1 0 00-1 1v.667a4 4 0 01-.8 2.4L6.8 7.933a4 4 0 00-.8 2.4z" />
                </svg>
                <span>Like</span>
                {counts.likes > 0 && (
                    <span className="px-2 py-0.5 text-xs rounded-full bg-black/10">
                        {counts.likes}
                    </span>
                )}
            </button>

            {/* Dislike Button */}
            <button
                onClick={() => handleVote('dislike')}
                disabled={isVoting}
                className={getButtonClasses('dislike')}
                title={user ? 'Acest cuvânt are probleme' : 'Autentifică-te pentru a vota'}
            >
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M18 9.5a1.5 1.5 0 11-3 0v-6a1.5 1.5 0 013 0v6zM14 9.667v-5.43a2 2 0 00-1.105-1.79l-.05-.025A4 4 0 0011.055 2H5.64a2 2 0 00-1.962 1.608l-1.2 6A2 2 0 004.44 12H8v4a2 2 0 002 2 1 1 0 001-1v-.667a4 4 0 01.8-2.4l1.4-1.866a4 4 0 00.8-2.4z" />
                </svg>
                <span>Dislike</span>
                {counts.dislikes > 0 && (
                    <span className="px-2 py-0.5 text-xs rounded-full bg-black/10">
                        {counts.dislikes}
                    </span>
                )}
            </button>

            {/* Validate Button */}
            <button
                onClick={() => handleVote('validate')}
                disabled={isVoting}
                className={getButtonClasses('validate')}
                title={user ? 'Confirm că acest cuvânt este corect' : 'Autentifică-te pentru a valida'}
            >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <span>Validează</span>
                {counts.validations > 0 && (
                    <span className="px-2 py-0.5 text-xs rounded-full bg-black/10">
                        {counts.validations}
                    </span>
                )}
            </button>

            {/* Report Error Button */}
            <button
                onClick={() => handleVote('report_error')}
                disabled={isVoting}
                className={getButtonClasses('report_error')}
                title={user ? 'Raportează o eroare în acest cuvânt' : 'Autentifică-te pentru a raporta'}
            >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                </svg>
                <span>Raportează</span>
                {counts.errors > 0 && (
                    <span className="px-2 py-0.5 text-xs rounded-full bg-black/10">
                        {counts.errors}
                    </span>
                )}
            </button>
        </div>
    );
}
