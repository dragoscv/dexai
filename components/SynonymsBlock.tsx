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
        <div className="bg-white rounded-lg shadow-md p-6 mb-6">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">
                Cuvinte înrudite
            </h2>

            {synonyms.length > 0 && (
                <div className="mb-4">
                    <h3 className="font-semibold text-gray-700 mb-2">Sinonime:</h3>
                    <div className="flex flex-wrap gap-2">
                        {synonyms.map((synonym) => (
                            <Link
                                key={synonym}
                                href={`/cuvant/${synonym}`}
                                className="inline-block bg-green-100 text-green-800 px-3 py-1 rounded-full text-sm hover:bg-green-200 transition-colors"
                            >
                                {synonym}
                            </Link>
                        ))}
                    </div>
                </div>
            )}

            {antonyms.length > 0 && (
                <div className="mb-4">
                    <h3 className="font-semibold text-gray-700 mb-2">Antonime:</h3>
                    <div className="flex flex-wrap gap-2">
                        {antonyms.map((antonym) => (
                            <Link
                                key={antonym}
                                href={`/cuvant/${antonym}`}
                                className="inline-block bg-red-100 text-red-800 px-3 py-1 rounded-full text-sm hover:bg-red-200 transition-colors"
                            >
                                {antonym}
                            </Link>
                        ))}
                    </div>
                </div>
            )}

            {relatedWords.length > 0 && (
                <div>
                    <h3 className="font-semibold text-gray-700 mb-2">
                        Familie lexicală:
                    </h3>
                    <div className="flex flex-wrap gap-2">
                        {relatedWords.map((related) => (
                            <Link
                                key={related}
                                href={`/cuvant/${related}`}
                                className="inline-block bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm hover:bg-blue-200 transition-colors"
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
