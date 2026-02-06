'use client';

import { cn } from '@/lib/utils';

export default function Badge({
    children,
    className = '',
    variant = 'primary',
    size = 'md',
    dot = false,
    glow = false,
    ...props
}) {
    const variants = {
        primary: 'badge-primary',
        success: 'badge-success',
        warning: 'badge-warning',
        error: 'badge-error',
        info: 'badge-info',
        purple: 'badge-purple',
        indigo: 'badge-indigo',
        // Category variants
        academic: 'category-academic',
        event: 'category-event',
        urgent: 'category-urgent',
        general: 'category-general',
        // Dietary variants
        veg: 'dietary-veg',
        'non-veg': 'dietary-nonveg',
        nonveg: 'dietary-nonveg',
        jain: 'dietary-jain',
    };

    const sizes = {
        sm: 'text-[10px] py-0.5 px-2',
        md: '',
        lg: 'text-sm py-1.5 px-4',
    };

    if (dot) {
        return (
            <span
                className={cn(
                    'inline-block w-2 h-2 rounded-full',
                    variant === 'success' && 'bg-[var(--ios-green)]',
                    variant === 'warning' && 'bg-[var(--ios-orange)]',
                    variant === 'error' && 'bg-[var(--ios-red)]',
                    variant === 'primary' && 'bg-[var(--ios-blue)]',
                    glow && 'animate-pulse',
                    className
                )}
                {...props}
            />
        );
    }

    return (
        <span
            className={cn(
                'badge',
                variants[variant] || variants.primary,
                sizes[size],
                glow && 'shadow-[0_0_8px_currentColor]',
                className
            )}
            {...props}
        >
            {children}
        </span>
    );
}
