import SearchBar from '@/components/SearchBar';
import LeaderboardTable from '@/components/LeaderboardTable';
import WordOfTheDay from '@/components/WordOfTheDay';
import StatsCard from '@/components/StatsCard';
import Link from 'next/link';
import { adminDb } from '@/lib/firebase-admin';

async function getStatistics() {
    try {
        const [wordsSnap, usersSnap] = await Promise.all([
            adminDb.collection('words').count().get(),
            adminDb.collection('users').count().get(),
        ]);

        const today = new Date();
        today.setHours(0, 0, 0, 0);

        const wordsAddedTodaySnap = await adminDb
            .collection('words')
            .where('createdAt', '>=', today)
            .count()
            .get();

        return {
            totalWords: wordsSnap.data().count,
            totalUsers: usersSnap.data().count,
            wordsAddedToday: wordsAddedTodaySnap.data().count,
        };
    } catch (error) {
        console.error('Error fetching statistics:', error);
        return {
            totalWords: 0,
            totalUsers: 0,
            wordsAddedToday: 0,
        };
    }
}

export default async function HomePage() {
    const stats = await getStatistics();

    return (
        <main className="min-h-screen bg-gradient-to-b from-blue-50 to-white">
            {/* Hero Section */}
            <section className="container mx-auto px-4 py-12">
                <div className="max-w-4xl mx-auto text-center">
                    <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
                        Descoperă limba română <br />
                        <span className="text-primary-600">cu ajutorul AI</span>
                    </h2>
                    <p className="text-xl text-gray-600 mb-8">
                        Caută cuvinte, primești puncte pentru descoperiri noi și contribui
                        la cel mai mare dicționar românesc colaborativ.
                    </p>

                    {/* Search Bar */}
                    <SearchBar />

                    <p className="text-sm text-gray-500 mt-4">
                        💡 Dacă găsești un cuvânt pe care nu-l avem, primești{' '}
                        <strong>1 punct</strong> și ajuți la completarea dicționarului!
                    </p>
                </div>
            </section>

            {/* Statistics */}
            <section className="container mx-auto px-4 py-8">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-4xl mx-auto">
                    <StatsCard
                        label="Cuvinte în bază"
                        value={stats.totalWords}
                        icon="📚"
                    />
                    <StatsCard
                        label="Utilizatori activi"
                        value={stats.totalUsers}
                        icon="👥"
                    />
                    <StatsCard
                        label="Cuvinte adăugate azi"
                        value={stats.wordsAddedToday}
                        icon="✨"
                    />
                </div>
            </section>

            {/* Word of the Day */}
            <section className="container mx-auto px-4 py-8">
                <div className="max-w-4xl mx-auto">
                    <WordOfTheDay />
                </div>
            </section>

            {/* Leaderboard Preview */}
            <section className="container mx-auto px-4 py-12">
                <div className="max-w-4xl mx-auto">
                    <div className="bg-white rounded-lg shadow-md p-6">
                        <div className="flex items-center justify-between mb-6">
                            <h3 className="text-2xl font-bold text-gray-900">
                                🏆 Top Jucători
                            </h3>
                            <Link
                                href="/top"
                                className="text-primary-600 hover:text-primary-700 font-medium"
                            >
                                Vezi clasamentul complet →
                            </Link>
                        </div>
                        <LeaderboardTable limit={5} />
                    </div>
                </div>
            </section>

            {/* How it works */}
            <section className="container mx-auto px-4 py-12 bg-gray-50">
                <div className="max-w-4xl mx-auto">
                    <h3 className="text-2xl font-bold text-gray-900 text-center mb-8">
                        Cum funcționează?
                    </h3>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                        <div className="text-center">
                            <div className="text-4xl mb-4">🔍</div>
                            <h4 className="font-bold text-lg mb-2">1. Caută cuvinte</h4>
                            <p className="text-gray-600">
                                Introdu orice cuvânt românesc în bara de căutare
                            </p>
                        </div>
                        <div className="text-center">
                            <div className="text-4xl mb-4">🎯</div>
                            <h4 className="font-bold text-lg mb-2">2. Descoperă și câștigă</h4>
                            <p className="text-gray-600">
                                Dacă cuvântul nu există, primești puncte pentru descoperire
                            </p>
                        </div>
                        <div className="text-center">
                            <div className="text-4xl mb-4">🤝</div>
                            <h4 className="font-bold text-lg mb-2">3. Contribuie</h4>
                            <p className="text-gray-600">
                                Adaugă exemple, sinonime și ajută la îmbunătățirea
                                dicționarului
                            </p>
                        </div>
                    </div>
                </div>
            </section>
        </main>
    );
}
