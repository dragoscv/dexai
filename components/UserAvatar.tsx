'use client';

import Image from 'next/image';
import { getInitials, stringToColor } from '@/lib/utils';

interface UserAvatarProps {
    name: string;
    photoURL: string | null;
    size?: 'sm' | 'md' | 'lg';
}

const sizeClasses = {
    sm: 'w-8 h-8 text-sm',
    md: 'w-12 h-12 text-base',
    lg: 'w-16 h-16 text-xl',
};

export default function UserAvatar({ name, photoURL, size = 'md' }: UserAvatarProps) {
    const bgColor = stringToColor(name);

    if (photoURL) {
        return (
            <Image
                src={photoURL}
                alt={name}
                width={size === 'sm' ? 32 : size === 'md' ? 48 : 64}
                height={size === 'sm' ? 32 : size === 'md' ? 48 : 64}
                className={`${sizeClasses[size]} rounded-full object-cover`}
            />
        );
    }

    return (
        <div
            className={`${sizeClasses[size]} rounded-full flex items-center justify-center font-bold text-white`}
            style={{ backgroundColor: bgColor }}
        >
            {getInitials(name)}
        </div>
    );
}
