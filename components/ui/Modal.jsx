'use client';

import { useEffect, useCallback } from 'react';
import { cn } from '@/lib/utils';

export default function Modal({
    isOpen = false,
    onClose,
    title = '',
    children,
    footer = null,
    className = '',
    showHandle = true,
}) {
    // Close on escape key
    const handleEscape = useCallback((e) => {
        if (e.key === 'Escape') onClose?.();
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

    // Close on backdrop click
    const handleBackdropClick = (e) => {
        if (e.target === e.currentTarget) onClose?.();
    };

    return (
        <div
            className={cn('modal-overlay', isOpen && 'open')}
            onClick={handleBackdropClick}
            aria-hidden={!isOpen}
        >
            <div className={cn('modal', className)} role="dialog" aria-modal="true">
                {showHandle && <div className="modal-handle" />}

                {title && (
                    <div className="modal-header">
                        <h3 className="modal-title">{title}</h3>
                        <button
                            className="modal-close"
                            onClick={onClose}
                            aria-label="Close modal"
                        >
                            ✕
                        </button>
                    </div>
                )}

                <div className="modal-body">
                    {children}
                </div>

                {footer && (
                    <div className="modal-footer">
                        {footer}
                    </div>
                )}
            </div>
        </div>
    );
}
