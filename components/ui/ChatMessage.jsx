'use client';

import { cn } from '@/lib/utils';

export default function ChatMessage({ message, isUser, timestamp }) {
    const formattedTime = timestamp
        ? new Date(timestamp).toLocaleTimeString('en-US', {
            hour: 'numeric',
            minute: '2-digit',
            hour12: true,
        })
        : '';

    return (
        <div
            className={cn(
                'chat-message animate-slideUp',
                isUser ? 'chat-message-user' : 'chat-message-ai'
            )}
        >
            {!isUser && (
                <div className="chat-avatar chat-avatar-ai">
                    <span>🤖</span>
                </div>
            )}

            <div className="chat-bubble-wrapper">
                <div
                    className={cn(
                        'chat-bubble',
                        isUser ? 'chat-bubble-user' : 'chat-bubble-ai'
                    )}
                >
                    <p className="chat-text">{message}</p>
                </div>
                {formattedTime && (
                    <span className="chat-time">{formattedTime}</span>
                )}
            </div>

            {isUser && (
                <div className="chat-avatar chat-avatar-user">
                    <span>👤</span>
                </div>
            )}
        </div>
    );
}

// Typing indicator component
export function TypingIndicator() {
    return (
        <div className="chat-message chat-message-ai">
            <div className="chat-avatar chat-avatar-ai">
                <span>🤖</span>
            </div>
            <div className="chat-bubble chat-bubble-ai">
                <div className="typing-indicator">
                    <span></span>
                    <span></span>
                    <span></span>
                </div>
            </div>
        </div>
    );
}
