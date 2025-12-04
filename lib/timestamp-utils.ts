import type { SerializedTimestamp } from '@/types';
import { Timestamp } from 'firebase/firestore';

/**
 * Safely converts a Timestamp or SerializedTimestamp to ISO string
 * Returns undefined if the timestamp is invalid or missing
 */
export function toISOStringSafe(timestamp: Timestamp | SerializedTimestamp | null | undefined): string | undefined {
    if (!timestamp) {
        return undefined;
    }

    try {
        // Check if it's a Firebase Timestamp with seconds property
        if ('seconds' in timestamp && typeof timestamp.seconds === 'number') {
            const date = new Date(timestamp.seconds * 1000);
            if (isNaN(date.getTime())) {
                return undefined;
            }
            return date.toISOString();
        }

        // Check if it's a serialized timestamp with _seconds property
        if ('_seconds' in timestamp && typeof timestamp._seconds === 'number') {
            const date = new Date(timestamp._seconds * 1000);
            if (isNaN(date.getTime())) {
                return undefined;
            }
            return date.toISOString();
        }

        return undefined;
    } catch (error) {
        console.error('Error converting timestamp to ISO string:', error);
        return undefined;
    }
}

/**
 * Safely converts a Timestamp or SerializedTimestamp to Date
 * Returns undefined if the timestamp is invalid or missing
 */
export function toDateSafe(timestamp: Timestamp | SerializedTimestamp | null | undefined): Date | undefined {
    if (!timestamp) {
        return undefined;
    }

    try {
        // Check if it's a Firebase Timestamp with seconds property
        if ('seconds' in timestamp && typeof timestamp.seconds === 'number') {
            const date = new Date(timestamp.seconds * 1000);
            if (isNaN(date.getTime())) {
                return undefined;
            }
            return date;
        }

        // Check if it's a serialized timestamp with _seconds property
        if ('_seconds' in timestamp && typeof timestamp._seconds === 'number') {
            const date = new Date(timestamp._seconds * 1000);
            if (isNaN(date.getTime())) {
                return undefined;
            }
            return date;
        }

        return undefined;
    } catch (error) {
        console.error('Error converting timestamp to Date:', error);
        return undefined;
    }
}
