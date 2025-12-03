/**
 * OrganizationSchema component for SEO
 * Generates JSON-LD structured data for the organization
 */
export default function OrganizationSchema() {
    const baseUrl = process.env.NEXT_PUBLIC_APP_URL || 'https://dexai.ro';

    const organizationSchema = {
        '@context': 'https://schema.org',
        '@type': 'Organization',
        name: 'DEXAI.ro',
        description: 'Dicționar Românesc alimentat de Inteligență Artificială - Descoperiți definiții complete, sinonime, etimologie și exemple de utilizare pentru cuvintele limbii române.',
        url: baseUrl,
        logo: `${baseUrl}/logo.png`,
        sameAs: [
            // Add social media profiles when available
            // 'https://www.facebook.com/dexairo',
            // 'https://twitter.com/dexairo',
            // 'https://www.instagram.com/dexairo',
        ],
        contactPoint: {
            '@type': 'ContactPoint',
            contactType: 'Customer Service',
            email: 'contact@dexai.ro',
            availableLanguage: ['Romanian'],
        },
        foundingDate: '2025',
        areaServed: {
            '@type': 'Country',
            name: 'Romania',
        },
        keywords: 'dicționar românesc, definiții cuvinte, sinonime, antonime, etimologie, limba română, AI dictionary',
    };

    const webSiteSchema = {
        '@context': 'https://schema.org',
        '@type': 'WebSite',
        name: 'DEXAI.ro',
        description: 'Dicționar Românesc cu AI',
        url: baseUrl,
        potentialAction: {
            '@type': 'SearchAction',
            target: {
                '@type': 'EntryPoint',
                urlTemplate: `${baseUrl}/?q={search_term_string}`,
            },
            'query-input': 'required name=search_term_string',
        },
        inLanguage: 'ro-RO',
    };

    return (
        <>
            <script
                type="application/ld+json"
                dangerouslySetInnerHTML={{
                    __html: JSON.stringify(organizationSchema),
                }}
            />
            <script
                type="application/ld+json"
                dangerouslySetInnerHTML={{
                    __html: JSON.stringify(webSiteSchema),
                }}
            />
        </>
    );
}
