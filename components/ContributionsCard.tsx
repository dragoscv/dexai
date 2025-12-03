import type { Word } from '@/types';
import { formatDate } from '@/lib/utils';

interface ContributionsCardProps {
    word: Word;
}

export default function ContributionsCard({ word }: ContributionsCardProps) {
    return (
        <div className="bg-white rounded-lg shadow-md p-6 mb-6">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Contribuții</h2>

            <div className="space-y-3 text-sm">
                <div>
                    <span className="font-semibold text-gray-700">Descoperit de:</span>{' '}
                    {word.createdBy === 'ai' ? (
                        <span className="text-gray-600">Generare automată AI</span>
                    ) : word.createdByUserId ? (
                        <a
                            href={`/user/${word.createdByUserId}`}
                            className="text-primary-600 hover:text-primary-700"
                        >
                            Vezi profil →
                        </a>
                    ) : (
                        <span className="text-gray-600">Necunoscut</span>
                    )}
                </div>

                <div>
                    <span className="font-semibold text-gray-700">Data adăugării:</span>{' '}
                    <span className="text-gray-600">
                        {word.createdAt && typeof word.createdAt === 'object' && 'toDate' in word.createdAt
                            ? formatDate((word.createdAt as any).toDate())
                            : 'N/A'}
                    </span>
                </div>

                {word.etymology && (
                    <div className="mt-4 p-4 bg-blue-50 rounded-lg">
                        <h3 className="font-semibold text-gray-900 mb-2">📚 Etimologie</h3>
                        <p className="text-gray-700">{word.etymology}</p>
                        {word.createdBy === 'ai' && (
                            <p className="text-xs text-gray-500 mt-2">
                                ⚠️ Etimologie sugerată de AI (neconfirmată)
                            </p>
                        )}
                    </div>
                )}
            </div>

            <div className="mt-6 pt-6 border-t">
                <button className="text-red-600 hover:text-red-700 text-sm font-medium">
                    🚩 Raportează eroare
                </button>
            </div>
        </div>
    );
}
