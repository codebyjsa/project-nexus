/**
 * Exchange Hub Page - Placeholder
 * Owner: MANMOHAN
 * Features: Lost & Found, Marketplace, Cab Pool
 */

'use client';

import Tabs, { TabPanel } from '@/components/ui/Tabs';
import Card from '@/components/ui/Card';

export default function ExchangePage() {
    return (
        <div className="container pt-lg">
            <div className="mb-lg">
                <h1 className="h2 flex items-center gap-sm">
                    <span>🔄</span>
                    <span>Exchange Hub</span>
                </h1>
                <p className="text-secondary">
                    Lost & Found, Marketplace, and Cab Pool
                </p>
            </div>

            <Card variant="glass" className="text-center py-2xl">
                <div className="text-5xl mb-md">🚧</div>
                <h3 className="h3 mb-sm">Coming Soon</h3>
                <p className="text-tertiary mb-md">
                    This section is being built by <strong>Manmohan</strong>
                </p>
                <div className="flex justify-center gap-md flex-wrap">
                    <span className="badge badge-info">📦 Lost & Found</span>
                    <span className="badge badge-warning">🛒 Marketplace</span>
                    <span className="badge badge-success">🚕 Cab Pool</span>
                </div>
            </Card>
        </div>
    );
}
