'use client';

import { useState, useEffect } from 'react';
import DayColumn from './DayColumn';
import AddSlotModal from './AddSlotModal';
import EditSlotModal from './EditSlotModal';

export default function TimetableGrid({ semesterId }) {
    const [timetableData, setTimetableData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [showAddModal, setShowAddModal] = useState(false);
    const [showEditModal, setShowEditModal] = useState(false);
    const [editingSlot, setEditingSlot] = useState(null);

    const days = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'];

    // Fetch timetable data
    const fetchTimetable = async () => {
        try {
            const response = await fetch('/api/timetable');
            const data = await response.json();
            setTimetableData(data);
            setLoading(false);
        } catch (error) {
            console.error('Error fetching timetable:', error);
            setLoading(false);
        }
    };

    // Initial fetch
    useEffect(() => {
        fetchTimetable();
    }, []);

    // Real-time polling every 15 seconds
    useEffect(() => {
        const interval = setInterval(() => {
            fetchTimetable();
        }, 15000);

        return () => clearInterval(interval);
    }, []);

    const handleEditSlot = (course, slot, slotIndex) => {
        setEditingSlot({ course, slot, slotIndex });
        setShowEditModal(true);
    };

    if (loading) {
        return (
            <div className="flex items-center justify-center h-64">
                <div className="text-gray-400 text-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto mb-4"></div>
                    <p>Loading timetable...</p>
                </div>
            </div>
        );
    }

    const semester = timetableData?.semesters?.find(s => s.id === semesterId);

    if (!semester) {
        return (
            <div className="p-8 text-center bg-gray-800/30 border border-gray-700/50 rounded-[28px]">
                <p className="text-gray-500">Semester not found</p>
            </div>
        );
    }

    // Group slots by day
    const slotsByDay = {};
    days.forEach(day => {
        slotsByDay[day] = [];
    });

    semester.courses.forEach(course => {
        course.schedule.forEach(slot => {
            if (slotsByDay[slot.day]) {
                slotsByDay[slot.day].push(slot);
            }
        });
    });

    return (
        <>
            <div className="space-y-6">
                {/* Header with Add Button */}
                <div className="bg-gradient-to-r from-blue-500/10 to-purple-500/10 backdrop-blur-xl border border-gray-700/50 rounded-[28px] p-6">
                    <div className="flex items-center justify-between mb-2">
                        <div>
                            <h2 className="text-2xl font-bold text-white">{semester.name}</h2>
                            <p className="text-sm text-gray-400 mt-1">
                                {semester.courses.length} courses • Auto-updates every 15 seconds
                            </p>
                        </div>
                        <button
                            onClick={() => setShowAddModal(true)}
                            className="px-6 py-3 bg-gradient-to-r from-blue-500 to-purple-500 rounded-[20px] text-white font-medium hover:shadow-lg hover:shadow-blue-500/50 transition-all flex items-center gap-2"
                        >
                            ➕ Add Class
                        </button>
                    </div>
                </div>

                {/* Weekly Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
                    {days.map(day => (
                        <DayColumn
                            key={day}
                            day={day}
                            slots={slotsByDay[day]}
                            courses={semester.courses}
                            semesterId={semesterId}
                            onEditSlot={handleEditSlot}
                        />
                    ))}
                </div>

                {/* Legend */}
                <div className="bg-gray-800/30 backdrop-blur-xl border border-gray-700/50 rounded-[28px] p-6">
                    <h3 className="text-sm font-semibold text-white mb-3">Status Legend</h3>
                    <div className="flex flex-wrap gap-4 text-xs">
                        <div className="flex items-center gap-2">
                            <div className="w-4 h-4 rounded bg-blue-500/20 border border-blue-500/30"></div>
                            <span className="text-gray-400">Active</span>
                        </div>
                        <div className="flex items-center gap-2">
                            <div className="w-4 h-4 rounded bg-red-500/20 border border-red-500/30"></div>
                            <span className="text-gray-400">Cancelled</span>
                        </div>
                        <div className="flex items-center gap-2">
                            <div className="w-4 h-4 rounded bg-orange-500/20 border border-orange-500/30"></div>
                            <span className="text-gray-400">Room Changed</span>
                        </div>
                        <div className="flex items-center gap-2">
                            <div className="w-4 h-4 rounded bg-green-500/20 border border-green-500/30"></div>
                            <span className="text-gray-400">Free Period</span>
                        </div>
                    </div>
                </div>
            </div>

            {/* Modals */}
            <AddSlotModal
                isOpen={showAddModal}
                onClose={() => setShowAddModal(false)}
                semesterId={semesterId}
                courses={semester.courses}
                onSuccess={fetchTimetable}
            />

            <EditSlotModal
                isOpen={showEditModal}
                onClose={() => {
                    setShowEditModal(false);
                    setEditingSlot(null);
                }}
                semesterId={semesterId}
                courseId={editingSlot?.course?.id}
                slot={editingSlot?.slot}
                slotIndex={editingSlot?.slotIndex}
                onSuccess={fetchTimetable}
            />
        </>
    );
}
