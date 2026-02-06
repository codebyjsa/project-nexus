'use client';

import { useState, useEffect } from 'react';
import Card from '@/components/ui/Card';
import MessMenuCard from './MessMenuCard';
import { cn, getCurrentMeal, formatDate } from '@/lib/utils';

const mealTabs = [
    { id: 'breakfast', label: 'Breakfast', icon: '🌅', time: '07:30 - 09:30' },
    { id: 'lunch', label: 'Lunch', icon: '☀️', time: '12:30 - 14:30' },
    { id: 'snacks', label: 'Snacks', icon: '🍵', time: '17:00 - 18:00' },
    { id: 'dinner', label: 'Dinner', icon: '🌙', time: '19:30 - 21:30' },
];

const dietaryFilters = [
    { id: 'all', label: 'All', icon: '🍽️' },
    { id: 'veg', label: 'Veg', icon: '🥬' },
    { id: 'non-veg', label: 'Non-Veg', icon: '🍖' },
];

export default function MessMenu() {
    const [menu, setMenu] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [activeMeal, setActiveMeal] = useState(getCurrentMeal());
    const [dietaryFilter, setDietaryFilter] = useState('all');

    useEffect(() => {
        fetchMenu();
    }, []);

    const fetchMenu = async () => {
        try {
            const response = await fetch('/api/mess');
            const data = await response.json();

            if (data.menu) {
                setMenu(data.menu);
                if (data.currentMeal) {
                    setActiveMeal(data.currentMeal);
                }
            }
        } catch (err) {
            console.error('Failed to fetch menu:', err);
            setError('Failed to load menu');
        } finally {
            setLoading(false);
        }
    };

    const getCurrentMealData = () => {
        if (!menu?.meals?.[activeMeal]) return null;

        const mealData = menu.meals[activeMeal];
        let items = mealData.items || [];

        // Apply dietary filter
        if (dietaryFilter !== 'all') {
            items = items.filter(item => item.type === dietaryFilter);
        }

        return { ...mealData, items };
    };

    const mealData = getCurrentMealData();
    const currentTab = mealTabs.find(tab => tab.id === activeMeal);

    // Estimate crowd level based on current time
    const getCrowdLevel = () => {
        const hour = new Date().getHours();
        const minute = new Date().getMinutes();

        // Peak hours for each meal
        const peakHours = {
            breakfast: { start: 8, end: 9 },
            lunch: { start: 13, end: 14 },
            snacks: { start: 17, end: 17.5 },
            dinner: { start: 20, end: 21 },
        };

        const peak = peakHours[activeMeal];
        if (!peak) return 'low';

        const currentTime = hour + minute / 60;
        if (currentTime >= peak.start && currentTime <= peak.end) {
            return 'high';
        } else if (currentTime >= peak.start - 0.5 && currentTime <= peak.end + 0.5) {
            return 'medium';
        }
        return 'low';
    };

    const crowdLevel = getCrowdLevel();
    const crowdConfig = {
        low: { label: 'Low Crowd', color: 'var(--color-success)', icon: '🟢' },
        medium: { label: 'Moderate', color: 'var(--color-warning)', icon: '🟡' },
        high: { label: 'Busy', color: 'var(--color-error)', icon: '🔴' },
    };

    if (loading) {
        return (
            <Card variant="glass" className="animate-pulse">
                <div className="flex items-center justify-between mb-md">
                    <div className="skeleton h-8 w-40" />
                    <div className="skeleton h-6 w-24 rounded-full" />
                </div>
                <div className="skeleton h-12 w-full mb-lg rounded-lg" />
                <div className="space-y-3">
                    {[1, 2, 3, 4].map(i => (
                        <div key={i} className="skeleton h-16 w-full rounded-xl" />
                    ))}
                </div>
            </Card>
        );
    }

    if (error) {
        return (
            <Card variant="glass">
                <div className="text-center py-xl">
                    <div className="text-5xl mb-md">😔</div>
                    <h3 className="h4 text-secondary mb-sm">Oops!</h3>
                    <p className="text-tertiary">{error}</p>
                    <button onClick={fetchMenu} className="btn btn-primary mt-lg">
                        Try Again
                    </button>
                </div>
            </Card>
        );
    }

    if (!menu) {
        return (
            <Card variant="glass">
                <div className="text-center py-xl">
                    <div className="text-5xl mb-md">🍽️</div>
                    <h3 className="h4 text-secondary mb-sm">No Menu Available</h3>
                    <p className="text-tertiary">The mess menu hasn't been uploaded yet.</p>
                </div>
            </Card>
        );
    }

    return (
        <Card variant="glass">
            {/* Header */}
            <div className="flex items-center justify-between mb-md">
                <div>
                    <h3 className="h4 flex items-center gap-sm">
                        <span>🍽️</span>
                        <span>Today's Menu</span>
                    </h3>
                    <p className="text-sm text-tertiary">
                        {menu.day}, {formatDate(menu.date)}
                    </p>
                </div>
                <div className="flex items-center gap-xs text-sm"
                    style={{ color: crowdConfig[crowdLevel].color }}>
                    <span>{crowdConfig[crowdLevel].icon}</span>
                    <span>{crowdConfig[crowdLevel].label}</span>
                </div>
            </div>

            {/* Meal Tabs */}
            <div className="flex gap-xs p-xs bg-[var(--bg-tertiary)] rounded-lg mb-lg overflow-x-auto">
                {mealTabs.map((tab) => (
                    <button
                        key={tab.id}
                        onClick={() => setActiveMeal(tab.id)}
                        className={cn(
                            'flex-1 flex flex-col items-center gap-1 py-2 px-3 rounded-md transition-all min-w-[80px]',
                            activeMeal === tab.id
                                ? 'bg-[var(--bg-secondary)] shadow-sm'
                                : 'text-tertiary hover:text-secondary'
                        )}
                    >
                        <span className="text-lg">{tab.icon}</span>
                        <span className="text-xs font-medium">{tab.label}</span>
                    </button>
                ))}
            </div>

            {/* Meal Time & Dietary Filter */}
            <div className="flex items-center justify-between mb-md flex-wrap gap-sm">
                <div className="flex items-center gap-sm text-sm text-tertiary">
                    <span>⏰</span>
                    <span>{currentTab?.time || mealData?.time}</span>
                </div>

                {/* Dietary Filter */}
                <div className="flex gap-xs">
                    {dietaryFilters.map((filter) => (
                        <button
                            key={filter.id}
                            onClick={() => setDietaryFilter(filter.id)}
                            className={cn(
                                'px-3 py-1 text-xs rounded-full transition-all flex items-center gap-1',
                                dietaryFilter === filter.id
                                    ? 'bg-[var(--color-primary-500)] text-white'
                                    : 'bg-[var(--bg-tertiary)] text-tertiary hover:text-secondary'
                            )}
                        >
                            <span>{filter.icon}</span>
                            <span>{filter.label}</span>
                        </button>
                    ))}
                </div>
            </div>

            {/* Menu Items */}
            <div className="flex flex-col gap-sm">
                {mealData?.items?.length > 0 ? (
                    mealData.items.map((item, idx) => (
                        <div
                            key={idx}
                            className="animate-fadeIn"
                            style={{ animationDelay: `${0.05 * idx}s` }}
                        >
                            <MessMenuCard item={item} />
                        </div>
                    ))
                ) : (
                    <div className="text-center py-lg">
                        <div className="text-4xl mb-sm">
                            {dietaryFilter === 'non-veg' ? '🥬' : '🍖'}
                        </div>
                        <p className="text-tertiary text-sm">
                            {dietaryFilter === 'all'
                                ? 'No items available for this meal'
                                : `No ${dietaryFilter} items available`}
                        </p>
                    </div>
                )}
            </div>

            {/* Allergen Legend */}
            {mealData?.items?.length > 0 && (
                <div className="mt-lg pt-md border-t border-[var(--border-color)]">
                    <p className="text-xs text-tertiary mb-sm font-medium">Allergen Guide:</p>
                    <div className="flex flex-wrap gap-sm text-xs text-tertiary">
                        <span>🥛 Dairy</span>
                        <span>🌾 Gluten</span>
                        <span>🥚 Egg</span>
                        <span>🐟 Fish</span>
                        <span>🥜 Nuts</span>
                    </div>
                </div>
            )}
        </Card>
    );
}
