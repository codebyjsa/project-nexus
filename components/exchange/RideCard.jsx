'use client';

import { useState } from 'react';

export default function RideCard({ ride, onDelete, onEdit }) {
    const [isDeleting, setIsDeleting] = useState(false);

    const handleDelete = async () => {
        if (!confirm('Are you sure you want to delete this ride?')) return;

        setIsDeleting(true);
        try {
            await onDelete(ride.id);
        } catch (error) {
            console.error('Failed to delete:', error);
            setIsDeleting(false);
        }
    };

    const departureDate = new Date(ride.departureTime);
    const now = new Date();
    const isPast = departureDate < now;

    return (
        <div className={`bg-white/80 backdrop-blur-sm rounded-2xl p-5 shadow-lg hover:shadow-xl transition-all duration-300 border border-gray-100 hover:scale-[1.02] ${isPast ? 'opacity-60' : ''
            }`}>
            {/* Header with Delete Button */}
            <div className="flex items-start justify-between mb-4">
                <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                        <span className="text-2xl">🚗</span>
                        <h3 className="text-lg font-semibold text-gray-900">{ride.destination}</h3>
                    </div>
                    {isPast && (
                        <span className="text-xs text-gray-500 italic">Past ride</span>
                    )}
                </div>
                <div className="flex gap-2">
                    <button
                        onClick={() => onEdit(ride)}
                        className="text-gray-400 hover:text-blue-500 transition-colors"
                        title="Edit ride"
                    >
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                        </svg>
                    </button>
                    <button
                        onClick={handleDelete}
                        disabled={isDeleting}
                        className="text-gray-400 hover:text-red-500 transition-colors disabled:opacity-50"
                        title="Delete ride"
                    >
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                        </svg>
                    </button>
                </div>
            </div>

            {/* Departure Time - Prominent */}
            <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl p-3 mb-3">
                <div className="text-xs text-gray-600 mb-1">Departure Time</div>
                <div className="text-lg font-bold text-gray-900">
                    {departureDate.toLocaleDateString('en-US', {
                        weekday: 'short',
                        month: 'short',
                        day: 'numeric',
                    })}
                </div>
                <div className="text-sm text-gray-700">
                    {departureDate.toLocaleTimeString('en-US', {
                        hour: '2-digit',
                        minute: '2-digit',
                    })}
                </div>
            </div>

            {/* Ride Details */}
            <div className="grid grid-cols-2 gap-3 mb-3">
                <div className="bg-gray-50 rounded-lg p-2.5">
                    <div className="text-xs text-gray-500 mb-1">Seats Available</div>
                    <div className="text-lg font-semibold text-gray-900">{ride.seatsAvailable}</div>
                </div>
                <div className="bg-gray-50 rounded-lg p-2.5">
                    <div className="text-xs text-gray-500 mb-1">Cost Estimate</div>
                    <div className="text-lg font-semibold text-gray-900">₹{ride.costEstimate}</div>
                </div>
            </div>

            {/* Meta Info */}
            <div className="text-xs text-gray-500 space-y-1">
                <div className="flex items-center gap-2">
                    <span className="font-medium">Organizer:</span>
                    <span>{ride.userName}</span>
                </div>
                <div className="text-gray-400">
                    Posted {new Date(ride.createdAt).toLocaleDateString('en-US', {
                        month: 'short',
                        day: 'numeric',
                    })}
                </div>
            </div>
        </div>
    );
}
