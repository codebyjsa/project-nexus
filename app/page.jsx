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
        stats: 'Smart AI',
        available: true,
    },
    {
        id: 'exchange',
        title: 'Exchange Hub',
        description: 'Lost & Found, Marketplace, Cab Pool',
        icon: '🔄',
        href: '/exchange',
        gradient: 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)',
        stats: 'Coming Soon',
        available: false,
    },
    {
        id: 'explorer',
        title: 'Explorer',
        description: 'Discover nearby places & hangouts',
        icon: '🗺️',
        href: '/explorer',
        gradient: 'linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)',
        stats: 'Coming Soon',
        available: false,
    },
    {
        id: 'academics',
        title: 'Academics',
        description: 'Timetable, Grades & Courses',
        icon: '📚',
        href: '/academics',
        gradient: 'linear-gradient(135deg, #43e97b 0%, #38f9d7 100%)',
        stats: 'Coming Soon',
        available: false,
    },
];

const quickStats = [
    { label: 'Unread', value: '3', icon: '📧', color: 'var(--ios-blue)' },
    { label: 'Next Meal', value: 'Lunch', icon: '🍽️', color: 'var(--ios-orange)' },
    { label: 'Today', value: new Date().toLocaleDateString('en-US', { weekday: 'short', day: 'numeric' }), icon: '📅', color: 'var(--ios-green)' },
];

export default function HomePage() {
    return (
        <div className="container">
            {/* Hero Section */}
            <section className="pt-10 pb-8">
                <div className="text-center mb-8 animate-slideDown">
                    <div className="inline-flex items-center gap-2 px-4 py-2 mb-4 rounded-full bg-[var(--fill-tertiary)]">
                        <span className="animate-pulse">✨</span>
                        <span className="text-sm font-medium text-secondary">Your Campus Companion</span>
                    </div>
                    <h1 className="h1 mb-3">
                        <span className="text-gradient">Project</span> Nexus
                    </h1>
                    <p className="text-lg text-secondary max-w-md mx-auto">
                        Everything you need for campus life, powered by AI
                    </p>
                </div>

                {/* Dynamic Island Style Quick Stats */}
                <div className="flex justify-center gap-3 mb-10 flex-wrap animate-slideUp" style={{ animationDelay: '0.1s' }}>
                    {quickStats.map((stat, idx) => (
                        <div
                            key={idx}
                            className="dynamic-island"
                            style={{ animationDelay: `${0.1 * idx}s` }}
                        >
                            <span className="text-xl">{stat.icon}</span>
                            <div className="flex flex-col">
                                <span className="font-bold text-sm">{stat.value}</span>
                                <span className="text-xs opacity-70">{stat.label}</span>
                            </div>
                        </div>
                    ))}
                </div>
            </section>

            {/* Features Grid */}
            <section className="pb-10">
                <div className="flex items-center justify-between mb-5">
                    <h2 className="h3">Features</h2>
                    <span className="text-sm text-tertiary">4 modules</span>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {features.map((feature, idx) => (
                        <Link
                            key={feature.id}
                            href={feature.href}
                            className="block animate-scaleIn"
                            style={{ animationDelay: `${0.05 * idx}s` }}
                        >
                            <div
                                className="feature-card"
                                style={{ background: feature.gradient }}
                            >
                                <div className="relative z-10">
                                    <div className="text-4xl mb-3 animate-float" style={{ animationDelay: `${0.2 * idx}s` }}>
                                        {feature.icon}
                                    </div>
                                    <h3 className="font-bold text-xl mb-1">{feature.title}</h3>
                                    <p className="text-white/80 text-sm mb-3">{feature.description}</p>
                                    <span className={`inline-flex items-center gap-1 px-3 py-1.5 text-xs font-semibold rounded-full ${feature.available
                                            ? 'bg-white/25 backdrop-blur-sm'
                                            : 'bg-black/20 backdrop-blur-sm'
                                        }`}>
                                        {feature.available && <span className="w-1.5 h-1.5 rounded-full bg-white animate-pulse" />}
                                        {feature.stats}
                                    </span>
                                </div>
                            </div>
                        </Link>
                    ))}
                </div>
            </section>

            {/* Quick Actions */}
            <section className="pb-10">
                <div className="flex items-center justify-between mb-5">
                    <h2 className="h3">Quick Actions</h2>
                </div>
                <Card variant="glass" padding="lg">
                    <div className="flex gap-3 flex-wrap">
                        <Link href="/mail-pulse">
                            <Button variant="primary" icon="✉️" glow>
                                Summarize Email
                            </Button>
                        </Link>
                        <Link href="/mail-pulse">
                            <Button variant="secondary" icon="🍽️">
                                View Menu
                            </Button>
                        </Link>
                        <Button variant="ghost" icon="🔔">
                            Notifications
                        </Button>
                    </div>
                </Card>
            </section>

            {/* Status Card */}
            <section className="pb-10">
                <Card variant="glass-thick" padding="lg" className="text-center">
                    <div className="text-4xl mb-3">🚀</div>
                    <h3 className="h4 mb-2">More Features Coming</h3>
                    <p className="text-secondary text-sm mb-4">
                        Exchange Hub, Explorer, and Academics modules are under development
                    </p>
                    <div className="flex justify-center gap-2">
                        <span className="inline-flex items-center gap-1 text-xs text-tertiary">
                            <span className="w-2 h-2 rounded-full bg-[var(--ios-green)] animate-pulse" />
                            In Progress
                        </span>
                    </div>
                </Card>
            </section>
        </div>
    );
}
