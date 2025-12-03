import type { Word } from '@/types';
import { normalizeWord } from '@/lib/normalize-word';

interface WordHeaderProps {
    word: Word;
}

export default function WordHeader({ word }: WordHeaderProps) {
    // Check if the word has diacritics that were normalized in the URL
    const hasDiacritics = word.id !== word.display.toLowerCase().trim();
    const normalizedDisplay = normalizeWord(word.display);
    const showDiacriticsNotice = hasDiacritics && word.id === normalizedDisplay;

    return (
        <div className="bg-white rounded-lg shadow-md p-6 mb-6">
            {/* Diacritics Information Banner */}
            {showDiacriticsNotice && (
                <div className="mb-4 px-4 py-3 bg-blue-50 border-l-4 border-blue-400 rounded">
                    <div className="flex items-start gap-3">
                        <div className="flex-shrink-0 text-blue-500 text-xl">ℹ️</div>
                        <div className="flex-1">
                            <p className="text-sm text-blue-800">
                                <span className="font-semibold">Forma corectă cu diacritice:</span>{' '}
                                <span className="font-bold text-blue-900">{word.display}</span>
                            </p>
                            <p className="text-xs text-blue-600 mt-1">
                                Poți căuta fără diacritice - sistemul va găsi automat forma corectă!
                            </p>
                        </div>
                    </div>
                </div>
            )}
            <div className="flex items-start justify-between mb-4">
                <div>
                    <h1 className="text-4xl font-bold text-gray-900 mb-2">
                        {word.display}
                    </h1>
                    <div className="flex items-center gap-3 flex-wrap">
                        <span className="inline-block bg-primary-100 text-primary-800 px-3 py-1 rounded-full text-sm font-medium">
                            {word.partOfSpeech}
                        </span>
                        {word.tags.map((tag) => (
                            <span
                                key={tag}
                                className="inline-block bg-gray-100 text-gray-700 px-3 py-1 rounded-full text-sm"
                            >
                                {tag}
                            </span>
                        ))}
                        {word.communityVerified ? (
                            <span className="inline-block bg-green-100 text-green-800 px-3 py-1 rounded-full text-sm">
                                ✅ Verificat de comunitate ({word.validationsCount} validări)
                            </span>
                        ) : word.verified ? (
                            <span className="inline-block bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm">
                                ✅ Verificat oficial
                            </span>
                        ) : (
                            <span className="inline-block bg-yellow-100 text-yellow-800 px-3 py-1 rounded-full text-sm">
                                ⚠️ Generat de AI - în validare
                            </span>
                        )}
                    </div>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                <div>
                    <span className="font-medium text-gray-700">Pronunție:</span>{' '}
                    <span className="text-gray-600">[{word.pronunciation}]</span>
                </div>
                <div>
                    <span className="font-medium text-gray-700">Silabe:</span>{' '}
                    <span className="text-gray-600">{word.syllables.join('-')}</span>
                </div>
            </div>
        </div>
    );
}
