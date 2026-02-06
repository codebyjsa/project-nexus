import './globals.css';
import Navbar from '@/components/ui/Navbar';
import ThemeProvider from '@/components/ui/ThemeProvider';
import ChatBot from '@/components/ui/ChatBot';

export const metadata = {
    title: 'Project Nexus - Campus Hub',
    description: 'Your all-in-one campus companion for college life',
    keywords: ['campus', 'college', 'students', 'mail', 'mess', 'academics'],
    authors: [{ name: 'Project Nexus Team' }],
    viewport: 'width=device-width, initial-scale=1, maximum-scale=1',
};

export default function RootLayout({ children }) {
    return (
        <html lang="en" suppressHydrationWarning>
            <head>
                <link rel="preconnect" href="https://fonts.googleapis.com" />
                <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
                <link
                    href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&display=swap"
                    rel="stylesheet"
                />
            </head>
            <body style={{ fontFamily: 'Inter, var(--font-sans)' }}>
                <ThemeProvider>
                    <main className="page">
                        {children}
                    </main>
                    <ChatBot />
                    <Navbar />
                </ThemeProvider>
            </body>
        </html>
    );
}
