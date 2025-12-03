'use client';

import type { Word } from '@/types';

interface UsageNotesCardProps {
    word: Word;
}

const noteTypeConfig = {
    grammar: {
        label: 'Gramatică',
        icon: '📚',
        color: 'blue',
        bg: 'bg-blue-50 dark:bg-blue-950/30',
        border: 'border-blue-200 dark:border-blue-800',
        text: 'text-blue-700 dark:text-blue-300',
    },
    register: {
        label: 'Registru',
        icon: '🎭',
        color: 'purple',
        bg: 'bg-purple-50 dark:bg-purple-950/30',
        border: 'border-purple-200 dark:border-purple-800',
        text: 'text-purple-700 dark:text-purple-300',
    },
    common_mistake: {
        label: 'Greșeli frecvente',
        icon: '⚠️',
        color: 'orange',
        bg: 'bg-orange-50 dark:bg-orange-950/30',
        border: 'border-orange-200 dark:border-orange-800',
        text: 'text-orange-700 dark:text-orange-300',
    },
    context: {
        label: 'Context de utilizare',
        icon: '💬',
        color: 'green',
        bg: 'bg-green-50 dark:bg-green-950/30',
        border: 'border-green-200 dark:border-green-800',
        text: 'text-green-700 dark:text-green-300',
    },
};

export default function UsageNotesCard({ word }: UsageNotesCardProps) {
    if (!word.usageNotes || word.usageNotes.length === 0) {
        return null;
    }

    return (
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
                <svg className="w-6 h-6 text-yellow-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                Notițe de utilizare
            </h2>

            <div className="space-y-3">
                {word.usageNotes.map((note, index) => {
                    const config = noteTypeConfig[note.type];
                    return (
                        <div
                            key={index}
                            className={`p-4 rounded-lg border-2 ${config.bg} ${config.border}`}
                        >
                            <div className="flex items-start gap-3">
                                <span className="text-2xl flex-shrink-0" role="img" aria-label={config.label}>
                                    {config.icon}
                                </span>
                                <div className="flex-1">
                                    <div className={`text-xs font-bold uppercase tracking-wide mb-1 ${config.text}`}>
                                        {config.label}
                                    </div>
                                    <div className="text-sm text-gray-700 dark:text-gray-200">
                                        {note.note}
                                    </div>
                                </div>
                            </div>
                        </div>
                    );
                })}
            </div>
        </div>
    );
}
