'use client';

import { useEffect, useCallback } from 'react';
import { cn } from '@/lib/utils';

export default function Modal({
    isOpen,
    onClose,
    title,
    children,
    className = '',
    size = 'md',
    showHandle = true,
}) {
    const sizes = {
        sm: 'max-w-sm',
        md: 'max-w-lg',
        lg: 'max-w-2xl',
        xl: 'max-w-4xl',
        full: 'max-w-full mx-4',
    };

    const handleEscape = useCallback((e) => {
        if (e.key === 'Escape') onClose();
    }, [onClose]);

    useEffect(() => {
        if (isOpen) {
            document.addEventListener('keydown', handleEscape);
            document.body.style.overflow = 'hidden';
        }
        return () => {
            document.removeEventListener('keydown', handleEscape);
            document.body.style.overflow = '';
        };
    }, [isOpen, handleEscape]);

    return (
        <div
            className={cn('modal-overlay', isOpen && 'open')}
            onClick={(e) => e.target === e.currentTarget && onClose()}
        >
            <div className={cn('modal', sizes[size], className)}>
                {showHandle && <div className="modal-handle" />}

                {title && (
                    <div className="modal-header">
                        <h3 className="modal-title">{title}</h3>
                        <button
                            onClick={onClose}
                            className="modal-close"
                            aria-label="Close modal"
                        >
                            ✕
                        </button>
                    </div>
                )}

                <div className="modal-body">
                    {children}
                </div>
            </div>
        </div>
    );
}
