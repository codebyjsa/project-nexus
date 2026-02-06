'use client';

import { useState } from 'react';
import LostFoundTab from '@/components/exchange/LostFoundTab';
import MarketplaceTab from '@/components/exchange/MarketplaceTab';
import CabPoolTab from '@/components/exchange/CabPoolTab';

export default function ExchangePage() {
    const [activeTab, setActiveTab] = useState('lost-found');

    const tabs = [
        { id: 'lost-found', label: 'Lost & Found', icon: '🔍' },
        { id: 'marketplace', label: 'Buy / Sell', icon: '🛒' },
        { id: 'cabpool', label: 'Cab Pool', icon: '🚗' },
    ];

    return (
        <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50">
            {/* Header */}
            <div className="bg-white/80 backdrop-blur-md border-b border-gray-200 sticky top-0 z-40">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
                    <div className="text-center">
                        <h1 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-2">
                            Student Exchange Hub
                        </h1>
                        <p className="text-gray-600 text-sm sm:text-base">
                            Connect, share, and trade within your campus community
                        </p>
                    </div>

                    {/* Tab Navigation */}
                    <div className="flex justify-center gap-2 mt-6 overflow-x-auto pb-2">
                        {tabs.map((tab) => (
                            <button
                                key={tab.id}
                                onClick={() => setActiveTab(tab.id)}
                                className={`flex items-center gap-2 px-5 py-3 rounded-xl font-medium transition-all whitespace-nowrap ${activeTab === tab.id
                                        ? 'bg-blue-600 text-white shadow-lg scale-105'
                                        : 'bg-white text-gray-700 hover:bg-gray-100 shadow'
                                    }`}
                            >
                                <span className="text-lg">{tab.icon}</span>
                                <span>{tab.label}</span>
                            </button>
                        ))}
                    </div>
                </div>
            </div>

            {/* Tab Content */}
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                <div className="animate-fadeIn">
                    {activeTab === 'lost-found' && <LostFoundTab />}
                    {activeTab === 'marketplace' && <MarketplaceTab />}
                    {activeTab === 'cabpool' && <CabPoolTab />}
                </div>
            </div>
        </div>
    );
}
