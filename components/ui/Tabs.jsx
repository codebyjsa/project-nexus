'use client';

import { cn } from '@/lib/utils';

export default function Tabs({ tabs, activeTab, onTabChange, className = '' }) {
    return (
        <div className={cn('tabs', className)}>
            {tabs.map((tab) => (
                <button
                    key={tab.id}
                    onClick={() => onTabChange(tab.id)}
                    className={cn('tab', activeTab === tab.id && 'active')}
                >
                    {tab.icon && <span>{tab.icon}</span>}
                    <span>{tab.label}</span>
                </button>
            ))}
        </div>
    );
}

export function TabPanel({ children, isActive, className = '' }) {
    if (!isActive) return null;

    return (
        <div className={cn('animate-fadeIn', className)}>
            {children}
        </div>
    );
}
