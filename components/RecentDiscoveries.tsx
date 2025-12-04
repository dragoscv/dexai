'use client';

import { useEffect, useState } from 'react';
import { db } from '@/lib/firebase';
import { collection, onSnapshot, query, orderBy, limit } from 'firebase/firestore';
import Link from 'next/link';
import type { Word } from '@/types';
import { toDateSafe } from '@/lib/timestamp-utils';

export default function RecentDiscoveries() {
    const [recentWords, setRecentWords] = useState<Word[]>([]);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        if (!db) return;

        const wordsQuery = query(
            collection(db, 'words'),
            orderBy('createdAt', 'desc'),
            limit(5)
        );

        const unsubscribe = onSnapshot(wordsQuery, (snapshot) => {
            const words = snapshot.docs.map(doc => ({
                id: doc.id,
                ...doc.data()
            })) as Word[];

            setRecentWords(words);
            setIsLoading(false);
        }, (error) => {
            console.error('Error fetching recent discoveries:', error);
            setIsLoading(false);
        });

        return () => unsubscribe();
    }, []);

    if (isLoading) {
        return (
            <div className="bg-white rounded-lg shadow-md p-6">
                <h3 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
                    ✨ Descoperiri recente
                    <span className="relative flex h-2 w-2">
                        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary-400 opacity-75"></span>
                        <span className="relative inline-flex rounded-full h-2 w-2 bg-primary-500"></span>
                    </span>
                </h3>
                <div className="space-y-3 animate-pulse">
                    {[...Array(5)].map((_, i) => (
                        <div key={i} className="h-12 bg-gray-200 rounded"></div>
                    ))}
                </div>
            </div>
        );
    }

    return (
        <div className="bg-white rounded-lg shadow-md p-6">
            <h3 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
                ✨ Descoperiri recente
                <span className="relative flex h-2 w-2">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary-400 opacity-75"></span>
                    <span className="relative inline-flex rounded-full h-2 w-2 bg-primary-500"></span>
                </span>
            </h3>
            {recentWords.length === 0 ? (
                <p className="text-gray-500 text-center py-4">Nu există descoperiri recente.</p>
            ) : (
                <div className="space-y-3">
                    {recentWords.map((word) => {
                        const date = toDateSafe(word.createdAt);
                        const timeAgo = date ? getTimeAgo(date) : 'recent';
                        return (
                            <Link
                                key={word.id}
                                href={`/cuvant/${word.id}`}
                                className="block p-3 rounded-lg hover:bg-gray-50 transition-colors border border-gray-200 hover:border-primary-300"
                            >
                                <div className="flex items-center justify-between">
                                    <div>
                                        <span className="font-semibold text-gray-900">{word.display}</span>
                                        <span className="text-sm text-gray-500 ml-2">({word.partOfSpeech})</span>
                                    </div>
                                    <span className="text-xs text-gray-400">{timeAgo}</span>
                                </div>
                            </Link>
                        );
                    })}
                </div>
            )}
        </div>
    );
}

function getTimeAgo(date: Date): string {
    const seconds = Math.floor((new Date().getTime() - date.getTime()) / 1000);

    if (seconds < 60) return 'acum';
    if (seconds < 3600) return `${Math.floor(seconds / 60)}min`;
    if (seconds < 86400) return `${Math.floor(seconds / 3600)}h`;
    return `${Math.floor(seconds / 86400)}z`;
}
