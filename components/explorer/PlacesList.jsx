/**
 * PlacesList Component - Clean Grid Layout
 * Owner: SEHAJ
 */

'use client';

import PlaceCard from './PlaceCard';

export default function PlacesList({ places, loading, onPlaceClick }) {
    // Loading skeleton
    if (loading) {
        return (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {Array.from({ length: 4 }).map((_, idx) => (
                    <div key={idx} className="rounded-3xl bg-[var(--fill-tertiary)] animate-pulse p-4">
                        <div className="flex items-center gap-2 mb-3">
                            <div className="w-8 h-8 rounded-xl bg-[var(--fill-secondary)]" />
                            <div className="h-3 w-12 rounded bg-[var(--fill-secondary)]" />
                        </div>
                        <div className="h-5 w-3/4 rounded bg-[var(--fill-secondary)] mb-2" />
                        <div className="h-4 w-1/2 rounded bg-[var(--fill-secondary)] mb-3" />
                        <div className="h-8 w-full rounded bg-[var(--fill-secondary)] mb-3" />
                        <div className="flex justify-between">
                            <div className="h-3 w-16 rounded bg-[var(--fill-secondary)]" />
                            <div className="h-5 w-14 rounded-full bg-[var(--fill-secondary)]" />
                        </div>
                    </div>
                ))}
            </div>
        );
    }

    // Empty state
    if (!places || places.length === 0) {
        return (
            <div className="text-center py-16">
                <div className="text-5xl mb-4">🔍</div>
                <h3 className="font-semibold text-lg mb-1">No places found</h3>
                <p className="text-[var(--text-tertiary)] text-sm">
                    Try adjusting your filters
                </p>
            </div>
        );
    }

    // Grid
    return (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {places.map((place, idx) => (
                <div key={place.id} className="animate-fadeIn" style={{ animationDelay: `${idx * 0.05}s` }}>
                    <PlaceCard place={place} onClick={onPlaceClick} />
                </div>
            ))}
        </div>
    );
}
