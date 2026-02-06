'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';

const navItems = [
    { href: '/', label: 'Home', icon: '🏠' },
    { href: '/mail-pulse', label: 'Pulse', icon: '📬' },
    { href: '/exchange', label: 'Exchange', icon: '🔄' },
    { href: '/explorer', label: 'Explore', icon: '🗺️' },
    { href: '/academics', label: 'Academics', icon: '📚' },
];

export default function Navbar() {
    const pathname = usePathname();

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
                        <span className="nav-item-icon">{item.icon}</span>
                        <span>{item.label}</span>
                    </Link>
                );
            })}
        </nav>
    );
}
