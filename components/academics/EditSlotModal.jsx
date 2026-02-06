'use client';

import { useState } from 'react';

export default function EditSlotModal({ isOpen, onClose, semesterId, courseId, slot, slotIndex, onSuccess }) {
    const [formData, setFormData] = useState({
        room: slot?.room || '',
        status: slot?.status || 'active'
    });
    const [loading, setLoading] = useState(false);
    const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

    const handleUpdate = async () => {
        setLoading(true);
        try {
            const response = await fetch('/api/timetable', {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    type: 'update_slot',
                    semesterId,
                    courseId,
                    slotIndex,
                    updates: formData
                })
            });

            const result = await response.json();
            if (result.success) {
                onSuccess();
                onClose();
            }
        } catch (err) {
            console.error('Error updating slot:', err);
        } finally {
            setLoading(false);
        }
    };

    const handleDelete = async () => {
        setLoading(true);
        try {
            const response = await fetch('/api/timetable', {
                method: 'DELETE',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    type: 'delete_slot',
                    semesterId,
                    courseId,
                    slotIndex
                })
            });

            const result = await response.json();
            if (result.success) {
                onSuccess();
                onClose();
            }
        } catch (err) {
            console.error('Error deleting slot:', err);
        } finally {
            setLoading(false);
        }
    };

    if (!isOpen || !slot) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm">
            <div className="bg-gray-900/95 border border-gray-700 rounded-[28px] p-8 max-w-md w-full mx-4 shadow-2xl">
                <h2 className="text-2xl font-bold text-white mb-2">Edit Class Slot</h2>
                <p className="text-gray-400 text-sm mb-6">
                    {slot.day} • {slot.start} - {slot.end}
                </p>

                {!showDeleteConfirm ? (
                    <div className="space-y-4">
                        {/* Room Input */}
                        <div>
                            <label className="block text-sm font-medium text-gray-400 mb-2">Room</label>
                            <input
                                type="text"
                                value={formData.room}
                                onChange={(e) => setFormData({ ...formData, room: e.target.value })}
                                className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-[16px] text-white focus:outline-none focus:border-blue-500 transition-colors"
                            />
                        </div>

                        {/* Status Selector */}
                        <div>
                            <label className="block text-sm font-medium text-gray-400 mb-2">Status</label>
                            <select
                                value={formData.status}
                                onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                                className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-[16px] text-white focus:outline-none focus:border-blue-500 transition-colors"
                            >
                                <option value="active">Active</option>
                                <option value="cancelled">Cancelled</option>
                                <option value="changed">Room Changed</option>
                            </select>
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
                                type="button"
                                onClick={handleUpdate}
                                disabled={loading}
                                className="flex-1 px-6 py-3 bg-gradient-to-r from-blue-500 to-purple-500 rounded-[16px] text-white font-medium hover:shadow-lg hover:shadow-blue-500/50 transition-all disabled:opacity-50"
                            >
                                {loading ? 'Updating...' : 'Update'}
                            </button>
                        </div>

                        {/* Delete Button */}
                        <button
                            type="button"
                            onClick={() => setShowDeleteConfirm(true)}
                            className="w-full px-6 py-3 bg-red-500/10 border border-red-500/30 rounded-[16px] text-red-400 font-medium hover:bg-red-500/20 transition-colors"
                        >
                            🗑️ Delete Slot
                        </button>
                    </div>
                ) : (
                    <div className="space-y-4">
                        <div className="p-4 bg-red-500/10 border border-red-500/30 rounded-[16px]">
                            <p className="text-red-400 text-sm">
                                Are you sure you want to delete this class slot? This action cannot be undone.
                            </p>
                        </div>

                        <div className="flex gap-3">
                            <button
                                type="button"
                                onClick={() => setShowDeleteConfirm(false)}
                                className="flex-1 px-6 py-3 bg-gray-800 border border-gray-700 rounded-[16px] text-gray-300 font-medium hover:bg-gray-700 transition-colors"
                            >
                                Cancel
                            </button>
                            <button
                                type="button"
                                onClick={handleDelete}
                                disabled={loading}
                                className="flex-1 px-6 py-3 bg-red-500 rounded-[16px] text-white font-medium hover:bg-red-600 transition-colors disabled:opacity-50"
                            >
                                {loading ? 'Deleting...' : 'Confirm Delete'}
                            </button>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}
