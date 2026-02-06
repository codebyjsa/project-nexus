'use client';

import { useState, useEffect } from 'react';
import MailSummarizer from '@/components/mail-pulse/MailSummarizer';
import MailCard from '@/components/mail-pulse/MailCard';
import MessMenu from '@/components/mail-pulse/MessMenu';
import Tabs, { TabPanel } from '@/components/ui/Tabs';
import Modal from '@/components/ui/Modal';
import Badge from '@/components/ui/Badge';
import { formatDate, getCategoryStyle } from '@/lib/utils';

const mainTabs = [
    { id: 'mails', label: 'Mail Inbox', icon: '📧' },
    { id: 'menu', label: 'Mess Menu', icon: '🍽️' },
];

const categoryFilters = [
    { id: 'all', label: 'All' },
    { id: 'urgent', label: '🚨 Urgent' },
    { id: 'academic', label: '📚 Academic' },
    { id: 'event', label: '🎉 Events' },
    { id: 'general', label: '📧 General' },
];

export default function MailPulsePage() {
    const [activeTab, setActiveTab] = useState('mails');
    const [mails, setMails] = useState([]);
    const [loading, setLoading] = useState(true);
    const [categoryFilter, setCategoryFilter] = useState('all');
    const [selectedMail, setSelectedMail] = useState(null);
    const [showModal, setShowModal] = useState(false);

    useEffect(() => {
        fetchMails();
    }, [categoryFilter]);

    const fetchMails = async () => {
        try {
            const params = new URLSearchParams();
            if (categoryFilter !== 'all') params.set('category', categoryFilter);

            const response = await fetch(`/api/mail?${params}`);
            const data = await response.json();

            if (data.mails) {
                setMails(data.mails);
            }
        } catch (err) {
            console.error('Failed to fetch mails:', err);
        } finally {
            setLoading(false);
        }
    };

    const handleNewMail = (mail) => {
        setMails(prev => [mail, ...prev]);
    };

    const handleMailClick = async (mail) => {
        setSelectedMail(mail);
        setShowModal(true);

        // Mark as read
        if (!mail.isRead) {
            try {
                await fetch('/api/mail', {
                    method: 'PATCH',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ id: mail.id, isRead: true }),
                });

                setMails(prev => prev.map(m =>
                    m.id === mail.id ? { ...m, isRead: true } : m
                ));
            } catch (err) {
                console.error('Failed to mark as read:', err);
            }
        }
    };

    const unreadCount = mails.filter(m => !m.isRead).length;

    return (
        <div className="container pt-lg">
            {/* Header */}
            <div className="mb-lg animate-slideDown">
                <h1 className="h2 flex items-center gap-sm">
                    <span>📬</span>
                    <span>Daily Pulse</span>
                </h1>
                <p className="text-secondary">
                    Stay updated with AI-powered mail summaries and today's menu
                </p>
            </div>

            {/* Main Tabs */}
            <div className="mb-lg animate-fadeIn">
                <Tabs
                    tabs={mainTabs.map(tab => ({
                        ...tab,
                        label: tab.id === 'mails' && unreadCount > 0
                            ? `${tab.label} (${unreadCount})`
                            : tab.label
                    }))}
                    activeTab={activeTab}
                    onTabChange={setActiveTab}
                />
            </div>

            {/* Mails Tab */}
            <TabPanel isActive={activeTab === 'mails'}>
                {/* Mail Summarizer */}
                <div className="animate-slideUp">
                    <MailSummarizer onSummarized={handleNewMail} />
                </div>

                {/* Category Filters */}
                <div className="flex gap-xs mb-lg overflow-x-auto pb-sm animate-fadeIn" style={{ animationDelay: '0.1s' }}>
                    {categoryFilters.map((filter) => (
                        <button
                            key={filter.id}
                            onClick={() => setCategoryFilter(filter.id)}
                            className={`px-4 py-2 text-sm rounded-full whitespace-nowrap transition-all ${categoryFilter === filter.id
                                    ? 'bg-[var(--color-primary-500)] text-white'
                                    : 'bg-[var(--bg-tertiary)] text-tertiary hover:text-secondary'
                                }`}
                        >
                            {filter.label}
                        </button>
                    ))}
                </div>

                {/* Mail List */}
                <div className="flex flex-col gap-md">
                    {loading ? (
                        // Skeleton loading
                        Array.from({ length: 3 }).map((_, idx) => (
                            <div key={idx} className="card p-lg animate-pulse">
                                <div className="skeleton h-6 w-3/4 mb-sm" />
                                <div className="skeleton h-4 w-1/2 mb-md" />
                                <div className="skeleton h-16 w-full" />
                            </div>
                        ))
                    ) : mails.length > 0 ? (
                        mails.map((mail, idx) => (
                            <div
                                key={mail.id}
                                className="animate-slideUp"
                                style={{ animationDelay: `${0.05 * idx}s` }}
                            >
                                <MailCard mail={mail} onClick={handleMailClick} />
                            </div>
                        ))
                    ) : (
                        <div className="text-center py-2xl">
                            <div className="text-5xl mb-md">📭</div>
                            <h3 className="h4 text-secondary mb-sm">No mails yet</h3>
                            <p className="text-tertiary">
                                Paste your first email above to get an AI summary
                            </p>
                        </div>
                    )}
                </div>
            </TabPanel>

            {/* Menu Tab */}
            <TabPanel isActive={activeTab === 'menu'}>
                <div className="animate-slideUp">
                    <MessMenu />
                </div>
            </TabPanel>

            {/* Mail Detail Modal */}
            <Modal
                isOpen={showModal}
                onClose={() => setShowModal(false)}
                title={selectedMail?.subject || 'Email Details'}
            >
                {selectedMail && (
                    <div className="flex flex-col gap-md">
                        {/* Category & Priority */}
                        <div className="flex items-center gap-sm flex-wrap">
                            <Badge variant={selectedMail.category}>
                                {getCategoryStyle(selectedMail.category).label}
                            </Badge>
                            <span className="text-sm text-tertiary">
                                Priority: {'★'.repeat(selectedMail.priority)}{'☆'.repeat(5 - selectedMail.priority)}
                            </span>
                        </div>

                        {/* Summary */}
                        <div>
                            <h4 className="text-sm font-semibold text-tertiary mb-xs">Summary</h4>
                            <p className="text-primary">{selectedMail.summary}</p>
                        </div>

                        {/* Key Points */}
                        {selectedMail.keyPoints?.length > 0 && (
                            <div>
                                <h4 className="text-sm font-semibold text-tertiary mb-xs">Key Points</h4>
                                <ul className="space-y-1">
                                    {selectedMail.keyPoints.map((point, idx) => (
                                        <li key={idx} className="flex items-start gap-sm text-sm">
                                            <span className="text-[var(--color-primary-500)]">•</span>
                                            <span>{point}</span>
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        )}

                        {/* Action Items */}
                        {selectedMail.actionItems?.length > 0 && (
                            <div>
                                <h4 className="text-sm font-semibold text-tertiary mb-xs">Action Items</h4>
                                <ul className="space-y-1">
                                    {selectedMail.actionItems.map((item, idx) => (
                                        <li key={idx} className="flex items-start gap-sm text-sm">
                                            <span>☐</span>
                                            <span>{item}</span>
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        )}

                        {/* Deadlines */}
                        {selectedMail.deadlines?.length > 0 && (
                            <div>
                                <h4 className="text-sm font-semibold text-tertiary mb-xs">Deadlines</h4>
                                <div className="space-y-1">
                                    {selectedMail.deadlines.map((deadline, idx) => (
                                        <div key={idx} className="flex items-center gap-sm text-sm">
                                            <span>📅</span>
                                            <span className="font-medium">{formatDate(deadline.date)}</span>
                                            <span className="text-tertiary">- {deadline.description}</span>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}

                        {/* Original Content */}
                        <details className="mt-md">
                            <summary className="text-sm text-tertiary cursor-pointer hover:text-secondary">
                                View Original Email
                            </summary>
                            <div className="mt-sm p-md bg-[var(--bg-tertiary)] rounded-lg text-sm whitespace-pre-wrap max-h-60 overflow-y-auto">
                                {selectedMail.originalContent}
                            </div>
                        </details>
                    </div>
                )}
            </Modal>
        </div>
    );
}
