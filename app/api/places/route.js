/**
 * Places API Route
 * Full CRUD operations for Explorer's Guide feature
 * Owner: SEHAJ
 */

import { NextResponse } from 'next/server';
import { readData, writeData } from '@/lib/storage';
import { generateId } from '@/lib/utils';

/**
 * GET: Retrieve places with filters
 * Query params: category, vibe, rating, openNow, search, limit, page
 */
export async function GET(request) {
    try {
        const { searchParams } = new URL(request.url);
        const category = searchParams.get('category');
        const vibe = searchParams.get('vibe');
        const minRating = parseFloat(searchParams.get('rating')) || 0;
        const openNow = searchParams.get('openNow') === 'true';
        const search = searchParams.get('search');
        const sortBy = searchParams.get('sortBy') || 'rating'; // rating, distance, reviewCount
        const limit = parseInt(searchParams.get('limit')) || 50;
        const page = parseInt(searchParams.get('page')) || 1;

        const data = readData('places.json');

        if (!data || !data.places) {
            return NextResponse.json({ places: [], total: 0 });
        }

        let places = [...data.places];

        // Filter by category
        if (category && category !== 'all') {
            places = places.filter(place => place.category === category);
        }

        // Filter by vibe
        if (vibe) {
            places = places.filter(place =>
                place.vibes && place.vibes.some(v => v.toLowerCase().includes(vibe.toLowerCase()))
            );
        }

        // Filter by minimum rating
        if (minRating > 0) {
            places = places.filter(place => place.rating >= minRating);
        }

        // Filter by open now
        if (openNow) {
            const now = new Date();
            const day = now.toLocaleDateString('en-US', { weekday: 'lowercase' });
            const currentTime = now.toTimeString().slice(0, 5); // HH:MM format

            places = places.filter(place => {
                if (!place.operatingHours || !place.operatingHours[day]) return false;
                const hours = place.operatingHours[day];
                if (hours.open === '00:00' && hours.close === '23:59') return true; // 24 hours
                return currentTime >= hours.open && currentTime <= hours.close;
            });
        }

        // Search filter
        if (search) {
            const searchLower = search.toLowerCase();
            places = places.filter(place =>
                place.name?.toLowerCase().includes(searchLower) ||
                place.description?.toLowerCase().includes(searchLower) ||
                place.category?.toLowerCase().includes(searchLower) ||
                place.vibes?.some(v => v.toLowerCase().includes(searchLower)) ||
                place.location?.address?.toLowerCase().includes(searchLower)
            );
        }

        // Sort
        switch (sortBy) {
            case 'distance':
                places.sort((a, b) => (a.distance || 999) - (b.distance || 999));
                break;
            case 'reviewCount':
                places.sort((a, b) => (b.reviewCount || 0) - (a.reviewCount || 0));
                break;
            case 'rating':
            default:
                places.sort((a, b) => (b.rating || 0) - (a.rating || 0));
                break;
        }

        // Pagination
        const total = places.length;
        const start = (page - 1) * limit;
        const end = start + limit;
        const paginatedPlaces = places.slice(start, end);

        return NextResponse.json({
            places: paginatedPlaces,
            total,
            page,
            limit,
            totalPages: Math.ceil(total / limit),
        });
    } catch (error) {
        console.error('GET /api/places error:', error);
        return NextResponse.json(
            { error: 'Failed to fetch places' },
            { status: 500 }
        );
    }
}

/**
 * POST: Add a new place
 */
