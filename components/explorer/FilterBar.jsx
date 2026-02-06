/**
 * FilterBar Component - iOS 18+ Pill Filters
 * Owner: SEHAJ
 */

'use client';

import { cn } from '@/lib/utils';

const categories = [
    { id: 'all', label: 'All', icon: '✨' },
    { id: 'food', label: 'Food', icon: '🍽️' },
    { id: 'cafe', label: 'Cafés', icon: '☕' },
    { id: 'nature', label: 'Nature', icon: '🌿' },
    { id: 'entertainment', label: 'Fun', icon: '🎮' },
    { id: 'shopping', label: 'Shop', icon: '🛍️' },
    { id: 'spiritual', label: 'Spiritual', icon: '🙏' },
    { id: 'fitness', label: 'Fitness', icon: '💪' },
];

export default function FilterBar({
    activeCategory = 'all',
    openNowFilter = false,
    onCategoryChange,
    onOpenNowChange,
}) {
    return (
        <div className="space-y-3">
            {/* Category Pills */}
            <div className="flex gap-2 overflow-x-auto pb-1 scrollbar-hide -mx-4 px-4">
                {categories.map((cat) => (
                    <button
                        key={cat.id}
                        onClick={() => onCategoryChange?.(cat.id)}
                        className={cn(
                            'inline-flex items-center gap-1.5 px-4 py-2 rounded-full text-sm font-semibold whitespace-nowrap shrink-0',
                            'transition-all duration-200 active:scale-95',
                            activeCategory === cat.id
                                ? 'bg-[var(--color-primary)] text-white shadow-lg shadow-[var(--color-primary)]/25'
                                : 'bg-[var(--fill-tertiary)] text-[var(--text-secondary)] hover:bg-[var(--fill-secondary)]'
                        )}
                    >
                        <span>{cat.icon}</span>
                        <span>{cat.label}</span>
                    </button>
                ))}
            </div>

            {/* Open Now Toggle */}
            <button
                onClick={() => onOpenNowChange?.(!openNowFilter)}
                className={cn(
                    'inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-semibold',
                    'transition-all duration-200 active:scale-95',
                    openNowFilter
                        ? 'bg-emerald-500/15 text-emerald-600 border border-emerald-500/30'
                        : 'bg-[var(--fill-tertiary)] text-[var(--text-tertiary)] border border-transparent'
                )}
            >
                <span className={cn(
                    'w-2 h-2 rounded-full',
                    openNowFilter ? 'bg-emerald-500 animate-pulse' : 'bg-[var(--text-quaternary)]'
                )} />
                Open Now
            </button>
        </div>
    );
}
