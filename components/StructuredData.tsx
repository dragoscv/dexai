import type { Word } from '@/types';

interface StructuredDataProps {
    word: Word;
}

/**
 * StructuredData component for SEO
 * Generates JSON-LD structured data for dictionary entries
 */
export default function StructuredData({ word }: StructuredDataProps) {
    const baseUrl = process.env.NEXT_PUBLIC_APP_URL || 'https://dexai.ro';

    // DefinedTerm schema for dictionary entry
    const definedTermSchema = {
        '@context': 'https://schema.org',
        '@type': 'DefinedTerm',
        name: word.display,
        identifier: word.id,
        description: word.definitions[0]?.shortDef || word.definitions[0]?.longDef || '',
        inDefinedTermSet: {
            '@type': 'DefinedTermSet',
            name: 'DEXAI.ro - Dicționar Românesc',
            url: baseUrl,
        },
        termCode: word.lemma,
    };

    // Add part of speech if available
    if (word.partOfSpeech) {
        Object.assign(definedTermSchema, {
            additionalType: word.partOfSpeech,
        });
    }

    // BreadcrumbList schema
    const breadcrumbSchema = {
        '@context': 'https://schema.org',
        '@type': 'BreadcrumbList',
        itemListElement: [
            {
                '@type': 'ListItem',
                position: 1,
                name: 'Acasă',
                item: baseUrl,
            },
            {
                '@type': 'ListItem',
                position: 2,
                name: word.display,
                item: `${baseUrl}/cuvant/${word.id}`,
            },
        ],
    };

    // Article schema for better indexing
    const articleSchema = {
        '@context': 'https://schema.org',
        '@type': 'Article',
        headline: `${word.display} - Definiție, Sinonime, Etimologie`,
        description: word.definitions[0]?.shortDef || word.definitions[0]?.longDef || '',
        author: {
            '@type': 'Organization',
            name: 'DEXAI.ro',
            url: baseUrl,
        },
        publisher: {
            '@type': 'Organization',
            name: 'DEXAI.ro',
            url: baseUrl,
        },
        datePublished: word.createdAt ? new Date(word.createdAt.seconds * 1000).toISOString() : undefined,
        dateModified: word.lastRegeneratedAt
            ? new Date(word.lastRegeneratedAt.seconds * 1000).toISOString()
            : word.createdAt ? new Date(word.createdAt.seconds * 1000).toISOString() : undefined,
        mainEntityOfPage: {
            '@type': 'WebPage',
            '@id': `${baseUrl}/cuvant/${word.id}`,
        },
        inLanguage: 'ro-RO',
        keywords: [
            word.display,
            word.lemma,
            word.partOfSpeech,
            ...(word.synonyms?.slice(0, 5) || []),
        ].filter(Boolean).join(', '),
    };

    return (
        <>
            <script
                type="application/ld+json"
                dangerouslySetInnerHTML={{
                    __html: JSON.stringify(definedTermSchema),
                }}
            />
            <script
                type="application/ld+json"
                dangerouslySetInnerHTML={{
                    __html: JSON.stringify(breadcrumbSchema),
                }}
            />
            <script
                type="application/ld+json"
                dangerouslySetInnerHTML={{
                    __html: JSON.stringify(articleSchema),
                }}
            />
        </>
    );
}
