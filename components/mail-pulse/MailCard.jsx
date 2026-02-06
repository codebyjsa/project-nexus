'use client';

import Card from '@/components/ui/Card';
import Badge from '@/components/ui/Badge';
import { formatDate, getRelativeTime, getCategoryStyle, getPriorityColor, truncate } from '@/lib/utils';

export default function MailCard({ mail, onClick }) {
    const categoryStyle = getCategoryStyle(mail.category);
    const priorityClass = getPriorityColor(mail.priority);
    const priorityStars = '★'.repeat(mail.priority) + '☆'.repeat(5 - mail.priority);

    return (
        <div
            className={`glass-card cursor-pointer transition-all hover:scale-[1.01] ${!mail.isRead ? 'ring-2 ring-[var(--color-primary)] ring-offset-2 ring-offset-[var(--bg-primary)]' : ''
                }`}
            onClick={() => onClick?.(mail)}
        >
            {/* Header */}
            <div className="flex items-start justify-between gap-3 mb-2">
                <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                        {!mail.isRead && (
                            <span className="w-2 h-2 rounded-full bg-[var(--color-primary)] animate-pulse" />
                        )}
                        <h4 className="font-semibold text-primary truncate">
                            {mail.subject || 'No Subject'}
                        </h4>
                    </div>
                    <p className="text-sm text-tertiary">
                        {mail.from} • {getRelativeTime(mail.receivedAt)}
                    </p>
                </div>
                <Badge variant={mail.category} size="sm">
                    {categoryStyle.label}
                </Badge>
            </div>

            {/* Summary */}
            <div className="card-inset mb-3">
                <p className="text-secondary text-sm">
                    {mail.summary}
                </p>
            </div>

            {/* Priority */}
            <div className="flex items-center gap-2 mb-3">
                <span className="text-xs text-tertiary font-medium">Priority:</span>
                <span className={`text-sm ${priorityClass}`}>{priorityStars}</span>
            </div>

            {/* Action Items */}
            {mail.actionItems?.length > 0 && (
                <div className="mb-3">
                    <p className="text-xs text-tertiary mb-1.5 font-semibold uppercase tracking-wide">
                        📋 Action Items
                    </p>
                    <ul className="text-sm text-secondary space-y-1">
                        {mail.actionItems.slice(0, 2).map((item, idx) => (
                            <li key={idx} className="flex items-start gap-2">
                                <span className="text-[var(--ios-green)]">☐</span>
                                <span>{item}</span>
                            </li>
                        ))}
                        {mail.actionItems.length > 2 && (
                            <li className="text-xs text-tertiary">
                                +{mail.actionItems.length - 2} more
                            </li>
                        )}
                    </ul>
                </div>
            )}

            {/* Deadlines */}
            {mail.deadlines?.length > 0 && (
                <div className="flex flex-wrap gap-2">
                    {mail.deadlines.map((deadline, idx) => (
                        <span
                            key={idx}
                            className="text-xs px-3 py-1.5 bg-[var(--fill-tertiary)] rounded-full flex items-center gap-1.5"
                        >
                            <span>📅</span>
                            <span className="font-medium">{formatDate(deadline.date)}</span>
                            <span className="text-tertiary">- {truncate(deadline.description, 20)}</span>
                        </span>
                    ))}
                </div>
            )}

            {/* Footer with sentiment and chevron */}
            <div className="mt-3 pt-3 border-t border-[var(--divider)] flex items-center justify-between">
                {mail.sentiment && (
                    <span className="text-xs text-tertiary">
                        {mail.sentiment === 'positive' && '😊 Positive'}
                        {mail.sentiment === 'negative' && '😟 Attention'}
                        {mail.sentiment === 'neutral' && '😐 Neutral'}
                    </span>
                )}
                <span className="text-tertiary ml-auto">›</span>
            </div>
        </div>
    );
}
