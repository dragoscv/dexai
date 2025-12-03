'use client';

import { useEffect, useRef, useState } from 'react';
import { toast } from 'sonner';
import { useAuth } from '@/lib/auth-context';
import { trackContentFlag } from '@/lib/analytics';

interface FlagModalProps {
    isOpen: boolean;
    onClose: () => void;
    wordId: string;
    wordDisplay: string;
}

export default function FlagModal({ isOpen, onClose, wordId, wordDisplay }: FlagModalProps) {
    const { user, getIdToken } = useAuth();
    const dialogRef = useRef<HTMLDialogElement>(null);
    const [reason, setReason] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);

    useEffect(() => {
        const dialog = dialogRef.current;
        if (!dialog) return;

        if (isOpen) {
            dialog.showModal();
        } else {
            dialog.close();
            setReason('');
        }
    }, [isOpen]);

    useEffect(() => {
        const dialog = dialogRef.current;
        if (!dialog) return;

        const handleClose = () => onClose();
        dialog.addEventListener('close', handleClose);

        return () => dialog.removeEventListener('close', handleClose);
    }, [onClose]);

    const handleBackdropClick = (e: React.MouseEvent<HTMLDialogElement>) => {
        const dialog = dialogRef.current;
        if (!dialog) return;

        const rect = dialog.getBoundingClientRect();
        const isInDialog =
            rect.top <= e.clientY &&
            e.clientY <= rect.top + rect.height &&
            rect.left <= e.clientX &&
            e.clientX <= rect.left + rect.width;

        if (!isInDialog) {
            onClose();
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!user) {
            toast.error('Trebuie să fii autentificat pentru a raporta erori');
            return;
        }

        if (!reason.trim()) {
            toast.error('Te rugăm să descrii problema');
            return;
        }

        setIsSubmitting(true);

        try {
            const token = await getIdToken();
            const headers: HeadersInit = { 'Content-Type': 'application/json' };

            if (token) {
                headers['Authorization'] = `Bearer ${token}`;
            }

            const response = await fetch('/api/flag', {
                method: 'POST',
                headers,
                body: JSON.stringify({
                    wordId,
                    reason: reason.trim(),
                }),
            });

            const data = await response.json();

            if (data.success) {
                // Track content flag analytics
                trackContentFlag(wordId, reason.trim());

                toast.success('Mulțumim pentru raport! Vom verifica și rezolva problema.');
                onClose();
            } else {
                toast.error(data.message || 'Eroare la trimiterea raportului');
            }
        } catch (error) {
            console.error('Error submitting flag:', error);
            toast.error('A apărut o eroare la trimiterea raportului');
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <dialog
            ref={dialogRef}
            onClick={handleBackdropClick}
            className="backdrop:bg-black backdrop:bg-opacity-50 rounded-lg shadow-2xl p-0 max-w-md w-full"
        >
            <div className="bg-white rounded-lg p-8">
                {/* Header */}
                <div className="flex items-center justify-between mb-6">
                    <h2 className="text-2xl font-bold text-gray-900">
                        🚩 Raportează eroare
                    </h2>
                    <button
                        onClick={onClose}
                        className="text-gray-400 hover:text-gray-600 transition-colors"
                        aria-label="Închide"
                    >
                        <svg
                            className="w-6 h-6"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                        >
                            <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M6 18L18 6M6 6l12 12"
                            />
                        </svg>
                    </button>
                </div>

                {/* Description */}
                <p className="text-gray-600 mb-4">
                    Ai găsit o eroare la cuvântul <strong>{wordDisplay}</strong>?
                    Descrie problema mai jos și vom verifica.
                </p>

                {/* Form */}
                <form onSubmit={handleSubmit}>
                    <div className="mb-6">
                        <label htmlFor="reason" className="block text-sm font-semibold text-gray-700 mb-2">
                            Descrie problema
                        </label>
                        <textarea
                            id="reason"
                            value={reason}
                            onChange={(e) => setReason(e.target.value)}
                            placeholder="Ex: Definiția este incorectă, lipsesc exemple, etimologia este greșită..."
                            rows={4}
                            className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:border-primary-500 focus:outline-none focus:ring-2 focus:ring-primary-200 resize-none"
                            disabled={isSubmitting}
                            required
                        />
                    </div>

                    {/* Common issues */}
                    <div className="bg-gray-50 rounded-lg p-4 mb-6">
                        <h3 className="text-sm font-semibold text-gray-900 mb-2">
                            Probleme comune:
                        </h3>
                        <ul className="text-sm text-gray-700 space-y-1">
                            <li>• Definiție incorectă sau incompletă</li>
                            <li>• Exemple greșite sau inadecvate</li>
                            <li>• Sinonime sau antonime incorecte</li>
                            <li>• Etimologie eronată</li>
                            <li>• Cuvânt duplicat sau inexistent</li>
                        </ul>
                    </div>

                    {/* Actions */}
                    <div className="flex gap-3">
                        <button
                            type="button"
                            onClick={onClose}
                            className="flex-1 px-6 py-3 border-2 border-gray-300 text-gray-700 font-semibold rounded-lg hover:bg-gray-50 transition-colors"
                            disabled={isSubmitting}
                        >
                            Anulează
                        </button>
                        <button
                            type="submit"
                            className="flex-1 px-6 py-3 bg-red-600 hover:bg-red-700 text-white font-semibold rounded-lg transition-colors disabled:bg-gray-400 disabled:cursor-not-allowed"
                            disabled={isSubmitting}
                        >
                            {isSubmitting ? 'Se trimite...' : 'Trimite raport'}
                        </button>
                    </div>
                </form>
            </div>
        </dialog>
    );
}
