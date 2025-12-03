'use client';

import type { Word } from '@/types';

interface WordMetadataCardProps {
    word: Word;
}

const frequencyConfig = {
    very_common: {
        label: 'Foarte comun',
        color: 'text-green-600 dark:text-green-400',
        bg: 'bg-green-50 dark:bg-green-950/30',
        border: 'border-green-200 dark:border-green-800',
        bars: 5,
    },
    common: {
        label: 'Comun',
        color: 'text-blue-600 dark:text-blue-400',
        bg: 'bg-blue-50 dark:bg-blue-950/30',
        border: 'border-blue-200 dark:border-blue-800',
        bars: 4,
    },
    rare: {
        label: 'Rar',
        color: 'text-orange-600 dark:text-orange-400',
        bg: 'bg-orange-50 dark:bg-orange-950/30',
        border: 'border-orange-200 dark:border-orange-800',
        bars: 2,
    },
    very_rare: {
        label: 'Foarte rar',
        color: 'text-purple-600 dark:text-purple-400',
        bg: 'bg-purple-50 dark:bg-purple-950/30',
        border: 'border-purple-200 dark:border-purple-800',
        bars: 1,
    },
};

const difficultyConfig = {
    A1: {
        label: 'A1 - Începător',
        color: 'text-green-600 dark:text-green-400',
        bg: 'bg-green-50 dark:bg-green-950/30',
        border: 'border-green-200 dark:border-green-800',
    },
    A2: {
        label: 'A2 - Elementar',
        color: 'text-lime-600 dark:text-lime-400',
        bg: 'bg-lime-50 dark:bg-lime-950/30',
        border: 'border-lime-200 dark:border-lime-800',
    },
    B1: {
        label: 'B1 - Intermediar',
        color: 'text-blue-600 dark:text-blue-400',
        bg: 'bg-blue-50 dark:bg-blue-950/30',
        border: 'border-blue-200 dark:border-blue-800',
    },
    B2: {
        label: 'B2 - Intermediar avansat',
        color: 'text-indigo-600 dark:text-indigo-400',
        bg: 'bg-indigo-50 dark:bg-indigo-950/30',
        border: 'border-indigo-200 dark:border-indigo-800',
    },
    C1: {
        label: 'C1 - Avansat',
        color: 'text-orange-600 dark:text-orange-400',
        bg: 'bg-orange-50 dark:bg-orange-950/30',
        border: 'border-orange-200 dark:border-orange-800',
    },
    C2: {
        label: 'C2 - Maestru',
        color: 'text-red-600 dark:text-red-400',
        bg: 'bg-red-50 dark:bg-red-950/30',
        border: 'border-red-200 dark:border-red-800',
    },
};

export default function WordMetadataCard({ word }: WordMetadataCardProps) {
    // Only show if at least one field exists
    if (!word.frequencyLevel && !word.difficultyLevel) {
        return null;
    }

    return (
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 space-y-6">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white flex items-center gap-2">
                <svg className="w-6 h-6 text-purple-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z" />
                </svg>
                Informații lingvistice
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Frequency Level */}
                {word.frequencyLevel && (
                    <div
                        className={`p-4 rounded-lg border-2 ${frequencyConfig[word.frequencyLevel].bg} ${frequencyConfig[word.frequencyLevel].border}`}
                    >
                        <div className="flex items-center gap-2 mb-2">
                            <svg
                                className={`w-5 h-5 ${frequencyConfig[word.frequencyLevel].color}`}
                                fill="none"
                                stroke="currentColor"
                                viewBox="0 0 24 24"
                            >
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                            </svg>
                            <span className="text-sm font-medium text-gray-600 dark:text-gray-300">
                                Frecvență de utilizare
                            </span>
                        </div>
                        <div className={`text-lg font-bold ${frequencyConfig[word.frequencyLevel].color}`}>
                            {frequencyConfig[word.frequencyLevel].label}
                        </div>
                        <div className="flex gap-1 mt-2">
                            {Array.from({ length: 5 }).map((_, i) => (
                                <div
                                    key={i}
                                    className={`h-2 flex-1 rounded ${i < frequencyConfig[word.frequencyLevel!].bars
                                            ? frequencyConfig[word.frequencyLevel!].color.replace('text-', 'bg-')
                                            : 'bg-gray-200 dark:bg-gray-700'
                                        }`}
                                />
                            ))}
                        </div>
                    </div>
                )}

                {/* Difficulty Level */}
                {word.difficultyLevel && (
                    <div
                        className={`p-4 rounded-lg border-2 ${difficultyConfig[word.difficultyLevel].bg} ${difficultyConfig[word.difficultyLevel].border}`}
                    >
                        <div className="flex items-center gap-2 mb-2">
                            <svg
                                className={`w-5 h-5 ${difficultyConfig[word.difficultyLevel].color}`}
                                fill="none"
                                stroke="currentColor"
                                viewBox="0 0 24 24"
                            >
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z" />
                            </svg>
                            <span className="text-sm font-medium text-gray-600 dark:text-gray-300">
                                Nivel de dificultate (CEFR)
                            </span>
                        </div>
                        <div className={`text-lg font-bold ${difficultyConfig[word.difficultyLevel].color}`}>
                            {difficultyConfig[word.difficultyLevel].label}
                        </div>
                        <div className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                            Pentru învățători de limba română
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}
