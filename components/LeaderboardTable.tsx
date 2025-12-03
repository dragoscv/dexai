'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import type { LeaderboardEntry } from '@/types';
import UserAvatar from './UserAvatar';
import { formatNumber } from '@/lib/utils';

interface LeaderboardTableProps {
    limit?: number;
    period?: 'today' | 'week' | 'month' | 'allTime';
}

export default function LeaderboardTable({
    limit,
    period = 'allTime',
}: LeaderboardTableProps) {
    const [leaders, setLeaders] = useState<LeaderboardEntry[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        async function fetchLeaderboard() {
            try {
                const params = new URLSearchParams();
                if (limit) params.set('limit', limit.toString());
                params.set('period', period);

                const response = await fetch(`/api/leaderboard?${params}`);
                const data = await response.json();

                if (data.success) {
                    setLeaders(data.data || []);
                }
            } catch (error) {
                console.error('Error fetching leaderboard:', error);
            } finally {
                setLoading(false);
            }
        }

        fetchLeaderboard();
    }, [limit, period]);

    if (loading) {
        return (
            <div className="text-center py-8">
                <p className="text-gray-500">Se încarcă...</p>
            </div>
        );
    }

    if (leaders.length === 0) {
        return (
            <div className="text-center py-8">
                <p className="text-gray-500">Nu există date disponibile încă.</p>
            </div>
        );
    }

    return (
        <div className="overflow-x-auto">
            <table className="w-full">
                <thead>
                    <tr className="border-b">
                        <th className="text-left py-3 px-4 font-medium text-gray-700">
                            Loc
                        </th>
                        <th className="text-left py-3 px-4 font-medium text-gray-700">
                            Utilizator
                        </th>
                        <th className="text-right py-3 px-4 font-medium text-gray-700">
                            Puncte
                        </th>
                        <th className="text-right py-3 px-4 font-medium text-gray-700">
                            Cuvinte
                        </th>
                    </tr>
                </thead>
                <tbody>
                    {leaders.map((leader, index) => (
                        <tr
                            key={leader.uid}
                            className="border-b hover:bg-gray-50 transition-colors"
                        >
                            <td className="py-3 px-4">
                                <span
                                    className={`font-bold ${index === 0
                                        ? 'text-yellow-600'
                                        : index === 1
                                            ? 'text-gray-500'
                                            : index === 2
                                                ? 'text-orange-600'
                                                : 'text-gray-700'
                                        }`}
                                >
                                    {index === 0 ? '🥇' : index === 1 ? '🥈' : index === 2 ? '🥉' : `${index + 1}`}
                                </span>
                            </td>
                            <td className="py-3 px-4">
                                <Link
                                    href={`/user/${leader.uid}`}
                                    className="flex items-center gap-3 hover:text-primary-600 transition-colors"
                                >
                                    <UserAvatar
                                        name={leader.displayName}
                                        photoURL={leader.photoURL}
                                        size="sm"
                                    />
                                    <span className="font-medium">{leader.displayName}</span>
                                </Link>
                            </td>
                            <td className="py-3 px-4 text-right font-semibold text-primary-600">
                                {formatNumber(leader.totalPoints)}
                            </td>
                            <td className="py-3 px-4 text-right text-gray-600">
                                {formatNumber(leader.wordsDiscovered)}
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
}
