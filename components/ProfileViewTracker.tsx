'use client';

import { useEffect } from 'react';
import { trackProfileView } from '@/lib/analytics';
import { useAuth } from '@/lib/auth-context';

interface ProfileViewTrackerProps {
    profileUserId: string;
}

/**
 * Client component to track profile page views
 * Compares the viewed profile ID with the current user's ID
 */
export default function ProfileViewTracker({ profileUserId }: ProfileViewTrackerProps) {
    const { user } = useAuth();

    useEffect(() => {
        const isOwnProfile = user?.uid === profileUserId;
        trackProfileView(profileUserId, isOwnProfile);
    }, [profileUserId, user?.uid]);

    return null;
}
