import { MetadataRoute } from 'next';
import { adminDb } from '@/lib/firebase-admin';

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
    const baseUrl = process.env.NEXT_PUBLIC_APP_URL || 'https://dexai.ro';

    try {
        // Fetch all words for sitemap
        const wordsSnapshot = await adminDb
            .collection('words')
            .select('display', 'createdAt')
            .limit(10000) // Limit for performance, consider pagination for huge datasets
            .get();

        const wordPages: MetadataRoute.Sitemap = wordsSnapshot.docs.map((doc) => {
            const data = doc.data();
            return {
                url: `${baseUrl}/cuvant/${doc.id}`,
                lastModified: data.createdAt?.toDate() || new Date(),
                changeFrequency: 'weekly' as const,
                priority: 0.8,
            };
        });

        // Static pages
        const staticPages: MetadataRoute.Sitemap = [
            {
                url: baseUrl,
                lastModified: new Date(),
                changeFrequency: 'daily',
                priority: 1.0,
            },
            {
                url: `${baseUrl}/top`,
                lastModified: new Date(),
                changeFrequency: 'daily',
                priority: 0.6,
            },
        ];

        return [...staticPages, ...wordPages];
    } catch (error) {
        console.error('Error generating sitemap:', error);
        // Return at least static pages if word fetching fails
        return [
            {
                url: baseUrl,
                lastModified: new Date(),
                changeFrequency: 'daily',
                priority: 1.0,
            },
            {
                url: `${baseUrl}/top`,
                lastModified: new Date(),
                changeFrequency: 'daily',
                priority: 0.6,
            },
        ];
    }
}
