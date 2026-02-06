'use client';

import { cn } from '@/lib/utils';
import { forwardRef } from 'react';

const Input = forwardRef(function Input({
    className = '',
    type = 'text',
    variant = 'default',
    icon = null,
    error = '',
    ...props
}, ref) {
    const variants = {
        default: 'input',
        search: 'input input-search',
    };

    return (
        <div className="relative w-full">
            {icon && (
                <span className="absolute left-4 top-1/2 -translate-y-1/2 text-[var(--text-tertiary)] text-lg pointer-events-none">
                    {icon}
                </span>
            )}
            <input
                ref={ref}
                type={type}
                className={cn(
                    variants[variant],
                    icon && 'pl-12',
                    error && 'border-[var(--ios-red)] focus:border-[var(--ios-red)]',
                    className
                )}
                {...props}
            />
            {error && (
                <p className="mt-1 text-sm text-[var(--ios-red)]">{error}</p>
            )}
        </div>
    );
});

export default Input;

export function Textarea({
    className = '',
    error = '',
    ...props
}) {
    return (
        <div className="w-full">
            <textarea
                className={cn(
                    'input textarea',
                    error && 'border-[var(--ios-red)] focus:border-[var(--ios-red)]',
                    className
                )}
                {...props}
            />
            {error && (
                <p className="mt-1 text-sm text-[var(--ios-red)]">{error}</p>
            )}
        </div>
    );
}
