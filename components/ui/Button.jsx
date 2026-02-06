'use client';

import { cn } from '@/lib/utils';

export default function Button({
    children,
    className = '',
    variant = 'primary',
    size = 'md',
    icon = null,
    iconOnly = false,
    loading = false,
    disabled = false,
    ...props
}) {
    const variants = {
        primary: 'btn-primary',
        secondary: 'btn-secondary',
        ghost: 'btn-ghost',
        danger: 'btn-danger',
        success: 'btn-success',
    };

    const sizes = {
        sm: 'btn-sm',
        md: '',
        lg: 'btn-lg',
        icon: 'btn-icon',
    };

    return (
        <button
            className={cn(
                'btn',
                variants[variant],
                sizes[iconOnly ? 'icon' : size],
                loading && 'opacity-70 cursor-wait',
                disabled && 'opacity-50 cursor-not-allowed',
                className
            )}
            disabled={disabled || loading}
            {...props}
        >
            {loading ? (
                <span className="animate-spin">⏳</span>
            ) : (
                <>
                    {icon && <span>{icon}</span>}
                    {!iconOnly && children}
                </>
            )}
        </button>
    );
}
