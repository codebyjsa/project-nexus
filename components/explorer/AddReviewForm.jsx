/**
 * AddReviewForm Component - Clean iOS Rating Form
 * Owner: SEHAJ
 */

'use client';

import { useState } from 'react';
import { cn } from '@/lib/utils';

export default function AddReviewForm({ onSubmit }) {
    const [rating, setRating] = useState(0);
    const [text, setText] = useState('');
    const [submitting, setSubmitting] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (rating === 0) return;

        setSubmitting(true);
        try {
            await onSubmit?.({ rating, text: text.trim(), userName: 'Student' });
            setRating(0);
            setText('');
        } finally {
            setSubmitting(false);
        }
    };

    return (
        <form onSubmit={handleSubmit} className="rounded-xl bg-[var(--fill-tertiary)] p-4 space-y-4">
            {/* Star Rating */}
            <div>
                <div className="text-xs text-[var(--text-tertiary)] mb-2">Tap to rate</div>
                <div className="flex gap-1">
                    {[1, 2, 3, 4, 5].map((star) => (
                        <button
                            key={star}
                            type="button"
                            onClick={() => setRating(star)}
                            className={cn(
                                'text-3xl transition-transform active:scale-90',
                                rating >= star ? 'text-amber-400' : 'text-[var(--fill-primary)]'
                            )}
                        >
                            ★
                        </button>
                    ))}
                </div>
            </div>

            {/* Review text */}
            <textarea
                value={text}
                onChange={(e) => setText(e.target.value)}
                placeholder="Share your experience... (optional)"
                rows={2}
                maxLength={300}
                className="w-full px-3 py-2 rounded-xl bg-[var(--bg-primary)] border border-[var(--divider)] text-sm resize-none placeholder:text-[var(--text-quaternary)] focus:ring-2 focus:ring-[var(--color-primary)]/30 focus:border-transparent transition-all"
            />

            {/* Submit */}
            <button
                type="submit"
                disabled={rating === 0 || submitting}
                className={cn(
                    'w-full py-2.5 rounded-xl text-sm font-semibold transition-all',
                    rating > 0 && !submitting
                        ? 'bg-[var(--color-primary)] text-white active:scale-[0.98]'
                        : 'bg-[var(--fill-secondary)] text-[var(--text-tertiary)] cursor-not-allowed'
                )}
            >
                {submitting ? 'Submitting...' : 'Submit Review'}
            </button>
        </form>
    );
}
