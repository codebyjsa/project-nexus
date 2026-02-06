'use client';

import { useState } from 'react';
import Card from '@/components/ui/Card';
import Button from '@/components/ui/Button';
import { TextArea } from '@/components/ui/Input';

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

            // Clear the form
            setEmailContent('');
            setSubject('');

            // Notify parent component
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
        <Card variant="glass" className="mb-lg">
            <div className="flex items-center justify-between mb-md">
                <h3 className="h4 flex items-center gap-sm">
                    <span>✉️</span>
                    <span>Mail Summarizer</span>
                </h3>
                <span className="badge badge-info">AI Powered</span>
            </div>

            <p className="text-sm text-tertiary mb-md">
                Paste your college email below and let AI extract the key information, deadlines, and action items.
            </p>

            <div className="flex flex-col gap-md">
                <input
                    type="text"
                    className="input"
                    placeholder="Email Subject (optional)"
                    value={subject}
                    onChange={(e) => setSubject(e.target.value)}
                />

                <TextArea
                    placeholder="Paste your email content here..."
                    value={emailContent}
                    onChange={(e) => setEmailContent(e.target.value)}
                    style={{ minHeight: '150px' }}
                />

                {error && (
                    <div className="text-sm text-[var(--color-error)] p-sm bg-[rgba(255,59,48,0.1)] rounded-md">
                        ⚠️ {error}
                    </div>
                )}

                <div className="flex gap-sm flex-wrap">
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
                    >
                        {loading ? 'Summarizing...' : 'Summarize with AI'}
                    </Button>
                </div>
            </div>
        </Card>
    );
}
