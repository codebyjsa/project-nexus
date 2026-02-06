'use client';

import { cn } from '@/lib/utils';

export default function Card({
    children,
    className = '',
    variant = 'default',
    hover = true,
    padding = 'lg',
    glow = false,
    ...props
}) {
    const variants = {
        default: 'card',
        glass: 'glass-card',
        'glass-thin': 'glass-thin rounded-xl',
        'glass-thick': 'glass-thick rounded-xl',
        'glass-ultra': 'glass-ultra rounded-xl',
        outlined: 'bg-transparent border border-[var(--glass-border)] rounded-xl',
        inset: 'card-inset',
        grouped: 'card-grouped',
    };

    const paddings = {
        none: '',
        sm: 'p-3',
        md: 'p-4',
        lg: 'p-5',
        xl: 'p-6',
    };

    return (
        <div
            className={cn(
                variants[variant],
                paddings[padding],
                !hover && 'hover:transform-none hover:shadow-none',
                glow && 'animate-glow',
                'animate-fadeIn',
                className
            )}
            {...props}
        >
            {children}
        </div>
    );
}

export function CardHeader({ children, className = '', ...props }) {
    return (
        <div className={cn('p-5 border-b border-[var(--divider)]', className)} {...props}>
            {children}
        </div>
    );
}

export function CardBody({ children, className = '', ...props }) {
    return (
        <div className={cn('p-5', className)} {...props}>
            {children}
        </div>
    );
}

export function CardFooter({ children, className = '', ...props }) {
    return (
        <div className={cn('p-4 bg-[var(--bg-tertiary)] border-t border-[var(--divider)]', className)} {...props}>
            {children}
        </div>
    );
}
