'use client';

import { useState } from 'react';

export default function ProductCard({ product, onDelete, onEdit }) {
    const [isDeleting, setIsDeleting] = useState(false);

    const handleDelete = async () => {
        if (!confirm('Are you sure you want to delete this product?')) return;

        setIsDeleting(true);
        try {
            await onDelete(product.id);
        } catch (error) {
            console.error('Failed to delete:', error);
            setIsDeleting(false);
        }
    };

    const conditionColors = {
        new: 'bg-blue-100 text-blue-700',
        good: 'bg-green-100 text-green-700',
        used: 'bg-yellow-100 text-yellow-700',
    };

    return (
        <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-5 shadow-lg hover:shadow-xl transition-all duration-300 border border-gray-100 hover:scale-[1.02]">
            {/* Header with Condition Badge */}
            <div className="flex items-start justify-between mb-3">
                <span className={`px-3 py-1 rounded-full text-xs font-semibold ${conditionColors[product.condition]}`}>
                    {product.condition.charAt(0).toUpperCase() + product.condition.slice(1)}
                </span>
                <div className="flex gap-2">
                    <button
                        onClick={() => onEdit(product)}
                        className="text-gray-400 hover:text-blue-500 transition-colors"
                        title="Edit product"
                    >
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                        </svg>
                    </button>
                    <button
                        onClick={handleDelete}
                        disabled={isDeleting}
                        className="text-gray-400 hover:text-red-500 transition-colors disabled:opacity-50"
                        title="Delete product"
                    >
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                        </svg>
                    </button>
                </div>
            </div>

            {/* Title */}
            <h3 className="text-lg font-semibold text-gray-900 mb-2">{product.title}</h3>

            {/* Price - Prominent */}
            <div className="text-2xl font-bold text-gray-900 mb-3">
                ₹{product.price.toLocaleString()}
            </div>

            {/* Description */}
            <p className="text-sm text-gray-600 mb-3 line-clamp-2">{product.description}</p>

            {/* Meta Info */}
            <div className="space-y-1.5 text-xs text-gray-500">
                <div className="flex items-center gap-2">
                    <span className="font-medium">Category:</span>
                    <span className="px-2 py-0.5 bg-gray-100 rounded-md">{product.category}</span>
                </div>
                <div className="flex items-center gap-2">
                    <span className="font-medium">Seller:</span>
                    <span>{product.userName}</span>
                </div>
                <div className="text-gray-400 mt-2">
                    {new Date(product.createdAt).toLocaleDateString('en-US', {
                        month: 'short',
                        day: 'numeric',
                        year: 'numeric',
                    })}
                </div>
            </div>
        </div>
    );
}
