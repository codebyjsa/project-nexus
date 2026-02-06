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
    { id: 'all', label: 'All', icon: '📋' },
    { id: 'urgent', label: 'Urgent', icon: '🚨' },
    { id: 'academic', label: 'Academic', icon: '📚' },
    { id: 'event', label: 'Events', icon: '🎉' },
    { id: 'general', label: 'General', icon: '📧' },
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
        <div className="container pt-6">
            {/* Header */}
            <div className="mb-6 animate-slideDown">
                <div className="flex items-center gap-3 mb-2">
                    <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-[var(--ios-blue)] to-[var(--ios-purple)] flex items-center justify-center text-2xl">
                        📬
                    </div>
                    <div>
                        <h1 className="h3">Daily Pulse</h1>
                        <p className="text-sm text-tertiary">AI-powered insights</p>
                    </div>
                </div>
            </div>

            {/* Main Tabs */}
            <div className="mb-5 animate-fadeIn">
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
                <div className="animate-slideUp mb-5">
                    <MailSummarizer onSummarized={handleNewMail} />
                </div>

                {/* Category Filters */}
                <div className="flex gap-2 mb-5 overflow-x-auto pb-2 scrollbar-hide animate-fadeIn" style={{ animationDelay: '0.1s' }}>
                    {categoryFilters.map((filter) => (
                        <button
                            key={filter.id}
                            onClick={() => setCategoryFilter(filter.id)}
                            className={`inline-flex items-center gap-2 px-4 py-2 text-sm font-medium rounded-full whitespace-nowrap transition-all ${categoryFilter === filter.id
                                    ? 'bg-[var(--color-primary)] text-white shadow-lg shadow-[var(--color-primary)]/30'
                                    : 'bg-[var(--fill-tertiary)] text-secondary hover:bg-[var(--fill-secondary)]'
                                }`}
                        >
                            <span>{filter.icon}</span>
                            <span>{filter.label}</span>
                        </button>
                    ))}
                </div>

                {/* Mail List */}
                <div className="flex flex-col gap-3">
                    {loading ? (
                        Array.from({ length: 3 }).map((_, idx) => (
                            <div key={idx} className="glass-card animate-pulse">
                                <div className="skeleton h-5 w-3/4 mb-2" />
                                <div className="skeleton h-4 w-1/2 mb-3" />
                                <div className="skeleton h-14 w-full" />
                            </div>
                        ))
                    ) : mails.length > 0 ? (
                        mails.map((mail, idx) => (
                            <div
                                key={mail.id}
                                className="animate-slideUp"
                                style={{ animationDelay: `${0.03 * idx}s` }}
                            >
                                <MailCard mail={mail} onClick={handleMailClick} />
                            </div>
                        ))
                    ) : (
                        <div className="glass-card text-center py-12">
                            <div className="text-5xl mb-4 animate-float">📭</div>
                            <h3 className="h4 mb-2">No mails yet</h3>
                            <p className="text-tertiary text-sm">
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
                size="lg"
            >
                {selectedMail && (
                    <div className="flex flex-col gap-4">
                        {/* Category & Priority */}
                        <div className="flex items-center gap-2 flex-wrap">
                            <Badge variant={selectedMail.category}>
                                {getCategoryStyle(selectedMail.category).label}
                            </Badge>
                            <span className="text-sm text-tertiary">
                                Priority: {'★'.repeat(selectedMail.priority)}{'☆'.repeat(5 - selectedMail.priority)}
                            </span>
                        </div>

                        {/* Summary */}
                        <div className="card-inset">
                            <h4 className="text-xs font-semibold text-tertiary mb-1 uppercase tracking-wide">Summary</h4>
                            <p className="text-primary">{selectedMail.summary}</p>
                        </div>

                        {/* Key Points */}
                        {selectedMail.keyPoints?.length > 0 && (
                            <div>
                                <h4 className="text-xs font-semibold text-tertiary mb-2 uppercase tracking-wide">Key Points</h4>
                                <ul className="space-y-2">
                                    {selectedMail.keyPoints.map((point, idx) => (
                                        <li key={idx} className="flex items-start gap-2 text-sm">
                                            <span className="text-[var(--color-primary)] mt-0.5">•</span>
                                            <span>{point}</span>
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        )}

                        {/* Action Items */}
                        {selectedMail.actionItems?.length > 0 && (
                            <div>
                                <h4 className="text-xs font-semibold text-tertiary mb-2 uppercase tracking-wide">Action Items</h4>
                                <ul className="space-y-2">
                                    {selectedMail.actionItems.map((item, idx) => (
                                        <li key={idx} className="flex items-start gap-2 text-sm">
                                            <span className="text-[var(--ios-green)]">☐</span>
                                            <span>{item}</span>
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        )}

                        {/* Deadlines */}
                        {selectedMail.deadlines?.length > 0 && (
                            <div className="card-inset">
                                <h4 className="text-xs font-semibold text-tertiary mb-2 uppercase tracking-wide">Deadlines</h4>
                                <div className="space-y-2">
                                    {selectedMail.deadlines.map((deadline, idx) => (
                                        <div key={idx} className="flex items-center gap-2 text-sm">
                                            <span>📅</span>
                                            <span className="font-medium">{formatDate(deadline.date)}</span>
                                            <span className="text-tertiary">- {deadline.description}</span>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}

                        {/* Original Content */}
                        <details className="mt-2">
                            <summary className="text-sm text-tertiary cursor-pointer hover:text-secondary font-medium">
                                View Original Email
                            </summary>
                            <div className="mt-3 p-4 bg-[var(--fill-tertiary)] rounded-xl text-sm whitespace-pre-wrap max-h-60 overflow-y-auto">
                                {selectedMail.originalContent}
                            </div>
                        </details>
                    </div>
                )}
            </Modal>
        </div>
    );
}
