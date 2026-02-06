'use client';

import { useState, useEffect } from 'react';
import RideCard from './RideCard';
import PostForm from './PostForm';

export default function CabPoolTab() {
    const [rides, setRides] = useState([]);
    const [showForm, setShowForm] = useState(false);
    const [loading, setLoading] = useState(true);
    const [editingRide, setEditingRide] = useState(null);
    const [isEditing, setIsEditing] = useState(false);

    useEffect(() => {
        fetchRides();
    }, []);

    const fetchRides = async () => {
        try {
            const response = await fetch('/api/cabpool');
            const data = await response.json();
            setRides(data);
        } catch (error) {
            console.error('Failed to fetch rides:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleSubmit = async (formData) => {
        if (isEditing && editingRide) {
            // Update existing ride
            const response = await fetch(`/api/cabpool?id=${editingRide.id}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(formData),
            });

            if (!response.ok) throw new Error('Failed to update ride');
        } else {
            // Create new ride
            const response = await fetch('/api/cabpool', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(formData),
            });

            if (!response.ok) throw new Error('Failed to create ride');
        }

        await fetchRides();
        setEditingRide(null);
        setIsEditing(false);
    };

    const handleEdit = (ride) => {
        setEditingRide(ride);
        setIsEditing(true);
        setShowForm(true);
    };

    const handleCloseForm = () => {
        setShowForm(false);
        setEditingRide(null);
        setIsEditing(false);
    };

    const handleDelete = async (id) => {
        const response = await fetch(`/api/cabpool?id=${id}`, {
            method: 'DELETE',
        });

        if (!response.ok) throw new Error('Failed to delete ride');

        await fetchRides();
    };

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                <div>
                    <h2 className="text-2xl font-bold text-gray-900">Cab Pool</h2>
                    <p className="text-sm text-gray-600 mt-1">
                        Share rides and split costs with fellow students
                    </p>
                </div>
                <button
                    onClick={() => setShowForm(true)}
                    className="px-6 py-3 bg-blue-600 text-white rounded-xl font-medium hover:bg-blue-700 transition-colors shadow-lg hover:shadow-xl"
                >
                    + Create Ride
                </button>
            </div>

            {/* Rides Grid */}
            {loading ? (
                <div className="text-center py-12 text-gray-500">Loading...</div>
            ) : rides.length === 0 ? (
                <div className="text-center py-12 bg-white/50 rounded-2xl">
                    <p className="text-gray-500">No rides available</p>
                    <p className="text-sm text-gray-400 mt-1">Create a ride to get started!</p>
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
                    {rides.map((ride) => (
                        <RideCard key={ride.id} ride={ride} onDelete={handleDelete} onEdit={handleEdit} />
                    ))}
                </div>
            )}

            {/* Form Modal */}
            {showForm && (
                <PostForm
                    type="cabpool"
                    onSubmit={handleSubmit}
                    onClose={handleCloseForm}
                    editData={editingRide}
                    isEditing={isEditing}
                />
            )}
        </div>
    );
}
