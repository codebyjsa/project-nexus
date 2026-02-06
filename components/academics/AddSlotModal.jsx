'use client';

import { useState } from 'react';

export default function AddSlotModal({ isOpen, onClose, semesterId, courses, onSuccess }) {
    const [formData, setFormData] = useState({
        courseId: '',
        day: 'Monday',
        start: '09:00',
        end: '10:00',
        room: '',
        status: 'active'
    });
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    const days = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'];

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setLoading(true);

        try {
            const response = await fetch('/api/timetable', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    type: 'add_slot',
                    semesterId,
                    courseId: formData.courseId,
                    slot: {
                        day: formData.day,
                        start: formData.start,
                        end: formData.end,
                        room: formData.room,
                        status: formData.status
                    }
                })
            });

            const result = await response.json();

            if (result.success) {
                onSuccess();
                onClose();
                setFormData({
                    courseId: '',
                    day: 'Monday',
                    start: '09:00',
                    end: '10:00',
                    room: '',
                    status: 'active'
                });
            } else {
                setError(result.error || 'Failed to add slot');
            }
        } catch (err) {
            setError('Network error. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm">
            <div className="bg-gray-900/95 border border-gray-700 rounded-[28px] p-8 max-w-md w-full mx-4 shadow-2xl">
                <h2 className="text-2xl font-bold text-white mb-6">Add Class Slot</h2>

                {error && (
                    <div className="mb-4 p-4 bg-red-500/10 border border-red-500/30 rounded-[16px] text-red-400 text-sm">
                        {error}
                    </div>
                )}

                <form onSubmit={handleSubmit} className="space-y-4">
                    {/* Course Selector */}
                    <div>
                        <label className="block text-sm font-medium text-gray-400 mb-2">Course</label>
                        <select
                            value={formData.courseId}
                            onChange={(e) => setFormData({ ...formData, courseId: e.target.value })}
                            required
                            className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-[16px] text-white focus:outline-none focus:border-blue-500 transition-colors"
                        >
                            <option value="">Select a course</option>
                            {courses.map(course => (
                                <option key={course.id} value={course.id}>
                                    {course.code} - {course.title}
                                </option>
                            ))}
                        </select>
                    </div>

                    {/* Day Selector */}
                    <div>
                        <label className="block text-sm font-medium text-gray-400 mb-2">Day</label>
                        <select
                            value={formData.day}
                            onChange={(e) => setFormData({ ...formData, day: e.target.value })}
                            className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-[16px] text-white focus:outline-none focus:border-blue-500 transition-colors"
                        >
                            {days.map(day => (
                                <option key={day} value={day}>{day}</option>
                            ))}
                        </select>
                    </div>

                    {/* Time Pickers */}
                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-400 mb-2">Start Time</label>
                            <input
                                type="time"
                                value={formData.start}
                                onChange={(e) => setFormData({ ...formData, start: e.target.value })}
                                required
                                className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-[16px] text-white focus:outline-none focus:border-blue-500 transition-colors"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-400 mb-2">End Time</label>
                            <input
                                type="time"
                                value={formData.end}
                                onChange={(e) => setFormData({ ...formData, end: e.target.value })}
                                required
                                className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-[16px] text-white focus:outline-none focus:border-blue-500 transition-colors"
                            />
                        </div>
                    </div>

                    {/* Room Input */}
                    <div>
                        <label className="block text-sm font-medium text-gray-400 mb-2">Room</label>
                        <input
                            type="text"
                            value={formData.room}
                            onChange={(e) => setFormData({ ...formData, room: e.target.value })}
                            required
                            placeholder="e.g., B201"
                            className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-[16px] text-white placeholder-gray-500 focus:outline-none focus:border-blue-500 transition-colors"
                        />
                    </div>

                    {/* Action Buttons */}
                    <div className="flex gap-3 pt-4">
                        <button
                            type="button"
                            onClick={onClose}
                            className="flex-1 px-6 py-3 bg-gray-800 border border-gray-700 rounded-[16px] text-gray-300 font-medium hover:bg-gray-700 transition-colors"
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            disabled={loading}
                            className="flex-1 px-6 py-3 bg-gradient-to-r from-blue-500 to-purple-500 rounded-[16px] text-white font-medium hover:shadow-lg hover:shadow-blue-500/50 transition-all disabled:opacity-50"
                        >
                            {loading ? 'Adding...' : 'Add Slot'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}
