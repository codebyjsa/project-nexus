export default function Loading() {
    return (
        <div className="container pt-lg">
            <div className="mb-lg animate-pulse">
                <div className="skeleton h-10 w-48 mb-sm" />
                <div className="skeleton h-5 w-72" />
            </div>
            <div className="skeleton h-64 w-full rounded-xl" />
        </div>
    );
}
