'use client';

import { useState } from 'react';

export default function AddCourseModal({ isOpen, onClose, semesterId, onSuccess }) {
    const [formData, setFormData] = useState({
        code: '',
        title: '',
        professor: '',
        officeHours: ''
    });
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);

        try {
            const response = await fetch('/api/timetable', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    type: 'add_course',
                    semesterId,
                    course: {
                        id: `c${Date.now()}`,
                        code: formData.code,
                        title: formData.title,
                        professor: formData.professor,
                        officeHours: formData.officeHours,
                        schedule: [],
                        assignments: [],
                        grades: []
                    }
                })
            });

            const result = await response.json();
            if (result.success) {
                onSuccess();
                onClose();
                setFormData({ code: '', title: '', professor: '', officeHours: '' });
            }
        } catch (err) {
            console.error('Error adding course:', err);
        } finally {
            setLoading(false);
        }
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm">
            <div className="bg-gray-900/95 border border-gray-700 rounded-[28px] p-8 max-w-md w-full mx-4 shadow-2xl">
                <h2 className="text-2xl font-bold text-white mb-6">Add New Course</h2>

                <form onSubmit={handleSubmit} className="space-y-4">
                    {/* Course Code */}
                    <div>
                        <label className="block text-sm font-medium text-gray-400 mb-2">Course Code</label>
                        <input
                            type="text"
                            value={formData.code}
                            onChange={(e) => setFormData({ ...formData, code: e.target.value })}
                            required
                            placeholder="e.g., CS301"
                            className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-[16px] text-white placeholder-gray-500 focus:outline-none focus:border-blue-500 transition-colors"
                        />
                    </div>

                    {/* Course Title */}
                    <div>
                        <label className="block text-sm font-medium text-gray-400 mb-2">Course Title</label>
                        <input
                            type="text"
                            value={formData.title}
                            onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                            required
                            placeholder="e.g., Advanced Algorithms"
                            className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-[16px] text-white placeholder-gray-500 focus:outline-none focus:border-blue-500 transition-colors"
                        />
                    </div>

                    {/* Professor Name */}
                    <div>
                        <label className="block text-sm font-medium text-gray-400 mb-2">Professor</label>
                        <input
                            type="text"
                            value={formData.professor}
                            onChange={(e) => setFormData({ ...formData, professor: e.target.value })}
                            required
                            placeholder="e.g., Dr. Smith"
                            className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-[16px] text-white placeholder-gray-500 focus:outline-none focus:border-blue-500 transition-colors"
                        />
                    </div>

                    {/* Office Hours */}
                    <div>
                        <label className="block text-sm font-medium text-gray-400 mb-2">Office Hours</label>
                        <input
                            type="text"
                            value={formData.officeHours}
                            onChange={(e) => setFormData({ ...formData, officeHours: e.target.value })}
                            required
                            placeholder="e.g., Mon 2-4 PM"
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
                            className="flex-1 px-6 py-3 bg-gradient-to-r from-green-500 to-teal-500 rounded-[16px] text-white font-medium hover:shadow-lg hover:shadow-green-500/50 transition-all disabled:opacity-50"
                        >
                            {loading ? 'Adding...' : 'Add Course'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}
