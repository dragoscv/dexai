'use client';

import { useEffect, useState } from 'react';
import { db } from '@/lib/firebase';
import { collection, onSnapshot, query, orderBy, getCountFromServer } from 'firebase/firestore';
import StatsCard from '@/components/StatsCard';

interface Stats {
    totalWords: number;
    totalUsers: number;
    wordsAddedToday: number;
}

interface RealtimeStatsProps {
    initialStats: Stats;
}

export default function RealtimeStats({ initialStats }: RealtimeStatsProps) {
    const [stats, setStats] = useState<Stats>(initialStats);
    const [isLive, setIsLive] = useState(false);

    useEffect(() => {
        if (!db) return;

        setIsLive(true);

        // Listen to words collection for total count
        const wordsCollection = collection(db, 'words');
        const unsubscribeWords = onSnapshot(wordsCollection, async () => {
            try {
                const wordsCount = await getCountFromServer(wordsCollection);

                // Get today's words
                const today = new Date();
                today.setHours(0, 0, 0, 0);
                const todayQuery = query(
                    wordsCollection,
                    orderBy('createdAt', 'desc')
                );

                // Count manually from snapshot (for today's count)
                const todaySnapshot = await new Promise<number>((resolve) => {
                    const unsub = onSnapshot(todayQuery, (snapshot) => {
                        const todayCount = snapshot.docs.filter(doc => {
                            const data = doc.data();
                            if (data.createdAt?.toDate) {
                                return data.createdAt.toDate() >= today;
                            }
                            return false;
                        }).length;
                        unsub();
                        resolve(todayCount);
                    });
                });

                setStats(prev => ({
                    ...prev,
                    totalWords: wordsCount.data().count,
                    wordsAddedToday: todaySnapshot
                }));
            } catch (error) {
                console.error('Error updating word stats:', error);
            }
        });

        // Listen to users collection for total count
        const usersCollection = collection(db, 'users');
        const unsubscribeUsers = onSnapshot(usersCollection, async () => {
            try {
                const usersCount = await getCountFromServer(usersCollection);
                setStats(prev => ({
                    ...prev,
                    totalUsers: usersCount.data().count
                }));
            } catch (error) {
                console.error('Error updating user stats:', error);
            }
        });

        return () => {
            unsubscribeWords();
            unsubscribeUsers();
            setIsLive(false);
        };
    }, []);

    return (
        <>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-4xl mx-auto">
                <StatsCard
                    label="Cuvinte adăugate"
                    value={stats.totalWords}
                    icon="📚"
                />
                <StatsCard
                    label="Utilizatori înregistrați"
                    value={stats.totalUsers}
                    icon="👥"
                />
                <StatsCard
                    label="Cuvinte adăugate azi"
                    value={stats.wordsAddedToday}
                    icon="✨"
                />
            </div>
            {isLive && (
                <div className="flex justify-center mt-4">
                    <div className="inline-flex items-center gap-2 px-3 py-1 bg-green-100 text-green-800 rounded-full text-sm font-medium">
                        <span className="relative flex h-2 w-2">
                            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
                            <span className="relative inline-flex rounded-full h-2 w-2 bg-green-500"></span>
                        </span>
                        Live
                    </div>
                </div>
            )}
        </>
    );
}
