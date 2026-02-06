/**
 * PlaceDetailModal Component - Premium iOS 18+ place details
 * Owner: SEHAJ
 */

'use client';

import { useState } from 'react';
import Modal from '@/components/ui/Modal';
import ReviewCard from './ReviewCard';
import AddReviewForm from './AddReviewForm';
import { cn, getVibeStyle, getExploreCategoryStyle, getOpenStatus, formatDistance } from '@/lib/utils';

const DAYS = ['sunday', 'monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday'];

export default function PlaceDetailModal({ place, isOpen, onClose, onReviewSubmit }) {
    const [showReviewForm, setShowReviewForm] = useState(false);

    if (!place) return null;

    const categoryStyle = getExploreCategoryStyle(place.category);
    const openStatus = getOpenStatus(place.operatingHours);
    const distanceInfo = formatDistance(place.distance);
    const todayIndex = new Date().getDay();

    const handleReviewSubmit = async (reviewData) => {
        await onReviewSubmit?.(place.id, reviewData);
        setShowReviewForm(false);
    };

    return (
        <Modal isOpen={isOpen} onClose={onClose} title={place.name} size="lg">
            <div className="space-y-5">
                {/* Hero Banner */}
                <div className="relative h-40 -mx-5 -mt-5 overflow-hidden">
                    <div className={cn(
                        'absolute inset-0 bg-gradient-to-br',
                        place.category === 'food' && 'from-orange-500/80 to-red-600/80',
                        place.category === 'cafe' && 'from-amber-500/80 to-orange-600/80',
                        place.category === 'nature' && 'from-emerald-500/80 to-green-600/80',
                        place.category === 'entertainment' && 'from-purple-500/80 to-pink-600/80',
                        place.category === 'shopping' && 'from-blue-500/80 to-indigo-600/80',
                        place.category === 'spiritual' && 'from-amber-400/80 to-orange-500/80',
                        place.category === 'fitness' && 'from-rose-500/80 to-red-600/80',
                    )} />
                    <div className="absolute inset-0 flex items-center justify-center">
                        <span className="text-7xl filter drop-shadow-lg">{categoryStyle.icon}</span>
                    </div>

                    {/* Status pill */}
                    <div className={cn(
                        'absolute top-3 right-3 px-3 py-1.5 rounded-full text-xs font-bold backdrop-blur-xl',
                        openStatus.isOpen
                            ? 'bg-emerald-500/90 text-white'
                            : 'bg-black/30 text-white/80'
                    )}>
                        {openStatus.isOpen ? '● Open' : '○ Closed'}
                    </div>

                    {/* Student badge */}
                    {place.studentDiscount && (
                        <div className="absolute bottom-3 left-3 px-3 py-1.5 rounded-full text-xs font-bold bg-emerald-500 text-white shadow-lg">
                            🎓 Student Discount
                        </div>
                    )}
                </div>

                {/* Quick Stats Row */}
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                        <div className="flex items-center gap-1.5">
                            <span className="text-amber-400 text-lg">★</span>
                            <span className="font-bold">{place.rating?.toFixed(1) || '—'}</span>
                            <span className="text-xs text-[var(--text-tertiary)]">({place.reviewCount})</span>
                        </div>
                        <span className="text-[var(--text-secondary)] font-medium">{place.priceRange}</span>
                    </div>
                    <span className="text-sm text-[var(--text-tertiary)]">{distanceInfo.text}</span>
                </div>

                {/* Description */}
                <p className="text-[var(--text-secondary)] leading-relaxed">{place.description}</p>

                {/* Vibes */}
                {place.vibes?.length > 0 && (
                    <div className="flex flex-wrap gap-2">
                        {place.vibes.map((vibe) => {
                            const style = getVibeStyle(vibe);
                            return (
                                <span key={vibe} className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-medium bg-[var(--fill-tertiary)] text-[var(--text-secondary)]">
                                    {style.icon} {style.label}
                                </span>
                            );
                        })}
                    </div>
                )}

                {/* Info Grid */}
                <div className="grid grid-cols-2 gap-3">
                    <div className="rounded-xl bg-[var(--fill-tertiary)] p-3">
                        <div className="text-xs text-[var(--text-tertiary)] mb-1">📍 Distance</div>
                        <div className="font-semibold">{distanceInfo.text}</div>
                        <div className="text-xs text-[var(--text-tertiary)]">{distanceInfo.walkTime}</div>
                    </div>
                    <div className="rounded-xl bg-[var(--fill-tertiary)] p-3">
                        <div className="text-xs text-[var(--text-tertiary)] mb-1">📞 Contact</div>
                        {place.phone ? (
                            <a href={`tel:${place.phone}`} className="font-semibold text-[var(--color-primary)]">{place.phone}</a>
                        ) : (
                            <span className="text-[var(--text-tertiary)]">Not available</span>
                        )}
                    </div>
                </div>

                {/* Hours - Simple inline */}
                {place.operatingHours && (
                    <div className="rounded-xl bg-[var(--fill-tertiary)] p-3">
                        <div className="text-xs text-[var(--text-tertiary)] mb-2">🕐 Today's Hours</div>
                        <div className="font-semibold">
                            {place.operatingHours[DAYS[todayIndex]]
                                ? `${place.operatingHours[DAYS[todayIndex]].open} - ${place.operatingHours[DAYS[todayIndex]].close}`
                                : 'Closed today'
                            }
                        </div>
                    </div>
                )}

                {/* Reviews */}
                <div>
                    <div className="flex items-center justify-between mb-3">
                        <span className="text-xs font-semibold text-[var(--text-tertiary)] uppercase tracking-wide">
                            Reviews ({place.reviews?.length || 0})
                        </span>
                        <button
                            onClick={() => setShowReviewForm(!showReviewForm)}
                            className="text-xs font-semibold text-[var(--color-primary)]"
                        >
                            {showReviewForm ? 'Cancel' : '+ Add'}
                        </button>
                    </div>

                    {showReviewForm && (
                        <div className="mb-4 animate-fadeIn">
                            <AddReviewForm onSubmit={handleReviewSubmit} />
                        </div>
                    )}

                    <div className="space-y-2">
                        {place.reviews?.length > 0 ? (
                            place.reviews.slice(0, 3).map((review) => (
                                <ReviewCard key={review.id} review={review} />
                            ))
                        ) : (
                            <div className="text-center py-6 text-[var(--text-tertiary)] text-sm">
                                No reviews yet
                            </div>
                        )}
                    </div>
                </div>

                {/* Actions */}
                <div className="flex gap-3 pt-3 border-t border-[var(--divider)]">
                    {place.phone && (
                        <a href={`tel:${place.phone}`} className="btn btn-secondary flex-1">
                            📞 Call
                        </a>
                    )}
                    <a
                        href={`https://maps.google.com/?q=${place.location?.lat},${place.location?.lng}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="btn btn-primary flex-1"
                    >
                        🗺️ Directions
                    </a>
                </div>
            </div>
        </Modal>
    );
}
