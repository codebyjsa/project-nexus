'use client';

import { cn } from '@/lib/utils';

export default function Card({
    children,
    className = '',
    variant = 'default',
    hover = true,
    padding = 'lg',
    ...props
}) {
    const variants = {
        default: 'card',
        glass: 'glass-card',
        outlined: 'card border border-[var(--border-color)] shadow-none',
    };

    const paddings = {
        none: '',
        sm: 'p-sm',
        md: 'p-md',
        lg: 'p-lg',
        xl: 'p-xl',
    };

    return (
        <div
            className={cn(
                variants[variant],
                paddings[padding],
                !hover && 'hover:transform-none hover:shadow-none',
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
        <div className={cn('card-header', className)} {...props}>
            {children}
        </div>
    );
}

export function CardBody({ children, className = '', ...props }) {
    return (
        <div className={cn('card-body', className)} {...props}>
            {children}
        </div>
    );
}

export function CardFooter({ children, className = '', ...props }) {
    return (
        <div className={cn('card-footer', className)} {...props}>
            {children}
        </div>
    );
}
