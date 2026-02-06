export default function Loading() {
    return (
        <div className="container pt-lg">
            {/* Header Skeleton */}
            <div className="mb-lg animate-pulse">
                <div className="skeleton h-10 w-48 mb-sm" />
                <div className="skeleton h-5 w-72" />
            </div>

            {/* Tabs Skeleton */}
            <div className="mb-lg">
                <div className="skeleton h-12 w-full rounded-lg" />
            </div>

            {/* Content Skeleton */}
            <div className="glass-card mb-lg animate-pulse">
                <div className="skeleton h-8 w-40 mb-md" />
                <div className="skeleton h-4 w-64 mb-md" />
                <div className="skeleton h-10 w-full mb-md" />
                <div className="skeleton h-32 w-full mb-md" />
                <div className="flex gap-sm">
                    <div className="skeleton h-10 w-24" />
                    <div className="skeleton h-10 w-20" />
                    <div className="skeleton h-10 flex-1" />
                </div>
            </div>

            {/* Cards Skeleton */}
            {[1, 2, 3].map((i) => (
                <div key={i} className="card mb-md animate-pulse">
                    <div className="p-lg">
                        <div className="flex justify-between mb-sm">
                            <div className="skeleton h-6 w-3/4" />
                            <div className="skeleton h-6 w-20 rounded-full" />
                        </div>
                        <div className="skeleton h-4 w-1/2 mb-md" />
                        <div className="skeleton h-16 w-full mb-md" />
                        <div className="flex gap-xs">
                            <div className="skeleton h-6 w-32 rounded-full" />
                            <div className="skeleton h-6 w-32 rounded-full" />
                        </div>
                    </div>
                </div>
            ))}
        </div>
    );
}
