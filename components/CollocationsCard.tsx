'use client';

import type { Word } from '@/types';

interface CollocationsCardProps {
    word: Word;
}

export default function CollocationsCard({ word }: CollocationsCardProps) {
    if (!word.collocations || word.collocations.length === 0) {
        return null;
    }

    return (
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
                <svg className="w-6 h-6 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 8h10M7 12h4m1 8l-4-4H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-3l-4 4z" />
                </svg>
                Expresii și colocații
            </h2>

            <div className="space-y-3">
                {word.collocations.map((collocation, index) => (
                    <div
                        key={index}
                        className="p-4 bg-gradient-to-r from-green-50 to-emerald-50 dark:from-green-950/30 dark:to-emerald-950/30 rounded-lg border border-green-100 dark:border-green-800/50 hover:shadow-md transition-all hover:scale-[1.01]"
                    >
                        <div className="flex items-start gap-3">
                            <div className="flex-shrink-0 w-8 h-8 bg-green-500 dark:bg-green-600 text-white rounded-full flex items-center justify-center font-bold text-sm">
                                {index + 1}
                            </div>
                            <div className="flex-1">
                                <div className="text-lg font-bold text-gray-900 dark:text-white mb-1">
                                    {collocation.phrase}
                                </div>
                                <div className="text-sm text-gray-600 dark:text-gray-300">
                                    {collocation.meaning}
                                </div>
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            <div className="mt-4 p-3 bg-blue-50 dark:bg-blue-950/30 rounded-lg border border-blue-100 dark:border-blue-800/50">
                <p className="text-sm text-gray-600 dark:text-gray-300">
                    <span className="font-semibold">💡 Sugestie:</span> Aceste expresii te ajută să folosești cuvântul în context natural.
                </p>
            </div>
        </div>
    );
}
