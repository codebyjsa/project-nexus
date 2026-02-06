'use client';

import { cn } from '@/lib/utils';

export default function Input({
    className = '',
    label = '',
    error = '',
    icon = null,
    textarea = false,
    ...props
}) {
    const InputComponent = textarea ? 'textarea' : 'input';

    return (
        <div className="input-group">
            {icon && (
                <span className="absolute left-4 top-1/2 -translate-y-1/2 text-[var(--text-tertiary)]">
                    {icon}
                </span>
            )}
            <InputComponent
                className={cn(
                    textarea ? 'input textarea' : 'input',
                    icon && 'pl-12',
                    error && 'border-[var(--color-error)] focus:border-[var(--color-error)]',
                    className
                )}
                placeholder={label || ' '}
                {...props}
            />
            {label && (
                <label className="input-label">{label}</label>
            )}
            {error && (
                <span className="text-xs text-[var(--color-error)] mt-1 block px-1">
                    {error}
                </span>
            )}
        </div>
    );
}

export function TextArea(props) {
    return <Input textarea {...props} />;
}
