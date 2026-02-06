'use client';

import Card from '@/components/ui/Card';
import Badge from '@/components/ui/Badge';
import { formatDate, getRelativeTime, getCategoryStyle, getPriorityColor, truncate } from '@/lib/utils';

export default function MailCard({ mail, onClick }) {
    const categoryStyle = getCategoryStyle(mail.category);
    const priorityClass = getPriorityColor(mail.priority);

    const priorityStars = '★'.repeat(mail.priority) + '☆'.repeat(5 - mail.priority);

    return (
        <Card
            variant="default"
            padding="none"
            className={`cursor-pointer ${!mail.isRead ? 'border-l-4 border-l-[var(--color-primary-500)]' : ''}`}
            onClick={() => onClick?.(mail)}
        >
            <div className="p-lg">
                {/* Header */}
                <div className="flex items-start justify-between gap-md mb-sm">
                    <div className="flex-1 min-w-0">
                        <h4 className="font-semibold text-primary truncate">
                            {mail.subject || 'No Subject'}
                        </h4>
                        <p className="text-sm text-tertiary">
                            {mail.from} • {getRelativeTime(mail.receivedAt)}
                        </p>
                    </div>
                    <Badge variant={mail.category} icon={categoryStyle.icon}>
                        {categoryStyle.label}
                    </Badge>
                </div>

                {/* Summary */}
                <p className="text-secondary mb-md">
                    {mail.summary}
                </p>

                {/* Priority */}
                <div className="flex items-center gap-sm mb-md">
                    <span className="text-xs text-tertiary">Priority:</span>
                    <span className={`text-sm ${priorityClass}`}>{priorityStars}</span>
                </div>

                {/* Action Items */}
                {mail.actionItems?.length > 0 && (
                    <div className="mb-md">
                        <p className="text-xs text-tertiary mb-xs font-medium">📋 Action Items:</p>
                        <ul className="text-sm text-secondary space-y-1">
                            {mail.actionItems.map((item, idx) => (
                                <li key={idx} className="flex items-start gap-xs">
                                    <span className="text-[var(--color-primary-500)]">•</span>
                                    <span>{item}</span>
                                </li>
                            ))}
                        </ul>
                    </div>
                )}

                {/* Deadlines */}
                {mail.deadlines?.length > 0 && (
                    <div className="flex flex-wrap gap-xs">
                        {mail.deadlines.map((deadline, idx) => (
                            <span
                                key={idx}
                                className="text-xs px-2 py-1 bg-[var(--bg-tertiary)] rounded-full flex items-center gap-xs"
                            >
                                <span>📅</span>
                                <span>{formatDate(deadline.date)}</span>
                                <span className="text-tertiary">- {truncate(deadline.description, 30)}</span>
                            </span>
                        ))}
                    </div>
                )}

                {/* Sentiment indicator */}
                {mail.sentiment && (
                    <div className="mt-md pt-md border-t border-[var(--border-color)]">
                        <span className="text-xs text-tertiary">
                            Sentiment: {' '}
                            <span>
                                {mail.sentiment === 'positive' && '😊 Positive'}
                                {mail.sentiment === 'negative' && '😟 Requires Attention'}
                                {mail.sentiment === 'neutral' && '😐 Neutral'}
                            </span>
                        </span>
                    </div>
                )}
            </div>
        </Card>
    );
}
