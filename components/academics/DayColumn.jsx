'use client';

import ClassSlot from './ClassSlot';

export default function DayColumn({ day, slots, courses }) {
    // Sort slots by start time
    const sortedSlots = [...slots].sort((a, b) => {
        const timeA = parseInt(a.start.replace(':', ''));
        const timeB = parseInt(b.start.replace(':', ''));
        return timeA - timeB;
    });

    // Find free periods
    const findFreePeriods = () => {
        const freePeriods = [];
        for (let i = 0; i < sortedSlots.length - 1; i++) {
            const currentEnd = sortedSlots[i].end;
            const nextStart = sortedSlots[i + 1].start;

            const currentEndMinutes = parseInt(currentEnd.split(':')[0]) * 60 + parseInt(currentEnd.split(':')[1]);
            const nextStartMinutes = parseInt(nextStart.split(':')[0]) * 60 + parseInt(nextStart.split(':')[1]);

            if (nextStartMinutes - currentEndMinutes >= 30) {
                freePeriods.push({
                    start: currentEnd,
                    end: nextStart
                });
            }
        }
        return freePeriods;
    };

    const freePeriods = findFreePeriods();

    // Check for conflicts
    const hasConflicts = () => {
        for (let i = 0; i < sortedSlots.length - 1; i++) {
            const current = sortedSlots[i];
            const next = sortedSlots[i + 1];

            const currentEndMinutes = parseInt(current.end.split(':')[0]) * 60 + parseInt(current.end.split(':')[1]);
            const nextStartMinutes = parseInt(next.start.split(':')[0]) * 60 + parseInt(next.start.split(':')[1]);

            if (currentEndMinutes > nextStartMinutes) {
                return true;
            }
        }
        return false;
    };

    return (
        <div className="flex flex-col gap-3">
            {/* Day Header */}
            <div className="sticky top-0 z-10 bg-gray-900/80 backdrop-blur-xl border border-gray-800 rounded-[20px] p-4">
                <h3 className="text-lg font-semibold text-white flex items-center justify-between">
                    {day}
                    {hasConflicts() && (
                        <span className="text-xs px-3 py-1 bg-red-500/20 border border-red-500/30 text-red-400 rounded-full">
                            ⚠️ Conflict
                        </span>
                    )}
                </h3>
                <p className="text-xs text-gray-500 mt-1">
                    {sortedSlots.length} {sortedSlots.length === 1 ? 'class' : 'classes'}
                    {freePeriods.length > 0 && ` • ${freePeriods.length} free period${freePeriods.length > 1 ? 's' : ''}`}
                </p>
            </div>

            {/* Slots */}
            <div className="space-y-3">
                {sortedSlots.map((slot, index) => {
                    const course = courses.find(c =>
                        c.schedule.some(s => s === slot)
                    );

                    return (
                        <div key={index}>
                            <ClassSlot slot={slot} course={course} />

                            {/* Free Period Indicator */}
                            {freePeriods.some(fp => fp.start === slot.end) && (
                                <div className="my-3 p-3 bg-green-500/10 border border-green-500/20 rounded-[16px] text-center">
                                    <p className="text-xs text-green-400">
                                        🌟 Free Period: {slot.end} - {freePeriods.find(fp => fp.start === slot.end).end}
                                    </p>
                                </div>
                            )}
                        </div>
                    );
                })}
            </div>

            {/* Empty State */}
            {sortedSlots.length === 0 && (
                <div className="p-8 text-center bg-gray-800/30 border border-gray-700/50 rounded-[20px]">
                    <p className="text-gray-500 text-sm">No classes scheduled</p>
                </div>
            )}
        </div>
    );
}
