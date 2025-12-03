'use client';

import { useState } from 'react';
import Link from 'next/link';
import type { Word } from '@/types';
import { formatDate } from '@/lib/utils';
import FlagModal from './FlagModal';

interface ContributionsCardProps {
    word: Word;
}

export default function ContributionsCard({ word }: ContributionsCardProps) {
    const [isFlagModalOpen, setIsFlagModalOpen] = useState(false);

    return (
        <>
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
                <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">Contribuții</h2>

                <div className="space-y-3 text-sm">
                    <div>
                        <span className="font-semibold text-gray-700 dark:text-gray-300">Descoperit de:</span>{' '}
                        {word.createdByUserId ? (
                            <Link
                                href={`/user/${word.createdByUserId}`}
                                className="text-primary-600 dark:text-primary-400 hover:text-primary-700 dark:hover:text-primary-300"
                            >
                                Vezi profil →
                            </Link>
                        ) : word.createdBy === 'ai' ? (
                            <span className="text-gray-600 dark:text-gray-400">Generare automată AI</span>
                        ) : (
                            <span className="text-gray-600 dark:text-gray-400">Necunoscut</span>
                        )}
                    </div>

                    <div>
                        <span className="font-semibold text-gray-700 dark:text-gray-300">Data adăugării:</span>{' '}
                        <span className="text-gray-600 dark:text-gray-400">
                            {word.createdAt
                                ? formatDate(
                                    typeof word.createdAt === 'object' && '_seconds' in word.createdAt
                                        ? new Date((word.createdAt as any)._seconds * 1000)
                                        : typeof word.createdAt === 'object' && 'toDate' in word.createdAt
                                            ? (word.createdAt as any).toDate()
                                            : new Date(word.createdAt as any)
                                )
                                : 'N/A'}
                        </span>
                    </div>

                    {word.etymology && (
                        <div className="mt-4 p-4 bg-blue-50 dark:bg-blue-950/30 rounded-lg border border-blue-100 dark:border-blue-800/50">
                            <h3 className="font-semibold text-gray-900 dark:text-white mb-2">📚 Etimologie</h3>
                            <p className="text-gray-700 dark:text-gray-300">{word.etymology}</p>
                            {word.createdBy === 'ai' && (
                                <p className="text-xs text-gray-500 dark:text-gray-400 mt-2">
                                    ⚠️ Etimologie sugerată de AI (neconfirmată)
                                </p>
                            )}
                        </div>
                    )}
                </div>

                <div className="mt-6 pt-6 border-t border-gray-200 dark:border-gray-700">
                    <button
                        onClick={() => setIsFlagModalOpen(true)}
                        className="text-red-600 dark:text-red-400 hover:text-red-700 dark:hover:text-red-300 text-sm font-medium transition-colors"
                    >
                        🚩 Raportează eroare
                    </button>
                </div>
            </div>

            <FlagModal
                isOpen={isFlagModalOpen}
                onClose={() => setIsFlagModalOpen(false)}
                wordId={word.id}
                wordDisplay={word.display}
            />
        </>
    );
}
