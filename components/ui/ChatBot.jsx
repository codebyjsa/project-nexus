'use client';

import { useState, useRef, useEffect, useCallback } from 'react';
import { cn } from '@/lib/utils';
import ChatMessage, { TypingIndicator } from './ChatMessage';

export default function ChatBot() {
    const [isOpen, setIsOpen] = useState(false);
    const [messages, setMessages] = useState([
        {
            id: 1,
            role: 'assistant',
            content: 'Hey there! 👋 I\'m Nexus AI, your campus buddy. How can I help you today?',
            timestamp: new Date(),
        },
    ]);
    const [inputValue, setInputValue] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const messagesEndRef = useRef(null);
    const inputRef = useRef(null);

    // Scroll to bottom when messages change
    const scrollToBottom = useCallback(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, []);

    useEffect(() => {
        scrollToBottom();
    }, [messages, scrollToBottom]);

    // Focus input when chat opens
    useEffect(() => {
        if (isOpen) {
            setTimeout(() => inputRef.current?.focus(), 300);
        }
    }, [isOpen]);

    // Handle escape key to close
    useEffect(() => {
        const handleEscape = (e) => {
            if (e.key === 'Escape') setIsOpen(false);
        };
        if (isOpen) {
            document.addEventListener('keydown', handleEscape);
        }
        return () => document.removeEventListener('keydown', handleEscape);
    }, [isOpen]);

    const sendMessage = async () => {
        const trimmedInput = inputValue.trim();
        if (!trimmedInput || isLoading) return;

        const userMessage = {
            id: Date.now(),
            role: 'user',
            content: trimmedInput,
            timestamp: new Date(),
        };

        setMessages((prev) => [...prev, userMessage]);
        setInputValue('');
        setIsLoading(true);

        try {
            const response = await fetch('/api/chat', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    messages: [...messages, userMessage].map((m) => ({
                        role: m.role,
                        content: m.content,
                    })),
                }),
            });

            const data = await response.json();

            if (response.ok) {
                setMessages((prev) => [
                    ...prev,
                    {
                        id: Date.now() + 1,
                        role: 'assistant',
                        content: data.message,
                        timestamp: new Date(),
                    },
                ]);
            } else {
                setMessages((prev) => [
                    ...prev,
                    {
                        id: Date.now() + 1,
                        role: 'assistant',
                        content: 'Oops! Something went wrong. Please try again. 😅',
                        timestamp: new Date(),
                    },
                ]);
            }
        } catch (error) {
            console.error('Chat error:', error);
            setMessages((prev) => [
                ...prev,
                {
                    id: Date.now() + 1,
                    role: 'assistant',
                    content: 'I\'m having trouble connecting right now. Please try again later! 🔄',
                    timestamp: new Date(),
                },
            ]);
        } finally {
            setIsLoading(false);
        }
    };

    const handleKeyPress = (e) => {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            sendMessage();
        }
    };

    return (
        <>
            {/* Floating Action Button */}
            <button
                className={cn('chatbot-fab', isOpen && 'chatbot-fab-hidden')}
                onClick={() => setIsOpen(true)}
                aria-label="Open chat"
            >
                <span className="chatbot-fab-icon">💬</span>
                <span className="chatbot-fab-pulse"></span>
            </button>

            {/* Chat Window Overlay */}
            <div
                className={cn('chatbot-overlay', isOpen && 'chatbot-overlay-open')}
                onClick={(e) => {
                    if (e.target === e.currentTarget) setIsOpen(false);
                }}
            >
                {/* Chat Window */}
                <div className={cn('chatbot-window', isOpen && 'chatbot-window-open')}>
                    {/* Header */}
                    <div className="chatbot-header">
                        <div className="chatbot-header-info">
                            <div className="chatbot-header-avatar">🤖</div>
                            <div>
                                <h3 className="chatbot-header-title">Nexus AI</h3>
                                <span className="chatbot-header-status">
                                    <span className="chatbot-status-dot"></span>
                                    Online
                                </span>
                            </div>
                        </div>
                        <button
                            className="chatbot-close"
                            onClick={() => setIsOpen(false)}
                            aria-label="Close chat"
                        >
                            ✕
                        </button>
                    </div>

                    {/* Messages */}
                    <div className="chatbot-messages">
                        {messages.map((msg) => (
                            <ChatMessage
                                key={msg.id}
                                message={msg.content}
                                isUser={msg.role === 'user'}
                                timestamp={msg.timestamp}
                            />
                        ))}
                        {isLoading && <TypingIndicator />}
                        <div ref={messagesEndRef} />
                    </div>

                    {/* Input Area */}
                    <div className="chatbot-input-area">
                        <div className="chatbot-input-wrapper">
                            <input
                                ref={inputRef}
                                type="text"
                                className="chatbot-input"
                                placeholder="Type a message..."
                                value={inputValue}
                                onChange={(e) => setInputValue(e.target.value)}
                                onKeyPress={handleKeyPress}
                                disabled={isLoading}
                            />
                            <button
                                className={cn(
                                    'chatbot-send',
                                    (!inputValue.trim() || isLoading) && 'chatbot-send-disabled'
                                )}
                                onClick={sendMessage}
                                disabled={!inputValue.trim() || isLoading}
                                aria-label="Send message"
                            >
                                {isLoading ? (
                                    <span className="animate-spin">⏳</span>
                                ) : (
                                    <span>➤</span>
                                )}
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
}
