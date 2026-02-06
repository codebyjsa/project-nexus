'use client';

import Badge from '@/components/ui/Badge';
import { getDietaryBadge } from '@/lib/utils';

export default function MessMenuCard({ item }) {
    const dietaryBadge = getDietaryBadge(item.type);

    const allergenInfo = {
        dairy: { icon: '🥛', label: 'Dairy' },
        gluten: { icon: '🌾', label: 'Gluten' },
        egg: { icon: '🥚', label: 'Egg' },
        fish: { icon: '🐟', label: 'Fish' },
        nuts: { icon: '🥜', label: 'Nuts' },
    };

    // Food icons based on common items
    const getFoodIcon = (name) => {
        const lowerName = name.toLowerCase();
        if (lowerName.includes('rice') || lowerName.includes('biryani')) return '🍚';
        if (lowerName.includes('dal') || lowerName.includes('rajma')) return '🍲';
        if (lowerName.includes('paneer')) return '🧀';
        if (lowerName.includes('chicken')) return '🍗';
        if (lowerName.includes('egg')) return '🥚';
        if (lowerName.includes('fish')) return '🐟';
        if (lowerName.includes('mutton')) return '🍖';
        if (lowerName.includes('roti') || lowerName.includes('chapati') || lowerName.includes('naan') || lowerName.includes('paratha')) return '🫓';
        if (lowerName.includes('salad')) return '🥗';
        if (lowerName.includes('ice cream')) return '🍨';
        if (lowerName.includes('gulab') || lowerName.includes('kheer') || lowerName.includes('custard')) return '🍮';
        if (lowerName.includes('tea') || lowerName.includes('coffee')) return '☕';
        if (lowerName.includes('milk')) return '🥛';
        if (lowerName.includes('samosa') || lowerName.includes('pakora')) return '🥟';
        if (lowerName.includes('fruit') || lowerName.includes('banana') || lowerName.includes('apple')) return '🍎';
        if (lowerName.includes('curd') || lowerName.includes('raita')) return '🥛';
        if (item.type === 'veg') return '🥬';
        return '🍖';
    };

    return (
        <div className="flex items-center justify-between p-md bg-[var(--bg-secondary)] rounded-xl hover:bg-[var(--bg-tertiary)] transition-all hover:scale-[1.01] cursor-default group">
            <div className="flex items-center gap-md flex-1 min-w-0">
                {/* Food Icon */}
                <div className={`w-12 h-12 rounded-xl flex items-center justify-center text-xl flex-shrink-0 transition-transform group-hover:scale-110 ${item.type === 'veg'
                        ? 'bg-[rgba(52,199,89,0.12)]'
                        : 'bg-[rgba(255,59,48,0.12)]'
                    }`}>
                    {getFoodIcon(item.name)}
                </div>

                <div className="flex-1 min-w-0">
                    <p className="font-medium text-primary truncate">{item.name}</p>

                    {/* Allergens */}
                    {item.allergens?.length > 0 && (
                        <div className="flex items-center gap-xs mt-1">
                            <span className="text-xs text-tertiary">Contains:</span>
                            <div className="flex gap-1">
                                {item.allergens.map((allergen, idx) => (
                                    <span
                                        key={idx}
                                        title={allergenInfo[allergen]?.label || allergen}
                                        className="text-sm cursor-help hover:scale-125 transition-transform"
                                    >
                                        {allergenInfo[allergen]?.icon || '⚠️'}
                                    </span>
                                ))}
                            </div>
                        </div>
                    )}

                    {/* Nutritional info placeholder (can be extended with real data) */}
                    {item.calories && (
                        <div className="flex items-center gap-xs mt-1 text-xs text-tertiary">
                            <span>🔥 {item.calories} cal</span>
                        </div>
                    )}
                </div>
            </div>

            <Badge variant={item.type} icon={dietaryBadge.icon} size="sm">
                {dietaryBadge.label}
            </Badge>
        </div>
    );
}
