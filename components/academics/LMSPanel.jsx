'use client';

import { useState, useEffect } from 'react';
import AddAssignmentModal from './AddAssignmentModal';
import AddCourseModal from './AddCourseModal';

export default function LMSPanel({ semesterId }) {
    const [timetableData, setTimetableData] = useState(null);
    const [loading, setLoading] = useState(false);
    const [showAddModal, setShowAddModal] = useState(false);
    const [showAddCourseModal, setShowAddCourseModal] = useState(false);
    const [selectedCourse, setSelectedCourse] = useState(null);

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

    // Toggle assignment submission
    const toggleSubmission = async (courseId, assignmentId, currentStatus) => {
        try {
            await fetch('/api/timetable', {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    type: 'submit_assignment',
                    semesterId,
                    courseId,
                    assignmentId,
                    submitted: !currentStatus
                })
            });
            fetchTimetable();
        } catch (error) {
            console.error('Error updating submission:', error);
        }
    };

    // Delete assignment
    const deleteAssignment = async (courseId, assignmentId) => {
        if (!confirm('Are you sure you want to delete this assignment?')) return;

        try {
            await fetch('/api/timetable', {
                method: 'DELETE',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    type: 'delete_assignment',
                    semesterId,
                    courseId,
                    assignmentId
                })
            });
            fetchTimetable();
        } catch (error) {
            console.error('Error deleting assignment:', error);
        }
    };

    // Calculate days until due date
    const getDaysUntilDue = (dueDate) => {
        const today = new Date();
        const due = new Date(dueDate);
        const diffTime = due - today;
        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
        return diffDays;
    };

    // Get countdown color
    const getCountdownColor = (days) => {
        if (days <= 2) return 'text-red-400 bg-red-500/10 border-red-500/30';
        if (days <= 5) return 'text-orange-400 bg-orange-500/10 border-orange-500/30';
        return 'text-green-400 bg-green-500/10 border-green-500/30';
    };

    if (loading) {
        return (
            <div className="flex items-center justify-center h-64">
                <div className="text-gray-400 text-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto mb-4"></div>
                    <p>Loading assignments...</p>
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

    // Collect all assignments
    const allAssignments = [];
    semester.courses.forEach(course => {
        course.assignments.forEach(assignment => {
            allAssignments.push({
                ...assignment,
                courseCode: course.code,
                courseTitle: course.title,
                courseId: course.id
            });
        });
    });

    // Sort by due date
    allAssignments.sort((a, b) => new Date(a.dueDate) - new Date(b.dueDate));

    // Check for urgent assignments (due in 1 day)
    const urgentAssignments = allAssignments.filter(a => getDaysUntilDue(a.dueDate) <= 1 && !a.submitted);

    return (
        <>
            <div className="space-y-6">
                {/* Header */}
                <div className="bg-gradient-to-r from-purple-500/10 to-pink-500/10 backdrop-blur-xl border border-gray-700/50 rounded-[28px] p-6">
                    <div className="flex items-center justify-between mb-2">
                        <div>
                            <h2 className="text-2xl font-bold text-white">Learning Management</h2>
                            <p className="text-sm text-gray-400">
                                {allAssignments.length} total assignments • {allAssignments.filter(a => a.submitted).length} submitted
                            </p>
                        </div>
                        <button
                            onClick={() => setShowAddCourseModal(true)}
                            className="px-6 py-3 bg-gradient-to-r from-green-500 to-teal-500 rounded-[20px] text-white font-medium hover:shadow-lg hover:shadow-green-500/50 transition-all flex items-center gap-2"
                        >
                            ➕ Add Course
                        </button>
                    </div>
                </div>

                {/* Urgent Reminder */}
                {urgentAssignments.length > 0 && (
                    <div className="bg-red-500/10 backdrop-blur-xl border border-red-500/30 rounded-[28px] p-6 animate-pulse">
                        <h3 className="text-lg font-semibold text-red-400 mb-2">⚠️ Urgent Reminder</h3>
                        <p className="text-sm text-gray-300">
                            {urgentAssignments.length} assignment{urgentAssignments.length > 1 ? 's' : ''} due within 24 hours!
                        </p>
                    </div>
                )}

                {/* Assignments List */}
                <div className="space-y-4">
                    {semester.courses.map(course => (
                        <div key={course.id} className="bg-gray-800/30 backdrop-blur-xl border border-gray-700/50 rounded-[28px] p-6">
                            {/* Course Header with Add Button */}
                            <div className="flex items-center justify-between mb-4">
                                <div>
                                    <h3 className="text-lg font-semibold text-white">{course.code}</h3>
                                    <p className="text-sm text-gray-400">{course.title}</p>
                                </div>
                                <button
                                    onClick={() => {
                                        setSelectedCourse(course);
                                        setShowAddModal(true);
                                    }}
                                    className="px-4 py-2 bg-gradient-to-r from-purple-500 to-pink-500 rounded-[16px] text-white text-sm font-medium hover:shadow-lg hover:shadow-purple-500/50 transition-all flex items-center gap-2"
                                >
                                    ➕ Add Assignment
                                </button>
                            </div>

                            {/* Assignments */}
                            {course.assignments.length > 0 ? (
                                <div className="space-y-3">
                                    {course.assignments.map(assignment => {
                                        const daysUntilDue = getDaysUntilDue(assignment.dueDate);
                                        const isOverdue = daysUntilDue < 0;

                                        return (
                                            <div
                                                key={assignment.id}
                                                className="bg-gray-900/50 border border-gray-700 rounded-[20px] p-4 hover:border-blue-500/50 transition-all duration-300 group"
                                            >
                                                <div className="flex items-start justify-between mb-2">
                                                    <div className="flex-1">
                                                        <h4 className="text-white font-medium mb-1">{assignment.title}</h4>
                                                        <p className="text-sm text-gray-400 mb-2">{assignment.description}</p>

                                                        {/* Due Date */}
                                                        <div className="flex items-center gap-3 text-xs">
                                                            <span className="text-gray-500">
                                                                Due: {new Date(assignment.dueDate).toLocaleDateString()}
                                                            </span>
                                                            <span className={`px-2 py-1 rounded-full border ${getCountdownColor(daysUntilDue)}`}>
                                                                {isOverdue ? `${Math.abs(daysUntilDue)} days overdue` : `${daysUntilDue} days left`}
                                                            </span>
                                                        </div>
                                                    </div>

                                                    {/* Action Buttons */}
                                                    <div className="flex gap-2">
                                                        <button
                                                            onClick={() => toggleSubmission(course.id, assignment.id, assignment.submitted)}
                                                            className={`px-4 py-2 rounded-[16px] text-sm font-medium transition-all duration-300 ${assignment.submitted
                                                                    ? 'bg-green-500/20 border border-green-500/30 text-green-400 hover:bg-green-500/30'
                                                                    : 'bg-blue-500/20 border border-blue-500/30 text-blue-400 hover:bg-blue-500/30'
                                                                }`}
                                                        >
                                                            {assignment.submitted ? '✓ Submitted' : 'Mark as Submitted'}
                                                        </button>
                                                        <button
                                                            onClick={() => deleteAssignment(course.id, assignment.id)}
                                                            className="opacity-0 group-hover:opacity-100 transition-opacity p-2 bg-red-500/10 hover:bg-red-500/20 border border-red-500/30 rounded-[12px] text-red-400"
                                                            title="Delete assignment"
                                                        >
                                                            🗑️
                                                        </button>
                                                    </div>
                                                </div>

                                                {/* Grade Display */}
                                                {assignment.grade !== null && (
                                                    <div className="mt-3 pt-3 border-t border-gray-700">
                                                        <span className="text-sm text-gray-400">
                                                            Grade: <span className="text-white font-semibold">{assignment.grade}</span>
                                                        </span>
                                                    </div>
                                                )}
                                            </div>
                                        );
                                    })}
                                </div>
                            ) : (
                                <div className="p-6 text-center bg-gray-900/30 border border-gray-700/50 rounded-[20px]">
                                    <p className="text-gray-500 text-sm">No assignments yet</p>
                                </div>
                            )}
                        </div>
                    ))}
                </div>
            </div>

            {/* Add Assignment Modal */}
            <AddAssignmentModal
                isOpen={showAddModal}
                onClose={() => {
                    setShowAddModal(false);
                    setSelectedCourse(null);
                }}
                semesterId={semesterId}
                courseId={selectedCourse?.id}
                courseName={selectedCourse ? `${selectedCourse.code} - ${selectedCourse.title}` : ''}
                courses={semester.courses}
                onSuccess={fetchTimetable}
            />

            {/* Add Course Modal */}
            <AddCourseModal
                isOpen={showAddCourseModal}
                onClose={() => setShowAddCourseModal(false)}
                semesterId={semesterId}
                onSuccess={fetchTimetable}
            />
        </>
    );
}
