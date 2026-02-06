'use client';

import { useState } from 'react';
import Card from '@/components/ui/Card';
import Button from '@/components/ui/Button';
import Input, { Textarea } from '@/components/ui/Input';
import Badge from '@/components/ui/Badge';

export default function MailSummarizer({ onSummarized }) {
    const [emailContent, setEmailContent] = useState('');
    const [subject, setSubject] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    const handleSummarize = async () => {
        if (!emailContent.trim()) {
            setError('Please paste or type an email to summarize');
            return;
        }

        setLoading(true);
        setError('');

        try {
            const response = await fetch('/api/mail', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    content: emailContent,
                    subject: subject || undefined,
                }),
            });

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.error || 'Failed to summarize');
            }

            setEmailContent('');
            setSubject('');
            onSummarized?.(data.mail);
        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    const handlePaste = async () => {
        try {
            const text = await navigator.clipboard.readText();
            setEmailContent(text);
        } catch (err) {
            setError('Failed to paste from clipboard');
        }
    };

    const handleClear = () => {
        setEmailContent('');
        setSubject('');
        setError('');
    };

    return (
        <Card variant="glass-thick" className="mb-4">
            {/* Header */}
            <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[var(--ios-blue)] to-[var(--ios-indigo)] flex items-center justify-center text-xl">
                        ✉️
                    </div>
                    <div>
                        <h3 className="font-semibold">Mail Summarizer</h3>
                        <p className="text-xs text-tertiary">Powered by AI</p>
                    </div>
                </div>
                <Badge variant="info" glow>✨ AI</Badge>
            </div>

            <p className="text-sm text-tertiary mb-4">
                Paste your college email and let AI extract key info, deadlines & action items.
            </p>

            <div className="flex flex-col gap-3">
                <Input
                    type="text"
                    placeholder="Email Subject (optional)"
                    value={subject}
                    onChange={(e) => setSubject(e.target.value)}
                />

                <Textarea
                    placeholder="Paste your email content here..."
                    value={emailContent}
                    onChange={(e) => setEmailContent(e.target.value)}
                    style={{ minHeight: '140px' }}
                />

                {error && (
                    <div className="text-sm text-[var(--ios-red)] p-3 bg-[rgba(255,59,48,0.1)] rounded-xl flex items-center gap-2">
                        <span>⚠️</span>
                        <span>{error}</span>
                    </div>
                )}

                <div className="flex gap-2 flex-wrap">
                    <Button onClick={handlePaste} variant="secondary" icon="📋">
                        Paste
                    </Button>
                    <Button onClick={handleClear} variant="ghost">
                        Clear
                    </Button>
                    <Button
                        onClick={handleSummarize}
                        loading={loading}
                        className="flex-1"
                        icon="✨"
                        glow={!loading}
                    >
                        {loading ? 'Analyzing...' : 'Summarize'}
                    </Button>
                </div>
            </div>
        </Card>
    );
}
