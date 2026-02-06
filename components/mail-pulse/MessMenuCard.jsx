'use client';

import Badge from '@/components/ui/Badge';
import { getDietaryBadge } from '@/lib/utils';

export default function MessMenuCard({ item }) {
    const dietaryBadge = getDietaryBadge(item.type);

    const allergenIcons = {
        dairy: '🥛',
        gluten: '🌾',
        egg: '🥚',
        fish: '🐟',
        nuts: '🥜',
    };

    return (
        <div className="flex items-center justify-between p-md bg-[var(--bg-secondary)] rounded-xl hover:bg-[var(--bg-tertiary)] transition-colors">
            <div className="flex items-center gap-md">
                {/* Food Icon based on dietary type */}
                <div className={`w-10 h-10 rounded-full flex items-center justify-center text-lg ${item.type === 'veg'
                        ? 'bg-[rgba(52,199,89,0.15)]'
                        : 'bg-[rgba(255,59,48,0.15)]'
                    }`}>
                    {item.type === 'veg' ? '🥬' : '🍖'}
                </div>

                <div>
                    <p className="font-medium text-primary">{item.name}</p>

                    {/* Allergens */}
                    {item.allergens?.length > 0 && (
                        <div className="flex items-center gap-xs mt-xs">
                            <span className="text-xs text-tertiary">Contains:</span>
                            <div className="flex gap-1">
                                {item.allergens.map((allergen, idx) => (
                                    <span key={idx} title={allergen} className="text-sm">
                                        {allergenIcons[allergen] || '⚠️'}
                                    </span>
                                ))}
                            </div>
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
