'use client';

import { useState, useEffect } from 'react';
import ProductCard from './ProductCard';
import PostForm from './PostForm';

export default function MarketplaceTab() {
    const [products, setProducts] = useState([]);
    const [showForm, setShowForm] = useState(false);
    const [loading, setLoading] = useState(true);
    const [editingProduct, setEditingProduct] = useState(null);
    const [isEditing, setIsEditing] = useState(false);

    useEffect(() => {
        fetchProducts();
    }, []);

    const fetchProducts = async () => {
        try {
            const response = await fetch('/api/marketplace');
            const data = await response.json();
            setProducts(data);
        } catch (error) {
            console.error('Failed to fetch products:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleSubmit = async (formData) => {
        if (isEditing && editingProduct) {
            // Update existing product
            const response = await fetch(`/api/marketplace?id=${editingProduct.id}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(formData),
            });

            if (!response.ok) throw new Error('Failed to update product');
        } else {
            // Create new product
            const response = await fetch('/api/marketplace', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(formData),
            });

            if (!response.ok) throw new Error('Failed to create product');
        }

        await fetchProducts();
        setEditingProduct(null);
        setIsEditing(false);
    };

    const handleEdit = (product) => {
        setEditingProduct(product);
        setIsEditing(true);
        setShowForm(true);
    };

    const handleCloseForm = () => {
        setShowForm(false);
        setEditingProduct(null);
        setIsEditing(false);
    };

    const handleDelete = async (id) => {
        const response = await fetch(`/api/marketplace?id=${id}`, {
            method: 'DELETE',
        });

        if (!response.ok) throw new Error('Failed to delete product');

        await fetchProducts();
    };

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                <div>
                    <h2 className="text-2xl font-bold text-gray-900">Buy / Sell Marketplace</h2>
                    <p className="text-sm text-gray-600 mt-1">
                        Trade items within the student community
                    </p>
                </div>
                <button
                    onClick={() => setShowForm(true)}
                    className="px-6 py-3 bg-blue-600 text-white rounded-xl font-medium hover:bg-blue-700 transition-colors shadow-lg hover:shadow-xl"
                >
                    + List Product
                </button>
            </div>

            {/* Products Grid */}
            {loading ? (
                <div className="text-center py-12 text-gray-500">Loading...</div>
            ) : products.length === 0 ? (
                <div className="text-center py-12 bg-white/50 rounded-2xl">
                    <p className="text-gray-500">No products listed yet</p>
                    <p className="text-sm text-gray-400 mt-1">Be the first to sell something!</p>
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
                    {products.map((product) => (
                        <ProductCard key={product.id} product={product} onDelete={handleDelete} onEdit={handleEdit} />
                    ))}
                </div>
            )}

            {/* Form Modal */}
            {showForm && (
                <PostForm
                    type="marketplace"
                    onSubmit={handleSubmit}
                    onClose={handleCloseForm}
                    editData={editingProduct}
                    isEditing={isEditing}
                />
            )}
        </div>
    );
}
