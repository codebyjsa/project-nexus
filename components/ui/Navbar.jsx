'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useTheme } from './ThemeProvider';

const navItems = [
    { href: '/', label: 'Home', icon: '🏠', iconActive: '🏡' },
    { href: '/mail-pulse', label: 'Pulse', icon: '📬', iconActive: '📭' },
    { href: '/exchange', label: 'Exchange', icon: '🔄', iconActive: '♻️' },
    { href: '/explorer', label: 'Explore', icon: '🗺️', iconActive: '🧭' },
    { href: '/academics', label: 'Study', icon: '📚', iconActive: '📖' },
];

export default function Navbar() {
    const pathname = usePathname();
    const { theme, toggleTheme } = useTheme();

    return (
        <nav className="navbar">
            {navItems.map((item) => {
                const isActive = pathname === item.href;
                return (
                    <Link
                        key={item.href}
                        href={item.href}
                        className={`nav-item ${isActive ? 'active' : ''}`}
                    >
                        <span className="nav-item-icon">
                            {isActive ? item.iconActive : item.icon}
                        </span>
                        <span>{item.label}</span>
                    </Link>
                );
            })}
            <button
                onClick={toggleTheme}
                className="theme-toggle"
                aria-label="Toggle theme"
            >
                {theme === 'light' ? '🌙' : '☀️'}
            </button>
        </nav>
    );
}
