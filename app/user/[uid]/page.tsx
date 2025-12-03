import { adminDb } from '@/lib/firebase-admin';
import type { User, Contribution } from '@/types';
import { notFound } from 'next/navigation';
import Link from 'next/link';
import UserAvatar from '@/components/UserAvatar';
import { formatNumber, formatDate } from '@/lib/utils';
import ProfileViewTracker from '@/components/ProfileViewTracker';

interface PageProps {
    params: Promise<{
        uid: string;
    }>;
}

async function getUserData(uid: string): Promise<User | null> {
    try {
        const userDoc = await adminDb.collection('users').doc(uid).get();

        if (!userDoc.exists) {
            return null;
        }

        return { uid: userDoc.id, ...userDoc.data() } as User;
    } catch (error) {
        console.error('Error fetching user:', error);
        return null;
    }
}

async function getUserContributions(uid: string): Promise<Contribution[]> {
    try {
        const snapshot = await adminDb
            .collection('contributions')
            .where('userId', '==', uid)
            .orderBy('createdAt', 'desc')
            .limit(10)
            .get();

        const contributions = snapshot.docs.map((doc) => ({
            id: doc.id,
            ...doc.data(),
        })) as Contribution[];

        // Fetch word data for each contribution
        const contributionsWithWords = await Promise.all(
            contributions.map(async (contribution) => {
                try {
                    const wordDoc = await adminDb.collection('words').doc(contribution.wordId).get();
                    return {
                        ...contribution,
                        wordDisplay: wordDoc.exists ? (wordDoc.data()?.display || contribution.wordId) : contribution.wordId,
                    };
                } catch (error) {
                    console.error('Error fetching word:', error);
                    return { ...contribution, wordDisplay: contribution.wordId };
                }
            })
        );

        return contributionsWithWords;
    } catch (error) {
        console.error('Error fetching contributions:', error);
        return [];
    }
}

async function getTotalContributionsCount(uid: string): Promise<number> {
    try {
        const snapshot = await adminDb
            .collection('contributions')
            .where('userId', '==', uid)
            .count()
            .get();

        return snapshot.data().count;
    } catch (error) {
        console.error('Error fetching total contributions:', error);
        return 0;
    }
}

export default async function UserProfilePage(props: PageProps) {
    const params = await props.params;
    const user = await getUserData(params.uid);

    if (!user) {
        notFound();
    }

    const [contributions, totalContributionsCount] = await Promise.all([
        getUserContributions(params.uid),
        getTotalContributionsCount(params.uid),
    ]);

    return (
        <div className="min-h-screen bg-gray-50">
            {/* Profile View Tracking */}
            <ProfileViewTracker profileUserId={params.uid} />
            
            {/* Main Content */}
            <main className="container mx-auto px-4 py-12">
                <div className="max-w-4xl mx-auto">
                    {/* User Profile Card */}
                    <div className="bg-white rounded-lg shadow-md p-8 mb-6">
                        <div className="flex items-center gap-6">
                            <UserAvatar
                                name={user.displayName}
                                photoURL={user.photoURL}
                                size="lg"
                            />
                            <div>
                                <h1 className="text-3xl font-bold text-gray-900 mb-2">
                                    {user.displayName}
                                </h1>
                                <p className="text-gray-600">
                                    Membru din{' '}
                                    {user.createdAt && typeof user.createdAt === 'object' && 'toDate' in user.createdAt
                                        ? formatDate((user.createdAt as any).toDate())
                                        : 'N/A'}
                                </p>
                            </div>
                        </div>

                        {/* Stats Grid */}
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-8">
                            <div className="text-center p-4 bg-primary-50 rounded-lg">
                                <div className="text-3xl font-bold text-primary-600">
                                    {formatNumber(user.totalPoints)}
                                </div>
                                <div className="text-sm text-gray-600 mt-1">
                                    Puncte totale
                                </div>
                            </div>
                            <div className="text-center p-4 bg-green-50 rounded-lg">
                                <div className="text-3xl font-bold text-green-600">
                                    {formatNumber(user.wordsDiscovered)}
                                </div>
                                <div className="text-sm text-gray-600 mt-1">
                                    Cuvinte descoperite
                                </div>
                            </div>
                            <div className="text-center p-4 bg-blue-50 rounded-lg">
                                <div className="text-3xl font-bold text-blue-600">
                                    {formatNumber(totalContributionsCount)}
                                </div>
                                <div className="text-sm text-gray-600 mt-1">
                                    Contribuții totale
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Recent Contributions */}
                    <div className="bg-white rounded-lg shadow-md p-6">
                        <h2 className="text-2xl font-bold text-gray-900 mb-4">
                            Contribuții recente
                        </h2>

                        {contributions.length === 0 ? (
                            <p className="text-gray-500 text-center py-8">
                                Nu există contribuții încă.
                            </p>
                        ) : (
                            <div className="space-y-4">
                                {contributions.map((contribution) => (
                                    <div
                                        key={contribution.id}
                                        className="border-l-4 border-primary-500 pl-4 py-2"
                                    >
                                        <div className="flex items-center justify-between">
                                            <div>
                                                <span className="font-medium text-gray-900">
                                                    {contribution.type === 'discovery'
                                                        ? '🎯 Descoperire'
                                                        : contribution.type === 'example_add'
                                                            ? '📝 Exemplu adăugat'
                                                            : contribution.type === 'synonym_add'
                                                                ? '🔗 Sinonim adăugat'
                                                                : '🚩 Raportare'}
                                                </span>
                                                <Link
                                                    href={`/cuvant/${contribution.wordId}`}
                                                    className="text-primary-600 hover:text-primary-700 hover:underline ml-2 font-semibold"
                                                >
                                                    {(contribution as any).wordDisplay || contribution.wordId}
                                                </Link>
                                            </div>
                                            <span className="text-sm text-gray-500">
                                                +{contribution.points} puncte
                                            </span>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                </div>
            </main>
        </div>
    );
}

export async function generateMetadata(props: PageProps) {
    const params = await props.params;
    const user = await getUserData(params.uid);

    if (!user) {
        return {
            title: 'Utilizator negăsit - DEXAI.ro',
        };
    }

    return {
        title: `${user.displayName} - DEXAI.ro`,
        description: `Profilul lui ${user.displayName} pe DEXAI.ro`,
    };
}
