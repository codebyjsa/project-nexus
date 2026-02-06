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
    const [errors, setErrors] = useState({});

    const validateForm = () => {
        const newErrors = {};

        // Course Code validation
        if (!formData.code.trim()) {
            newErrors.code = 'Course code is required';
        } else if (formData.code.length < 2) {
            newErrors.code = 'Course code must be at least 2 characters';
        } else if (!/^[A-Z]{2,4}\d{3}$/i.test(formData.code)) {
            newErrors.code = 'Format: 2-4 letters + 3 digits (e.g., CS101, MATH201)';
        }

        // Course Title validation
        if (!formData.title.trim()) {
            newErrors.title = 'Course title is required';
        } else if (formData.title.length < 3) {
            newErrors.title = 'Title must be at least 3 characters';
        }

        // Professor validation
        if (!formData.professor.trim()) {
            newErrors.professor = 'Professor name is required';
        } else if (formData.professor.length < 3) {
            newErrors.professor = 'Name must be at least 3 characters';
        }

        // Office Hours validation
        if (!formData.officeHours.trim()) {
            newErrors.officeHours = 'Office hours are required';
        } else if (formData.officeHours.length < 5) {
            newErrors.officeHours = 'Please provide valid office hours (e.g., Mon 2-4 PM)';
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!validateForm()) {
            return;
        }

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
                        code: formData.code.toUpperCase(),
                        title: formData.title.trim(),
                        professor: formData.professor.trim(),
                        officeHours: formData.officeHours.trim(),
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
                setErrors({});
            }
        } catch (err) {
            console.error('Error adding course:', err);
        } finally {
            setLoading(false);
        }
    };

    const handleChange = (field, value) => {
        setFormData({ ...formData, [field]: value });
        // Clear error for this field when user starts typing
        if (errors[field]) {
            setErrors({ ...errors, [field]: '' });
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
                        <label className="block text-sm font-medium text-gray-400 mb-2">
                            Course Code <span className="text-red-400">*</span>
                        </label>
                        <input
                            type="text"
                            value={formData.code}
                            onChange={(e) => handleChange('code', e.target.value)}
                            placeholder="e.g., CS301, MATH201"
                            className={`w-full px-4 py-3 bg-gray-800 border rounded-[16px] text-white placeholder-gray-500 focus:outline-none transition-colors ${errors.code ? 'border-red-500 focus:border-red-500' : 'border-gray-700 focus:border-blue-500'
                                }`}
                        />
                        {errors.code && (
                            <p className="mt-1 text-xs text-red-400">{errors.code}</p>
                        )}
                    </div>

                    {/* Course Title */}
                    <div>
                        <label className="block text-sm font-medium text-gray-400 mb-2">
                            Course Title <span className="text-red-400">*</span>
                        </label>
                        <input
                            type="text"
                            value={formData.title}
                            onChange={(e) => handleChange('title', e.target.value)}
                            placeholder="e.g., Advanced Algorithms"
                            className={`w-full px-4 py-3 bg-gray-800 border rounded-[16px] text-white placeholder-gray-500 focus:outline-none transition-colors ${errors.title ? 'border-red-500 focus:border-red-500' : 'border-gray-700 focus:border-blue-500'
                                }`}
                        />
                        {errors.title && (
                            <p className="mt-1 text-xs text-red-400">{errors.title}</p>
                        )}
                    </div>

                    {/* Professor Name */}
                    <div>
                        <label className="block text-sm font-medium text-gray-400 mb-2">
                            Professor <span className="text-red-400">*</span>
                        </label>
                        <input
                            type="text"
                            value={formData.professor}
                            onChange={(e) => handleChange('professor', e.target.value)}
                            placeholder="e.g., Dr. Smith"
                            className={`w-full px-4 py-3 bg-gray-800 border rounded-[16px] text-white placeholder-gray-500 focus:outline-none transition-colors ${errors.professor ? 'border-red-500 focus:border-red-500' : 'border-gray-700 focus:border-blue-500'
                                }`}
                        />
                        {errors.professor && (
                            <p className="mt-1 text-xs text-red-400">{errors.professor}</p>
                        )}
                    </div>

                    {/* Office Hours */}
                    <div>
                        <label className="block text-sm font-medium text-gray-400 mb-2">
                            Office Hours <span className="text-red-400">*</span>
                        </label>
                        <input
                            type="text"
                            value={formData.officeHours}
                            onChange={(e) => handleChange('officeHours', e.target.value)}
                            placeholder="e.g., Mon 2-4 PM"
                            className={`w-full px-4 py-3 bg-gray-800 border rounded-[16px] text-white placeholder-gray-500 focus:outline-none transition-colors ${errors.officeHours ? 'border-red-500 focus:border-red-500' : 'border-gray-700 focus:border-blue-500'
                                }`}
                        />
                        {errors.officeHours && (
                            <p className="mt-1 text-xs text-red-400">{errors.officeHours}</p>
                        )}
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
