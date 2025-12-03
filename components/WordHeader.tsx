import type { Word } from '@/types';

interface WordHeaderProps {
    word: Word;
}

export default function WordHeader({ word }: WordHeaderProps) {
    return (
        <div className="bg-white rounded-lg shadow-md p-6 mb-6">
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
                        {!word.verified && (
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
