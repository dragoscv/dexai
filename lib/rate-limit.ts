// IP-based rate limiting for anonymous users
// Prevents API abuse and excessive AI costs

interface RateLimitEntry {
    count: number;
    resetAt: number;
}

// In-memory cache for rate limiting
const ipRateLimits = new Map<string, RateLimitEntry>();

// Clean up old entries every hour
setInterval(() => {
    const now = Date.now();
    for (const [ip, entry] of ipRateLimits.entries()) {
        if (entry.resetAt < now) {
            ipRateLimits.delete(ip);
        }
    }
}, 60 * 60 * 1000);

/**
 * Check if an IP address has exceeded rate limit
 * @param ip IP address to check
 * @param maxRequests Maximum requests allowed per window
 * @param windowMs Time window in milliseconds
 * @returns true if within limit, false if exceeded
 */
export function checkIPRateLimit(
    ip: string,
    maxRequests: number = 10,
    windowMs: number = 60 * 60 * 1000 // 1 hour default
): boolean {
    const now = Date.now();
    const entry = ipRateLimits.get(ip);

    if (!entry || entry.resetAt < now) {
        // Create new entry or reset expired one
        ipRateLimits.set(ip, {
            count: 1,
            resetAt: now + windowMs,
        });
        return true;
    }

    if (entry.count >= maxRequests) {
        return false;
    }

    entry.count++;
    return true;
}

/**
 * Get client IP address from request
 * @param request Next.js request object
 * @returns IP address or 'unknown'
 */
export function getClientIP(request: Request): string {
    const headers = request.headers;
    
    // Check common headers for IP (works with proxies/CDNs)
    const forwardedFor = headers.get('x-forwarded-for');
    if (forwardedFor) {
        return forwardedFor.split(',')[0].trim();
    }

    const realIP = headers.get('x-real-ip');
    if (realIP) {
        return realIP;
    }

    // Fallback to connection IP (may not work in all deployments)
    return 'unknown';
}

/**
 * Endpoint-specific rate limiting
 */
interface EndpointRateLimitEntry {
    count: number;
    resetAt: number;
}

const endpointLimits = new Map<string, EndpointRateLimitEntry>();

export function checkEndpointRateLimit(
    identifier: string, // userId or IP
    endpoint: string,
    maxRequests: number = 10,
    windowMs: number = 60 * 1000 // 1 minute default
): boolean {
    const key = `${endpoint}:${identifier}`;
    const now = Date.now();
    const entry = endpointLimits.get(key);

    if (!entry || entry.resetAt < now) {
        endpointLimits.set(key, {
            count: 1,
            resetAt: now + windowMs,
        });
        return true;
    }

    if (entry.count >= maxRequests) {
        return false;
    }

    entry.count++;
    return true;
}
