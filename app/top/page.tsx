'use client';

import { useState } from 'react';
import LeaderboardTable from '@/components/LeaderboardTable';

type Period = 'today' | 'week' | 'month' | 'allTime';

export default function TopPage() {
    const [selectedPeriod, setSelectedPeriod] = useState<Period>('allTime');

    const periods: Array<{ value: Period; label: string }> = [
        { value: 'today', label: 'Azi' },
        { value: 'week', label: 'Săptămâna aceasta' },
        { value: 'month', label: 'Luna aceasta' },
        { value: 'allTime', label: 'Tot timpul' },
    ];

    return (
        <div className="min-h-screen bg-gray-50">
            {/* Main Content */}
            <main className="container mx-auto px-4 py-12">
                <div className="max-w-4xl mx-auto">
                    <div className="text-center mb-8">
                        <h1 className="text-4xl font-bold text-gray-900 mb-4">
                            🏆 Clasament Jucători
                        </h1>
                        <p className="text-gray-600">
                            Cei mai activi descoperitori de cuvinte românești
                        </p>
                    </div>

                    {/* Period Filter */}
                    <div className="bg-white rounded-lg shadow-md p-6 mb-6">
                        <div className="flex flex-wrap gap-2 justify-center">
                            {periods.map((period) => (
                                <button
                                    key={period.value}
                                    onClick={() => setSelectedPeriod(period.value)}
                                    className={`px-6 py-2 rounded-full font-medium transition-colors ${selectedPeriod === period.value
                                        ? 'bg-primary-600 text-white'
                                        : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                                        }`}
                                >
                                    {period.label}
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* Leaderboard */}
                    <div className="bg-white rounded-lg shadow-md p-6">
                        <LeaderboardTable period={selectedPeriod} limit={50} />
                    </div>
                </div>
            </main>
        </div>
    );
}
