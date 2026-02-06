'use client';

export default function ClassSlot({ slot, course, onEdit }) {
    const getStatusColor = (status) => {
        switch (status) {
            case 'cancelled':
                return 'bg-red-500/10 border-red-500/30 text-red-400';
            case 'changed':
                return 'bg-orange-500/10 border-orange-500/30 text-orange-400';
            default:
                return 'bg-blue-500/10 border-blue-500/30 text-blue-400';
        }
    };

    const getStatusBadge = (status) => {
        if (status === 'cancelled') return '🚫 Cancelled';
        if (status === 'changed') return '📍 Room Changed';
        return null;
    };

    return (
        <div
            className={`relative p-4 rounded-[20px] backdrop-blur-xl border transition-all duration-300 hover:scale-[1.02] hover:shadow-lg group ${getStatusColor(
                slot.status
            )}`}
        >
            {/* Edit Button (shows on hover) */}
            {onEdit && (
                <button
                    onClick={onEdit}
                    className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity duration-200 p-2 bg-gray-800/90 hover:bg-gray-700 rounded-[12px] text-gray-300 hover:text-white z-10"
                    title="Edit slot"
                >
                    ✏️
                </button>
            )}

            {/* Course Code */}
            <div className="flex items-start justify-between mb-2">
                <h3 className="text-lg font-semibold text-white">{course.code}</h3>
                {getStatusBadge(slot.status) && (
                    <span className="text-xs px-2 py-1 rounded-full bg-white/10">
                        {getStatusBadge(slot.status)}
                    </span>
                )}
            </div>

            {/* Course Title */}
            <p className="text-sm text-gray-300 mb-2">{course.title}</p>

            {/* Time and Room */}
            <div className="flex items-center gap-3 text-sm text-gray-400 mb-2">
                <span className="flex items-center gap-1">
                    🕐 {slot.start} - {slot.end}
                </span>
                <span className="flex items-center gap-1">📍 {slot.room}</span>
            </div>

            {/* Professor Info with Tooltip */}
            <div className="relative group/prof">
                <p className="text-xs text-gray-500 flex items-center gap-1 cursor-help">
                    👤 {course.professor}
                    <span className="text-blue-400">ℹ️</span>
                </p>
                {/* Tooltip */}
                <div className="absolute bottom-full left-0 mb-2 hidden group-hover/prof:block z-10">
                    <div className="bg-gray-900/95 backdrop-blur-xl border border-gray-700 rounded-2xl px-4 py-2 text-xs text-gray-300 whitespace-nowrap shadow-xl">
                        Office Hours: {course.officeHours}
                    </div>
                </div>
            </div>
        </div>
    );
}
