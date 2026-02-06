'use client';

import { useState, useEffect } from 'react';
import ItemCard from './ItemCard';
import PostForm from './PostForm';

export default function LostFoundTab() {
    const [items, setItems] = useState([]);
    const [showForm, setShowForm] = useState(false);
    const [loading, setLoading] = useState(true);
    const [filter, setFilter] = useState('all'); // 'all', 'lost', 'found'
    const [editingItem, setEditingItem] = useState(null);
    const [isEditing, setIsEditing] = useState(false);

    useEffect(() => {
        fetchItems();
    }, []);

    const fetchItems = async () => {
        try {
            const response = await fetch('/api/lost-found');
            const data = await response.json();
            setItems(data);
        } catch (error) {
            console.error('Failed to fetch items:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleSubmit = async (formData) => {
        if (isEditing && editingItem) {
            // Update existing item
            const response = await fetch(`/api/lost-found?id=${editingItem.id}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(formData),
            });

            if (!response.ok) throw new Error('Failed to update item');
        } else {
            // Create new item
            const response = await fetch('/api/lost-found', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(formData),
            });

            if (!response.ok) throw new Error('Failed to create item');
        }

        await fetchItems();
        setEditingItem(null);
        setIsEditing(false);
    };

    const handleEdit = (item) => {
        setEditingItem(item);
        setIsEditing(true);
        setShowForm(true);
    };

    const handleCloseForm = () => {
        setShowForm(false);
        setEditingItem(null);
        setIsEditing(false);
    };

    const handleDelete = async (id) => {
        const response = await fetch(`/api/lost-found?id=${id}`, {
            method: 'DELETE',
        });

        if (!response.ok) throw new Error('Failed to delete item');

        await fetchItems();
    };

    const filteredItems = items.filter(item => {
        if (filter === 'all') return true;
        return item.status === filter;
    });

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                <div>
                    <h2 className="text-2xl font-bold text-gray-900">Lost & Found</h2>
                    <p className="text-sm text-gray-600 mt-1">
                        Help reunite lost items with their owners
                    </p>
                </div>
                <button
                    onClick={() => setShowForm(true)}
                    className="px-6 py-3 bg-blue-600 text-white rounded-xl font-medium hover:bg-blue-700 transition-colors shadow-lg hover:shadow-xl"
                >
                    + Report Item
                </button>
            </div>

            {/* Filters */}
            <div className="flex gap-2 overflow-x-auto pb-2">
                {['all', 'lost', 'found'].map((f) => (
                    <button
                        key={f}
                        onClick={() => setFilter(f)}
                        className={`px-4 py-2 rounded-xl font-medium transition-all whitespace-nowrap ${filter === f
                            ? 'bg-blue-600 text-white shadow-lg'
                            : 'bg-white/80 text-gray-700 hover:bg-gray-100'
                            }`}
                    >
                        {f === 'all' && `All (${items.length})`}
                        {f === 'lost' && `🔴 Lost (${items.filter(i => i.status === 'lost').length})`}
                        {f === 'found' && `🟢 Found (${items.filter(i => i.status === 'found').length})`}
                    </button>
                ))}
            </div>

            {/* Items Grid */}
            {loading ? (
                <div className="text-center py-12 text-gray-500">Loading...</div>
            ) : filteredItems.length === 0 ? (
                <div className="text-center py-12 bg-white/50 rounded-2xl">
                    <p className="text-gray-500">No items found</p>
                    <p className="text-sm text-gray-400 mt-1">Be the first to report an item!</p>
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
                    {filteredItems.map((item) => (
                        <ItemCard key={item.id} item={item} onDelete={handleDelete} onEdit={handleEdit} />
                    ))}
                </div>
            )}

            {/* Form Modal */}
            {showForm && (
                <PostForm
                    type="lost-found"
                    onSubmit={handleSubmit}
                    onClose={handleCloseForm}
                    editData={editingItem}
                    isEditing={isEditing}
                />
            )}
        </div>
    );
}
