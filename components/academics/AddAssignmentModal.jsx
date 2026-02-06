'use client';

import { useState } from 'react';

export default function AddAssignmentModal({ isOpen, onClose, semesterId, courseId, courseName, courses, onSuccess }) {
    const [mode, setMode] = useState('existing'); // 'existing' or 'new'
    const [selectedCourseId, setSelectedCourseId] = useState(courseId || '');
    const [newCourse, setNewCourse] = useState({
        code: '',
        title: '',
        professor: '',
        officeHours: ''
    });
    const [assignment, setAssignment] = useState({
        title: '',
        description: '',
        dueDate: ''
    });
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);

        try {
            let targetCourseId = selectedCourseId;

            // If creating a new course, add it first
            if (mode === 'new') {
                const courseResponse = await fetch('/api/timetable', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({
                        type: 'add_course',
                        semesterId,
                        course: {
                            id: `c${Date.now()}`,
                            code: newCourse.code,
                            title: newCourse.title,
                            professor: newCourse.professor,
                            officeHours: newCourse.officeHours,
                            schedule: [],
                            assignments: [],
                            grades: []
                        }
                    })
                });

                const courseResult = await courseResponse.json();
                if (!courseResult.success) {
                    throw new Error('Failed to create course');
                }

                // Use the newly created course ID
                targetCourseId = `c${Date.now()}`;
            }

            // Add the assignment
            const response = await fetch('/api/timetable', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    type: 'add_assignment',
                    semesterId,
                    courseId: targetCourseId,
                    assignment: {
                        id: `a${Date.now()}`,
                        title: assignment.title,
                        description: assignment.description,
                        dueDate: assignment.dueDate,
                        submitted: false,
                        grade: null
                    }
                })
            });

            const result = await response.json();
            if (result.success) {
                onSuccess();
                onClose();
                resetForm();
            }
        } catch (err) {
            console.error('Error adding assignment:', err);
        } finally {
            setLoading(false);
        }
    };

    const resetForm = () => {
        setMode('existing');
        setSelectedCourseId(courseId || '');
        setNewCourse({ code: '', title: '', professor: '', officeHours: '' });
        setAssignment({ title: '', description: '', dueDate: '' });
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm">
            <div className="bg-gray-900/95 border border-gray-700 rounded-[28px] p-8 max-w-md w-full mx-4 shadow-2xl max-h-[90vh] overflow-y-auto">
                <h2 className="text-2xl font-bold text-white mb-2">Add Assignment</h2>

                {/* Mode Toggle */}
                <div className="flex gap-2 mb-6">
                    <button
                        type="button"
                        onClick={() => setMode('existing')}
                        className={`flex-1 px-4 py-2 rounded-[16px] text-sm font-medium transition-all ${mode === 'existing'
                            ? 'bg-purple-500 text-white'
                            : 'bg-gray-800 text-gray-400 hover:bg-gray-700'
                            }`}
                    >
                        Existing Course
                    </button>
                    <button
                        type="button"
                        onClick={() => setMode('new')}
                        className={`flex-1 px-4 py-2 rounded-[16px] text-sm font-medium transition-all ${mode === 'new'
                            ? 'bg-green-500 text-white'
                            : 'bg-gray-800 text-gray-400 hover:bg-gray-700'
                            }`}
                    >
                        ➕ New Course
                    </button>
                </div>

                <form onSubmit={handleSubmit} className="space-y-4">
                    {/* Course Selection/Creation */}
                    {mode === 'existing' ? (
                        <div>
                            <label className="block text-sm font-medium text-gray-400 mb-2">Select Course</label>
                            <select
                                value={selectedCourseId}
                                onChange={(e) => setSelectedCourseId(e.target.value)}
                                required
                                className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-[16px] text-white focus:outline-none focus:border-purple-500 transition-colors"
                            >
                                <option value="">Choose a course</option>
                                {courses?.map(course => (
                                    <option key={course.id} value={course.id}>
                                        {course.code} - {course.title}
                                    </option>
                                ))}
                            </select>
                        </div>
                    ) : (
                        <div className="space-y-3 p-4 bg-green-500/5 border border-green-500/20 rounded-[16px]">
                            <p className="text-xs text-green-400 mb-2">Create a new course for this assignment</p>

                            <div>
                                <label className="block text-xs font-medium text-gray-400 mb-1">Course Code <span className="text-red-400">*</span></label>
                                <input
                                    type="text"
                                    value={newCourse.code}
                                    onChange={(e) => setNewCourse({ ...newCourse, code: e.target.value.toUpperCase() })}
                                    required
                                    minLength={2}
                                    maxLength={10}
                                    placeholder="e.g., CS301, MATH201"
                                    className="w-full px-3 py-2 bg-gray-800 border border-gray-700 rounded-[12px] text-white text-sm placeholder-gray-500 focus:outline-none focus:border-green-500 transition-colors"
                                />
                            </div>

                            <div>
                                <label className="block text-xs font-medium text-gray-400 mb-1">Course Title <span className="text-red-400">*</span></label>
                                <input
                                    type="text"
                                    value={newCourse.title}
                                    onChange={(e) => setNewCourse({ ...newCourse, title: e.target.value })}
                                    required
                                    minLength={3}
                                    placeholder="e.g., Advanced Algorithms"
                                    className="w-full px-3 py-2 bg-gray-800 border border-gray-700 rounded-[12px] text-white text-sm placeholder-gray-500 focus:outline-none focus:border-green-500 transition-colors"
                                />
                            </div>

                            <div>
                                <label className="block text-xs font-medium text-gray-400 mb-1">Professor <span className="text-red-400">*</span></label>
                                <input
                                    type="text"
                                    value={newCourse.professor}
                                    onChange={(e) => setNewCourse({ ...newCourse, professor: e.target.value })}
                                    required
                                    minLength={3}
                                    placeholder="e.g., Dr. Smith"
                                    className="w-full px-3 py-2 bg-gray-800 border border-gray-700 rounded-[12px] text-white text-sm placeholder-gray-500 focus:outline-none focus:border-green-500 transition-colors"
                                />
                            </div>

                            <div>
                                <label className="block text-xs font-medium text-gray-400 mb-1">Office Hours <span className="text-red-400">*</span></label>
                                <input
                                    type="text"
                                    value={newCourse.officeHours}
                                    onChange={(e) => setNewCourse({ ...newCourse, officeHours: e.target.value })}
                                    required
                                    minLength={5}
                                    placeholder="e.g., Mon 2-4 PM, Tue 10-12 AM"
                                    className="w-full px-3 py-2 bg-gray-800 border border-gray-700 rounded-[12px] text-white text-sm placeholder-gray-500 focus:outline-none focus:border-green-500 transition-colors"
                                />
                            </div>
                        </div>
                    )}

                    {/* Assignment Details */}
                    <div className="pt-2 border-t border-gray-700">
                        <p className="text-xs text-gray-500 mb-3">Assignment Details</p>

                        <div>
                            <label className="block text-sm font-medium text-gray-400 mb-2">Title <span className="text-red-400">*</span></label>
                            <input
                                type="text"
                                value={assignment.title}
                                onChange={(e) => setAssignment({ ...assignment, title: e.target.value })}
                                required
                                minLength={3}
                                placeholder="e.g., Linked List Implementation"
                                className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-[16px] text-white placeholder-gray-500 focus:outline-none focus:border-purple-500 transition-colors"
                            />
                        </div>

                        <div className="mt-3">
                            <label className="block text-sm font-medium text-gray-400 mb-2">Description <span className="text-red-400">*</span></label>
                            <textarea
                                value={assignment.description}
                                onChange={(e) => setAssignment({ ...assignment, description: e.target.value })}
                                required
                                minLength={10}
                                placeholder="Describe the assignment in detail..."
                                rows={3}
                                className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-[16px] text-white placeholder-gray-500 focus:outline-none focus:border-purple-500 transition-colors resize-none"
                            />
                        </div>

                        <div className="mt-3">
                            <label className="block text-sm font-medium text-gray-400 mb-2">Due Date</label>
                            <input
                                type="date"
                                value={assignment.dueDate}
                                onChange={(e) => setAssignment({ ...assignment, dueDate: e.target.value })}
                                required
                                className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-[16px] text-white focus:outline-none focus:border-purple-500 transition-colors"
                            />
                        </div>
                    </div>

                    {/* Action Buttons */}
                    <div className="flex gap-3 pt-4">
                        <button
                            type="button"
                            onClick={() => {
                                onClose();
                                resetForm();
                            }}
                            className="flex-1 px-6 py-3 bg-gray-800 border border-gray-700 rounded-[16px] text-gray-300 font-medium hover:bg-gray-700 transition-colors"
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            disabled={loading}
                            className={`flex-1 px-6 py-3 rounded-[16px] text-white font-medium hover:shadow-lg transition-all disabled:opacity-50 ${mode === 'new'
                                ? 'bg-gradient-to-r from-green-500 to-teal-500 hover:shadow-green-500/50'
                                : 'bg-gradient-to-r from-purple-500 to-pink-500 hover:shadow-purple-500/50'
                                }`}
                        >
                            {loading ? 'Adding...' : mode === 'new' ? 'Create & Add' : 'Add Assignment'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}
