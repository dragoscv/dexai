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

            {/* Footer */}
            <footer className="bg-gray-900 text-white py-8 mt-12">
                <div className="container mx-auto px-4 text-center">
                    <p className="text-gray-400">
                        © {new Date().getFullYear()} DEXAI.ro - Dicționar Românesc cu Inteligență Artificială
                    </p>
                    <p className="text-sm text-gray-500 mt-2">
                        Creat cu dragoste de{' '}
                        <a
                            href="https://dragoscatalin.ro"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-primary-400 hover:text-primary-300 transition-colors"
                        >
                            Dragoș Cătălin
                        </a>
                    </p>
                    <p className="text-sm text-gray-500 mt-2">
                        <a
                            href="https://github.com/dragoscv/dexai"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center gap-2 text-gray-400 hover:text-white transition-colors"
                        >
                            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                                <path fillRule="evenodd" d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z" clipRule="evenodd" />
                            </svg>
                            Vezi pe GitHub
                        </a>
                    </p>
                </div>
            </footer>
        </main>
    );
}
