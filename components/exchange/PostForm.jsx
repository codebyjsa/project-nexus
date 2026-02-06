'use client';

import { useState, useEffect } from 'react';

export default function PostForm({ type, onSubmit, onClose, editData = null, isEditing = false }) {
    const [formData, setFormData] = useState({});
    const [isSubmitting, setIsSubmitting] = useState(false);

    // Pre-fill form when editing
    useEffect(() => {
        if (editData) {
            setFormData(editData);
        }
    }, [editData]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsSubmitting(true);
        try {
            await onSubmit(formData);
            onClose();
        } catch (error) {
            console.error('Failed to submit:', error);
            alert('Failed to submit. Please try again.');
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const renderFields = () => {
        switch (type) {
            case 'lost-found':
                return (
                    <>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                Status *
                            </label>
                            <select
                                name="status"
                                required
                                value={formData.status || ''}
                                onChange={handleChange}
                                className="w-full px-4 py-2.5 rounded-xl border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all text-gray-900 placeholder:text-gray-400"
                            >
                                <option value="">Select status</option>
                                <option value="lost">Lost</option>
                                <option value="found">Found</option>
                            </select>
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                Item Title *
                            </label>
                            <input
                                type="text"
                                name="title"
                                required
                                value={formData.title || ''}
                                onChange={handleChange}
                                placeholder="e.g., Black Backpack"
                                className="w-full px-4 py-2.5 rounded-xl border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all text-gray-900 placeholder:text-gray-400"
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                Description *
                            </label>
                            <textarea
                                name="description"
                                required
                                value={formData.description || ''}
                                onChange={handleChange}
                                rows={3}
                                placeholder="Describe the item..."
                                className="w-full px-4 py-2.5 rounded-xl border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all resize-none text-gray-900 placeholder:text-gray-400"
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                Category *
                            </label>
                            <input
                                type="text"
                                name="category"
                                required
                                value={formData.category || ''}
                                onChange={handleChange}
                                placeholder="e.g., Bag, Electronics, Keys"
                                className="w-full px-4 py-2.5 rounded-xl border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all text-gray-900 placeholder:text-gray-400"
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                Location *
                            </label>
                            <input
                                type="text"
                                name="location"
                                required
                                value={formData.location || ''}
                                onChange={handleChange}
                                placeholder="e.g., Library, Cafeteria"
                                className="w-full px-4 py-2.5 rounded-xl border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all text-gray-900 placeholder:text-gray-400"
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                Your Name *
                            </label>
                            <input
                                type="text"
                                name="userName"
                                required
                                value={formData.userName || ''}
                                onChange={handleChange}
                                placeholder="Your name"
                                className="w-full px-4 py-2.5 rounded-xl border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all text-gray-900 placeholder:text-gray-400"
                            />
                        </div>
                    </>
                );

            case 'marketplace':
                return (
                    <>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                Product Title *
                            </label>
                            <input
                                type="text"
                                name="title"
                                required
                                onChange={handleChange}
                                placeholder="e.g., iPhone 13"
                                className="w-full px-4 py-2.5 rounded-xl border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all text-gray-900 placeholder:text-gray-400"
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                Description *
                            </label>
                            <textarea
                                name="description"
                                required
                                value={formData.description || ''}
                                onChange={handleChange}
                                rows={3}
                                placeholder="Describe your product..."
                                className="w-full px-4 py-2.5 rounded-xl border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all resize-none text-gray-900 placeholder:text-gray-400"
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                Price (₹) *
                            </label>
                            <input
                                type="number"
                                name="price"
                                required
                                value={formData.price || ''}
                                onChange={(e) => handleChange({ target: { name: 'price', value: Number(e.target.value) } })}
                                placeholder="5000"
                                className="w-full px-4 py-2.5 rounded-xl border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all text-gray-900 placeholder:text-gray-400"
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                Category *
                            </label>
                            <input
                                type="text"
                                name="category"
                                required
                                onChange={handleChange}
                                placeholder="e.g., Electronics, Books, Furniture"
                                className="w-full px-4 py-2.5 rounded-xl border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all text-gray-900 placeholder:text-gray-400"
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                Condition *
                            </label>
                            <select
                                name="condition"
                                required
                                value={formData.condition || ''}
                                onChange={handleChange}
                                className="w-full px-4 py-2.5 rounded-xl border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all text-gray-900 placeholder:text-gray-400"
                            >
                                <option value="">Select condition</option>
                                <option value="new">New</option>
                                <option value="good">Good</option>
                                <option value="used">Used</option>
                            </select>
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                Your Name *
                            </label>
                            <input
                                type="text"
                                name="userName"
                                required
                                onChange={handleChange}
                                placeholder="Your name"
                                className="w-full px-4 py-2.5 rounded-xl border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all text-gray-900 placeholder:text-gray-400"
                            />
                        </div>
                    </>
                );

            case 'cabpool':
                return (
                    <>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                Destination *
                            </label>
                            <input
                                type="text"
                                name="destination"
                                required
                                value={formData.destination || ''}
                                onChange={handleChange}
                                placeholder="e.g., Airport, Railway Station"
                                className="w-full px-4 py-2.5 rounded-xl border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all text-gray-900 placeholder:text-gray-400"
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                Departure Date & Time *
                            </label>
                            <input
                                type="datetime-local"
                                name="departureTime"
                                required
                                value={formData.departureTime || ''}
                                onChange={handleChange}
                                className="w-full px-4 py-2.5 rounded-xl border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all text-gray-900 placeholder:text-gray-400"
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                Seats Available *
                            </label>
                            <input
                                type="number"
                                name="seatsAvailable"
                                required
                                min="1"
                                max="6"
                                value={formData.seatsAvailable || ''}
                                onChange={(e) => handleChange({ target: { name: 'seatsAvailable', value: Number(e.target.value) } })}
                                placeholder="3"
                                className="w-full px-4 py-2.5 rounded-xl border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all text-gray-900 placeholder:text-gray-400"
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                Cost Estimate (₹) *
                            </label>
                            <input
                                type="number"
                                name="costEstimate"
                                required
                                value={formData.costEstimate || ''}
                                onChange={(e) => handleChange({ target: { name: 'costEstimate', value: Number(e.target.value) } })}
                                placeholder="200"
                                className="w-full px-4 py-2.5 rounded-xl border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all text-gray-900 placeholder:text-gray-400"
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                Your Name *
                            </label>
                            <input
                                type="text"
                                name="userName"
                                required
                                onChange={handleChange}
                                placeholder="Your name"
                                className="w-full px-4 py-2.5 rounded-xl border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all text-gray-900 placeholder:text-gray-400"
                            />
                        </div>
                    </>
                );

            default:
                return null;
        }
    };

    return (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-3xl shadow-2xl max-w-md w-full max-h-[90vh] overflow-y-auto">
                <div className="sticky top-0 bg-white border-b border-gray-200 px-6 py-4 rounded-t-3xl">
                    <div className="flex items-center justify-between">
                        <h2 className="text-xl font-bold text-gray-900">
                            {isEditing ? 'Edit ' : ''}
                            {type === 'lost-found' && (isEditing ? 'Item' : 'Report Item')}
                            {type === 'marketplace' && (isEditing ? 'Product' : 'List Product')}
                            {type === 'cabpool' && (isEditing ? 'Ride' : 'Create Ride')}
                        </h2>
                        <button
                            onClick={onClose}
                            className="text-gray-400 hover:text-gray-600 transition-colors"
                        >
                            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                            </svg>
                        </button>
                    </div>
                </div>

                <form onSubmit={handleSubmit} className="p-6 space-y-4">
                    {renderFields()}

                    <div className="flex gap-3 pt-4">
                        <button
                            type="button"
                            onClick={onClose}
                            className="flex-1 px-4 py-3 rounded-xl border border-gray-300 text-gray-700 font-medium hover:bg-gray-50 transition-colors"
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            disabled={isSubmitting}
                            className="flex-1 px-4 py-3 rounded-xl bg-blue-600 text-white font-medium hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            {isSubmitting ? (isEditing ? 'Updating...' : 'Submitting...') : (isEditing ? 'Update' : 'Submit')}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}
