/**
 * ReviewCard Component - Minimal iOS Review
 * Owner: SEHAJ
 */

'use client';

import { getRelativeTime } from '@/lib/utils';

export default function ReviewCard({ review }) {
    return (
        <div className="rounded-xl bg-[var(--fill-tertiary)] p-3">
            <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-2">
                    <div className="w-7 h-7 rounded-full bg-gradient-to-br from-[var(--color-primary)] to-indigo-500 flex items-center justify-center text-white text-xs font-bold">
                        {review.userName?.charAt(0)?.toUpperCase() || 'A'}
                    </div>
                    <div>
                        <div className="text-sm font-medium">{review.userName || 'Anonymous'}</div>
                        <div className="text-[10px] text-[var(--text-tertiary)]">{getRelativeTime(review.date)}</div>
                    </div>
                </div>
                <div className="text-amber-400 text-sm">
                    {'★'.repeat(review.rating)}{'☆'.repeat(5 - review.rating)}
                </div>
            </div>
            {review.text && (
                <p className="text-xs text-[var(--text-secondary)] leading-relaxed">{review.text}</p>
            )}
        </div>
    );
}
