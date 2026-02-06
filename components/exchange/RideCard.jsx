'use client';

import { useState } from 'react';

export default function RideCard({ ride, onDelete }) {
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
    const isUpcoming = departureDate > new Date();

    return (
        <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-5 shadow-lg hover:shadow-xl transition-all duration-300 border border-gray-100 hover:scale-[1.02]">
            {/* Header */}
            <div className="flex items-start justify-between mb-3">
                <div className="flex-1">
                    <h3 className="text-lg font-semibold text-gray-900 mb-1">
                        📍 {ride.destination}
                    </h3>
                    <div className="text-sm text-gray-500">
                        {isUpcoming ? '🟢 Upcoming' : '⚪ Past'}
                    </div>
                </div>
                <button
                    onClick={handleDelete}
                    disabled={isDeleting}
                    className="text-gray-400 hover:text-red-500 transition-colors disabled:opacity-50"
                >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                </button>
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
