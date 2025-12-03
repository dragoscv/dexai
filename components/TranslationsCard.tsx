'use client';

import type { Word } from '@/types';

interface TranslationsCardProps {
    word: Word;
}

const languageConfig = {
    en: { name: 'Engleză', flag: '🇬🇧' },
    fr: { name: 'Franceză', flag: '🇫🇷' },
    es: { name: 'Spaniolă', flag: '🇪🇸' },
    de: { name: 'Germană', flag: '🇩🇪' },
    hu: { name: 'Maghiară', flag: '🇭🇺' },
};

export default function TranslationsCard({ word }: TranslationsCardProps) {
    if (!word.translations || word.translations.length === 0) {
        return null;
    }

    return (
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
                <svg className="w-6 h-6 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5h12M9 3v2m1.048 9.5A18.022 18.022 0 016.412 9m6.088 9h7M11 21l5-10 5 10M12.751 5C11.783 10.77 8.07 15.61 3 18.129" />
                </svg>
                Traduceri
            </h2>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {word.translations.map((translation, index) => (
                    <div
                        key={index}
                        className="p-4 bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-blue-950/30 dark:to-indigo-950/30 rounded-lg border border-blue-100 dark:border-blue-800/50 hover:shadow-md transition-shadow"
                    >
                        <div className="flex items-center gap-2 mb-2">
                            <span className="text-2xl" role="img" aria-label={languageConfig[translation.language].name}>
                                {languageConfig[translation.language].flag}
                            </span>
                            <span className="text-sm font-medium text-gray-600 dark:text-gray-300">
                                {languageConfig[translation.language].name}
                            </span>
                        </div>
                        <div className="text-lg font-bold text-gray-900 dark:text-white mb-1">
                            {translation.word}
                        </div>
                        {translation.note && (
                            <div className="text-xs text-gray-500 dark:text-gray-400 italic mt-2 pt-2 border-t border-blue-100 dark:border-blue-800/50">
                                {translation.note}
                            </div>
                        )}
                    </div>
                ))}
            </div>
        </div>
    );
}
