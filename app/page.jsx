'use client';

import Link from 'next/link';
import Card from '@/components/ui/Card';
import Button from '@/components/ui/Button';

const features = [
    {
        id: 'mail-pulse',
        title: 'Daily Pulse',
        description: 'AI-powered mail summaries & mess menu',
        icon: '📬',
        href: '/mail-pulse',
        gradient: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
        stats: 'Smart summarization',
    },
    {
        id: 'exchange',
        title: 'Exchange Hub',
        description: 'Lost & Found, Marketplace, Cab Pool',
        icon: '🔄',
        href: '/exchange',
        gradient: 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)',
        stats: 'Coming Soon',
    },
    {
        id: 'explorer',
        title: 'Explorer',
        description: 'Discover nearby places & hangouts',
        icon: '🗺️',
        href: '/explorer',
        gradient: 'linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)',
        stats: 'Coming Soon',
    },
    {
        id: 'academics',
        title: 'Academics',
        description: 'Timetable, Grades & Courses',
        icon: '📚',
        href: '/academics',
        gradient: 'linear-gradient(135deg, #43e97b 0%, #38f9d7 100%)',
        stats: 'Coming Soon',
    },
];

const quickStats = [
    { label: 'Unread Mails', value: '3', icon: '📧' },
    { label: 'Next Meal', value: 'Lunch', icon: '🍽️' },
    { label: 'Today', value: new Date().toLocaleDateString('en-US', { weekday: 'short', day: 'numeric' }), icon: '📅' },
];

export default function HomePage() {
    return (
        <div className="container">
            {/* Hero Section */}
            <section className="pt-xl pb-lg">
                <div className="text-center mb-xl">
                    <h1 className="h1 mb-sm animate-slideDown">
                        <span className="text-[var(--color-primary-500)]">Project</span> Nexus
                    </h1>
                    <p className="text-lg text-secondary animate-fadeIn" style={{ animationDelay: '0.1s' }}>
                        Your all-in-one campus companion ✨
                    </p>
                </div>

                {/* Quick Stats */}
                <div className="flex justify-center gap-lg mb-xl flex-wrap animate-slideUp" style={{ animationDelay: '0.2s' }}>
                    {quickStats.map((stat, idx) => (
                        <div
                            key={idx}
                            className="glass-card text-center min-w-[100px]"
                            style={{ animationDelay: `${0.1 * idx}s` }}
                        >
                            <div className="text-2xl mb-xs">{stat.icon}</div>
                            <div className="font-bold text-primary">{stat.value}</div>
                            <div className="text-xs text-tertiary">{stat.label}</div>
                        </div>
                    ))}
                </div>
            </section>

            {/* Features Grid */}
            <section className="pb-2xl">
                <h2 className="h3 mb-lg">Features</h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-lg">
                    {features.map((feature, idx) => (
                        <Link
                            key={feature.id}
                            href={feature.href}
                            className="block animate-scaleIn"
                            style={{ animationDelay: `${0.1 * idx}s` }}
                        >
                            <div
                                className="relative overflow-hidden rounded-2xl p-lg text-white transition-all hover:scale-[1.02] hover:shadow-xl"
                                style={{ background: feature.gradient }}
                            >
                                {/* Glow effect */}
                                <div
                                    className="absolute top-0 right-0 w-32 h-32 rounded-full opacity-30 blur-2xl"
                                    style={{ background: 'white' }}
                                />

                                {/* Content */}
                                <div className="relative z-10">
                                    <div className="text-4xl mb-md">{feature.icon}</div>
                                    <h3 className="font-bold text-xl mb-xs">{feature.title}</h3>
                                    <p className="text-white/80 text-sm mb-md">{feature.description}</p>
                                    <span className="inline-block px-3 py-1 text-xs bg-white/20 rounded-full backdrop-blur-sm">
                                        {feature.stats}
                                    </span>
                                </div>
                            </div>
                        </Link>
                    ))}
                </div>
            </section>

            {/* Quick Actions */}
            <section className="pb-2xl">
                <h2 className="h3 mb-lg">Quick Actions</h2>
                <div className="flex gap-md flex-wrap">
                    <Link href="/mail-pulse">
                        <Button variant="primary" icon="✉️">
                            Summarize Email
                        </Button>
                    </Link>
                    <Link href="/mail-pulse">
                        <Button variant="secondary" icon="🍽️">
                            View Menu
                        </Button>
                    </Link>
                </div>
            </section>
        </div>
    );
}
