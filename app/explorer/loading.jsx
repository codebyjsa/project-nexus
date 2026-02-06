/**
 * Explorer Loading State - Premium skeleton screen
 * Owner: SEHAJ
 */

export default function ExplorerLoading() {
    return (
        <div className="container pt-6 pb-32">
            {/* Header skeleton */}
            <div className="mb-6 animate-pulse">
                <div className="flex items-center gap-3 mb-2">
                    <div className="w-12 h-12 rounded-2xl skeleton" />
                    <div>
                        <div className="skeleton h-6 w-24 rounded-md mb-1" />
                        <div className="skeleton h-4 w-40 rounded-md" />
                    </div>
                </div>
            </div>

            {/* Search skeleton */}
            <div className="mb-5 animate-pulse">
                <div className="skeleton h-12 w-full rounded-full" />
            </div>

            {/* Filter chips skeleton */}
            <div className="mb-6 animate-pulse">
                <div className="flex gap-2 mb-3 overflow-hidden">
                    {Array.from({ length: 6 }).map((_, idx) => (
                        <div key={idx} className="skeleton h-10 w-24 rounded-full shrink-0" />
                    ))}
                </div>
                <div className="flex gap-2 overflow-hidden">
                    {Array.from({ length: 5 }).map((_, idx) => (
                        <div key={idx} className="skeleton h-7 w-20 rounded-full shrink-0" />
                    ))}
                </div>
            </div>

            {/* Stats skeleton */}
            <div className="flex justify-between mb-4 animate-pulse">
                <div className="skeleton h-4 w-24 rounded-md" />
                <div className="skeleton h-4 w-20 rounded-md" />
            </div>

            {/* Cards grid skeleton */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {Array.from({ length: 6 }).map((_, idx) => (
                    <div key={idx} className="glass-card animate-pulse">
                        {/* Photo skeleton */}
                        <div className="h-36 -mx-5 -mt-5 mb-4 rounded-t-xl skeleton" />

                        {/* Title skeleton */}
                        <div className="flex justify-between mb-3">
                            <div className="skeleton h-5 w-2/3 rounded-md" />
                            <div className="skeleton h-5 w-12 rounded-md" />
                        </div>

                        {/* Description skeleton */}
                        <div className="skeleton h-10 w-full rounded-md mb-3" />

                        {/* Vibes skeleton */}
                        <div className="flex gap-2 mb-4">
                            <div className="skeleton h-6 w-16 rounded-full" />
                            <div className="skeleton h-6 w-20 rounded-full" />
                            <div className="skeleton h-6 w-14 rounded-full" />
                        </div>

                        {/* Footer skeleton */}
                        <div className="flex justify-between pt-3 border-t border-[var(--divider)]">
                            <div className="skeleton h-4 w-20 rounded-md" />
                            <div className="skeleton h-6 w-16 rounded-full" />
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}