export async function POST(request) {
    try {
        const body = await request.json();
        const { name, category, description, vibes, location, operatingHours, phone, priceRange } = body;

        // Validation
        if (!name || !category || !description) {
            return NextResponse.json(
                { error: 'Name, category, and description are required' },
                { status: 400 }
            );
        }

        const validCategories = ['food', 'cafe', 'nature', 'entertainment', 'shopping', 'spiritual', 'fitness'];
        if (!validCategories.includes(category)) {
            return NextResponse.json(
                { error: `Invalid category. Must be one of: ${validCategories.join(', ')}` },
                { status: 400 }
            );
        }

        // Create new place
        const newPlace = {
            id: generateId(),
            name,
            category,
            description,
            vibes: vibes || [],
            rating: 0,
            reviewCount: 0,
            location: location || { lat: 0, lng: 0, address: '' },
            distance: null,
            operatingHours: operatingHours || {},
            phone: phone || null,
            photos: [],
            studentDiscount: body.studentDiscount || false,
            discountDetails: body.discountDetails || null,
            priceRange: priceRange || '₹₹',
            reviews: [],
            createdAt: new Date().toISOString(),
        };

        // Save to storage
        const data = readData('places.json') || { places: [] };
        data.places.unshift(newPlace);
        writeData('places.json', data);

        return NextResponse.json({
            success: true,
            place: newPlace,
        });
    } catch (error) {
        console.error('POST /api/places error:', error);
        return NextResponse.json(
            { error: 'Failed to add place' },
            { status: 500 }
        );
    }
}

/**
 * PATCH: Update place or add review
 */
export async function PATCH(request) {
    try {
        const body = await request.json();
        const { id, review, ...updates } = body;

        if (!id) {
            return NextResponse.json(
                { error: 'Place ID is required' },
                { status: 400 }
            );
        }

        const data = readData('places.json');
        if (!data || !data.places) {
            return NextResponse.json(
                { error: 'Place not found' },
                { status: 404 }
            );
        }

        const placeIndex = data.places.findIndex(p => p.id === id);
        if (placeIndex === -1) {
            return NextResponse.json(
                { error: 'Place not found' },
                { status: 404 }
            );
        }

        const place = data.places[placeIndex];

        // If adding a review
        if (review) {
            const newReview = {
                id: generateId(),
                userId: review.userId || 'anonymous',
                userName: review.userName || 'Anonymous User',
                rating: Math.min(5, Math.max(1, review.rating || 5)),
                text: review.text || '',
                date: new Date().toISOString(),
            };

            place.reviews = place.reviews || [];
            place.reviews.unshift(newReview);
            place.reviewCount = place.reviews.length;

            // Recalculate average rating
            const totalRating = place.reviews.reduce((sum, r) => sum + r.rating, 0);
            place.rating = Math.round((totalRating / place.reviews.length) * 10) / 10;
        }

        // Apply other updates (excluding protected fields)
        const protectedFields = ['id', 'createdAt', 'reviews', 'reviewCount', 'rating'];
        Object.keys(updates).forEach(key => {
            if (!protectedFields.includes(key)) {
                place[key] = updates[key];
            }
        });

        data.places[placeIndex] = place;
        writeData('places.json', data);

        return NextResponse.json({
            success: true,
            place,
        });
    } catch (error) {
        console.error('PATCH /api/places error:', error);
        return NextResponse.json(
            { error: 'Failed to update place' },
            { status: 500 }
        );
    }
}

/**
 * DELETE: Remove a place
 */
export async function DELETE(request) {
    try {
        const { searchParams } = new URL(request.url);
        const id = searchParams.get('id');

        if (!id) {
            return NextResponse.json(
                { error: 'Place ID is required' },
                { status: 400 }
            );
        }

        const data = readData('places.json');
        if (!data || !data.places) {
            return NextResponse.json(
                { error: 'Place not found' },
                { status: 404 }
            );
        }

        const initialLength = data.places.length;
        data.places = data.places.filter(p => p.id !== id);

        if (data.places.length === initialLength) {
            return NextResponse.json(
                { error: 'Place not found' },
                { status: 404 }
            );
        }

        writeData('places.json', data);

        return NextResponse.json({
            success: true,
            message: 'Place deleted',
        });
    } catch (error) {
        console.error('DELETE /api/places error:', error);
        return NextResponse.json(
            { error: 'Failed to delete place' },
            { status: 500 }
        );
    }
}
