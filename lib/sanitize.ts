// Input sanitization utilities to prevent XSS attacks

/**
 * Sanitizes user input by removing potentially dangerous HTML/script content
 * @param input User-provided string
 * @returns Sanitized string safe for storage and display
 */
export function sanitizeInput(input: string): string {
    if (!input || typeof input !== 'string') {
        return '';
    }

    return input
        .trim()
        // Remove HTML tags
        .replace(/<[^>]*>/g, '')
        // Remove script tags specifically
        .replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '')
        // Remove event handlers
        .replace(/on\w+\s*=\s*["'][^"']*["']/gi, '')
        // Remove javascript: protocol
        .replace(/javascript:/gi, '')
        // Limit length to prevent overflow attacks
        .slice(0, 10000);
}

/**
 * Sanitizes word display name (allows Romanian diacritics)
 * @param word Word to sanitize
 * @returns Sanitized word
 */
export function sanitizeWord(word: string): string {
    if (!word || typeof word !== 'string') {
        return '';
    }

    return word
        .trim()
        // Allow only letters, spaces, hyphens, and Romanian diacritics
        .replace(/[^a-zA-ZăâîșțĂÂÎȘȚ\s\-]/g, '')
        .slice(0, 100);
}

/**
 * Validates email format
 * @param email Email to validate
 * @returns true if valid email format
 */
export function isValidEmail(email: string): boolean {
    if (!email || typeof email !== 'string') {
        return false;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email) && email.length <= 254;
}

/**
 * Validates URL format
 * @param url URL to validate
 * @returns true if valid HTTP/HTTPS URL
 */
export function isValidURL(url: string): boolean {
    if (!url || typeof url !== 'string') {
        return false;
    }

    try {
        const parsed = new URL(url);
        return parsed.protocol === 'http:' || parsed.protocol === 'https:';
    } catch {
        return false;
    }
}

/**
 * Sanitizes reason/description text (allows more characters than word names)
 * @param text Text to sanitize
 * @returns Sanitized text
 */
export function sanitizeText(text: string): string {
    if (!text || typeof text !== 'string') {
        return '';
    }

    return text
        .trim()
        // Remove HTML tags
        .replace(/<[^>]*>/g, '')
        // Remove script content
        .replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '')
        // Remove event handlers
        .replace(/on\w+\s*=\s*["'][^"']*["']/gi, '')
        // Remove javascript: protocol
        .replace(/javascript:/gi, '')
        // Limit length
        .slice(0, 5000);
}

/**
 * Escapes HTML entities for safe display
 * @param text Text to escape
 * @returns HTML-escaped text
 */
export function escapeHTML(text: string): string {
    if (!text || typeof text !== 'string') {
        return '';
    }

    const htmlEntities: Record<string, string> = {
        '&': '&amp;',
        '<': '&lt;',
        '>': '&gt;',
        '"': '&quot;',
        "'": '&#39;',
        '/': '&#x2F;',
    };

    return text.replace(/[&<>"'\/]/g, (char) => htmlEntities[char] || char);
}
