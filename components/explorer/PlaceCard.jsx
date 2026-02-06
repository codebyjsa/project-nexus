/**
 * PlaceCard Component - Ultra Premium iOS 18+ Glass Card
 * Owner: SEHAJ
 */

'use client';

import { cn, getExploreCategoryStyle, getOpenStatus } from '@/lib/utils';

export default function PlaceCard({ place, onClick }) {
    const categoryStyle = getExploreCategoryStyle(place.category);
    const openStatus = getOpenStatus(place.operatingHours);

    return (
        <div
            onClick={() => onClick?.(place)}
            className={cn(
                'relative overflow-hidden cursor-pointer group',
                'bg-[var(--glass-bg-thick)] backdrop-blur-xl',
                'border border-[var(--glass-border-light)]',
                'rounded-3xl p-4',
                'transition-all duration-300 ease-out',
                'hover:scale-[1.02] hover:shadow-2xl hover:bg-[var(--glass-bg-ultra)]',
                'active:scale-[0.98]'
            )}
        >
            {/* Category Icon Strip */}
            <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-2">
                    <span className={cn(
                        'w-8 h-8 rounded-xl flex items-center justify-center text-sm',
                        'bg-gradient-to-br shadow-sm',
                        place.category === 'food' && 'from-orange-400 to-red-500',
                        place.category === 'cafe' && 'from-amber-400 to-orange-500',
                        place.category === 'nature' && 'from-emerald-400 to-green-500',
                        place.category === 'entertainment' && 'from-purple-400 to-pink-500',
                        place.category === 'shopping' && 'from-blue-400 to-indigo-500',
                        place.category === 'spiritual' && 'from-amber-300 to-orange-400',
                        place.category === 'fitness' && 'from-rose-400 to-red-500',
                    )}>
                        {categoryStyle.icon}
                    </span>
                    <span className="text-xs font-medium text-[var(--text-tertiary)] capitalize">
                        {place.category}
                    </span>
                </div>

                {/* Student Discount Badge */}
                {place.studentDiscount && (
                    <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-500/20 text-emerald-600">
                        🎓 Discount
                    </span>
                )}
            </div>

            {/* Title & Rating */}
            <div className="mb-2">
                <h3 className="font-semibold text-base leading-tight mb-1 line-clamp-1 group-hover:text-[var(--color-primary)] transition-colors">
                    {place.name}
                </h3>
                <div className="flex items-center gap-2 text-sm">
                    <span className="text-amber-400">★</span>
                    <span className="font-semibold">{place.rating?.toFixed(1)}</span>
                    <span className="text-[var(--text-quaternary)]">({place.reviewCount})</span>
                    <span className="text-[var(--text-quaternary)]">•</span>
                    <span className="text-[var(--text-tertiary)]">{place.priceRange}</span>
                </div>
            </div>

            {/* Description */}
            <p className="text-xs text-[var(--text-secondary)] line-clamp-2 mb-3">
                {place.description}
            </p>

            {/* Footer: Distance + Open Status */}
            <div className="flex items-center justify-between">
                <span className="text-xs text-[var(--text-tertiary)]">
                    📍 {place.distance ? `${place.distance} km` : 'Nearby'}
                </span>
                <span className={cn(
                    'text-xs font-semibold px-2 py-0.5 rounded-full',
                    openStatus.isOpen
                        ? 'bg-emerald-500/15 text-emerald-600'
                        : 'bg-[var(--fill-tertiary)] text-[var(--text-tertiary)]'
                )}>
                    {openStatus.isOpen ? '● Open' : '○ Closed'}
                </span>
            </div>

            {/* Hover glow effect */}
            <div className="absolute inset-0 rounded-3xl opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none"
                style={{ boxShadow: 'inset 0 0 0 1px rgba(255,255,255,0.1)' }}
            />
        </div>
    );
}
