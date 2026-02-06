/**
 * Explorer Page - Nearby Hub with Premium iOS 18+ Design
 * Owner: SEHAJ
 */

'use client';

import { useState, useEffect } from 'react';
import FilterBar from '@/components/explorer/FilterBar';
import PlacesList from '@/components/explorer/PlacesList';
import PlaceDetailModal from '@/components/explorer/PlaceDetailModal';
import { debounce } from '@/lib/utils';

export default function ExplorerPage() {
    const [places, setPlaces] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchQuery, setSearchQuery] = useState('');
    const [activeCategory, setActiveCategory] = useState('all');
    const [openNowFilter, setOpenNowFilter] = useState(false);
    const [selectedPlace, setSelectedPlace] = useState(null);
    const [showModal, setShowModal] = useState(false);

    // Fetch places
    const fetchPlaces = async () => {
        setLoading(true);
        try {
            const params = new URLSearchParams();
            if (activeCategory !== 'all') params.set('category', activeCategory);
            if (openNowFilter) params.set('openNow', 'true');
            if (searchQuery) params.set('search', searchQuery);

            const res = await fetch(`/api/places?${params}`);
            const data = await res.json();
            setPlaces(data.places || []);
        } catch (err) {
            console.error('Failed to fetch:', err);
        } finally {
            setLoading(false);
        }
    };

    const debouncedSearch = debounce((q) => setSearchQuery(q), 300);

    useEffect(() => {
        fetchPlaces();
    }, [activeCategory, openNowFilter, searchQuery]);

    const handlePlaceClick = (place) => {
        setSelectedPlace(place);
        setShowModal(true);
    };

    const handleReviewSubmit = async (placeId, reviewData) => {
        try {
            const res = await fetch('/api/places', {
                method: 'PATCH',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ id: placeId, review: reviewData }),
            });
            if (res.ok) {
                const { place } = await res.json();
                setPlaces(prev => prev.map(p => p.id === placeId ? place : p));
                setSelectedPlace(place);
            }
        } catch (err) {
            console.error('Review failed:', err);
        }
    };

    return (
        <div className="container pt-6 pb-32">
            {/* Header */}
            <div className="flex items-center gap-3 mb-6">
                <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-emerald-400 to-teal-500 flex items-center justify-center text-2xl shadow-lg shadow-emerald-500/25">
                    🗺️
                </div>
                <div>
                    <h1 className="text-xl font-bold">Explorer</h1>
                    <p className="text-sm text-[var(--text-tertiary)]">Discover Rupnagar's best spots</p>
                </div>
            </div>

            {/* Search */}
            <div className="relative mb-5">
                <input
                    type="text"
                    placeholder="Search places..."
                    onChange={(e) => debouncedSearch(e.target.value)}
                    className="w-full h-12 pl-12 pr-4 rounded-2xl bg-[var(--fill-tertiary)] border-none text-sm placeholder:text-[var(--text-quaternary)] focus:ring-2 focus:ring-[var(--color-primary)]/30 transition-all"
                />
                <span className="absolute left-4 top-1/2 -translate-y-1/2 text-[var(--text-tertiary)]">🔍</span>
            </div>

            {/* Filters */}
            <div className="mb-5">
                <FilterBar
                    activeCategory={activeCategory}
                    openNowFilter={openNowFilter}
                    onCategoryChange={setActiveCategory}
                    onOpenNowChange={setOpenNowFilter}
                />
            </div>

            {/* Results count */}
            {!loading && (
                <div className="flex justify-between items-center mb-4 text-xs text-[var(--text-tertiary)]">
                    <span>{places.length} places</span>
                    <span>📍 Near IIT Ropar</span>
                </div>
            )}

            {/* Places Grid */}
            <PlacesList
                places={places}
                loading={loading}
                onPlaceClick={handlePlaceClick}
            />

            {/* Detail Modal */}
            <PlaceDetailModal
                place={selectedPlace}
                isOpen={showModal}
                onClose={() => setShowModal(false)}
                onReviewSubmit={handleReviewSubmit}
            />
        </div>
    );
}
