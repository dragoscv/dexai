import Link from 'next/link';

interface SynonymsBlockProps {
    synonyms: string[];
    antonyms: string[];
    relatedWords: string[];
}

export default function SynonymsBlock({
    synonyms,
    antonyms,
    relatedWords,
}: SynonymsBlockProps) {
    return (
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
                Cuvinte înrudite
            </h2>

            {synonyms.length > 0 && (
                <div className="mb-4">
                    <h3 className="font-semibold text-gray-700 dark:text-gray-300 mb-2">Sinonime:</h3>
                    <div className="flex flex-wrap gap-2">
                        {synonyms.map((synonym) => (
                            <Link
                                key={synonym}
                                href={`/cuvant/${synonym}`}
                                className="inline-block bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-300 px-3 py-1 rounded-full text-sm hover:bg-green-200 dark:hover:bg-green-900/50 transition-colors"
                            >
                                {synonym}
                            </Link>
                        ))}
                    </div>
                </div>
            )}

            {antonyms.length > 0 && (
                <div className="mb-4">
                    <h3 className="font-semibold text-gray-700 dark:text-gray-300 mb-2">Antonime:</h3>
                    <div className="flex flex-wrap gap-2">
                        {antonyms.map((antonym) => (
                            <Link
                                key={antonym}
                                href={`/cuvant/${antonym}`}
                                className="inline-block bg-red-100 dark:bg-red-900/30 text-red-800 dark:text-red-300 px-3 py-1 rounded-full text-sm hover:bg-red-200 dark:hover:bg-red-900/50 transition-colors"
                            >
                                {antonym}
                            </Link>
                        ))}
                    </div>
                </div>
            )}

            {relatedWords.length > 0 && (
                <div>
                    <h3 className="font-semibold text-gray-700 dark:text-gray-300 mb-2">
                        Familie lexicală:
                    </h3>
                    <div className="flex flex-wrap gap-2">
                        {relatedWords.map((related) => (
                            <Link
                                key={related}
                                href={`/cuvant/${related}`}
                                className="inline-block bg-blue-100 dark:bg-blue-900/30 text-blue-800 dark:text-blue-300 px-3 py-1 rounded-full text-sm hover:bg-blue-200 dark:hover:bg-blue-900/50 transition-colors"
                            >
                                {related}
                            </Link>
                        ))}
                    </div>
                </div>
            )}
        </div>
    );
}
