'use client';

import { cn } from '@/lib/utils';

export default function Badge({
    children,
    className = '',
    variant = 'primary',
    icon = null,
    size = 'md',
}) {
    const variants = {
        primary: 'badge-primary',
        success: 'badge-success',
        warning: 'badge-warning',
        error: 'badge-error',
        info: 'badge-info',
        academic: 'category-academic',
        event: 'category-event',
        urgent: 'category-urgent',
        general: 'category-general',
        veg: 'dietary-veg',
        'non-veg': 'dietary-nonveg',
        jain: 'dietary-jain',
    };

    const sizes = {
        sm: 'text-xs py-0.5 px-1.5',
        md: '',
        lg: 'text-sm py-1.5 px-3',
    };

    return (
        <span
            className={cn(
                'badge',
                variants[variant],
                sizes[size],
                className
            )}
        >
            {icon && <span>{icon}</span>}
            {children}
        </span>
    );
}
