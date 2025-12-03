import { formatNumber } from '@/lib/utils';

interface StatsCardProps {
    label: string;
    value: number;
    icon: string;
}

export default function StatsCard({ label, value, icon }: StatsCardProps) {
    return (
        <div className="bg-white rounded-lg shadow-md p-6 text-center">
            <div className="text-4xl mb-2">{icon}</div>
            <div className="text-3xl font-bold text-primary-600 mb-1">
                {formatNumber(value)}
            </div>
            <div className="text-sm text-gray-600">{label}</div>
        </div>
    );
}
