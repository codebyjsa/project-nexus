/**
 * Mail API Route
 * POST: Summarize a new email using AI
 * GET: Retrieve email history with optional filters
 */

import { NextResponse } from 'next/server';
import { summarizeEmail, quickAnalysis } from '@/lib/ai/summarizer';
import { readData, writeData, appendToArray } from '@/lib/storage';
import { generateId } from '@/lib/utils';

// GET: Retrieve email history
export async function GET(request) {
    try {
        const { searchParams } = new URL(request.url);
        const category = searchParams.get('category');
        const priority = searchParams.get('priority');
        const search = searchParams.get('search');
        const limit = parseInt(searchParams.get('limit')) || 50;
        const page = parseInt(searchParams.get('page')) || 1;

        const data = readData('mails.json');

        if (!data || !data.mails) {
            return NextResponse.json({ mails: [], total: 0 });
        }

        let mails = [...data.mails];

        // Apply filters
        if (category && category !== 'all') {
            mails = mails.filter(mail => mail.category === category);
        }

        if (priority) {
            const minPriority = parseInt(priority);
            mails = mails.filter(mail => mail.priority >= minPriority);
        }

        if (search) {
            const searchLower = search.toLowerCase();
            mails = mails.filter(mail =>
                mail.subject?.toLowerCase().includes(searchLower) ||
                mail.summary?.toLowerCase().includes(searchLower) ||
                mail.originalContent?.toLowerCase().includes(searchLower)
            );
        }

        // Sort by date (newest first)
        mails.sort((a, b) => new Date(b.receivedAt) - new Date(a.receivedAt));

        // Pagination
        const total = mails.length;
        const start = (page - 1) * limit;
        const end = start + limit;
        const paginatedMails = mails.slice(start, end);

        return NextResponse.json({
            mails: paginatedMails,
            total,
            page,
            limit,
            totalPages: Math.ceil(total / limit),
        });
    } catch (error) {
        console.error('GET /api/mail error:', error);
        return NextResponse.json(
            { error: 'Failed to fetch mails' },
            { status: 500 }
        );
    }
}

// POST: Summarize a new email
export async function POST(request) {
    try {
        const body = await request.json();
        const { content, subject, from } = body;

        if (!content) {
            return NextResponse.json(
                { error: 'Email content is required' },
                { status: 400 }
            );
        }

        // Quick analysis first
        const quickInsights = quickAnalysis(content);

        // AI summarization
        let aiSummary;
        try {
            aiSummary = await summarizeEmail(content, subject);
        } catch (aiError) {
            console.error('AI summarization failed:', aiError);
            // Fallback to quick analysis
            aiSummary = {
                summary: content.substring(0, 150) + '...',
                category: quickInsights.category,
                priority: quickInsights.hasUrgentMarkers ? 4 : 2,
                deadlines: [],
                actionItems: [],
                sentiment: 'neutral',
                keyPoints: [],
            };
        }

        // Create mail entry
        const newMail = {
            id: generateId(),
            subject: subject || 'No Subject',
            from: from || 'unknown@email.com',
            receivedAt: new Date().toISOString(),
            originalContent: content,
            summary: aiSummary.summary,
            category: aiSummary.category,
            priority: aiSummary.priority,
            deadlines: aiSummary.deadlines,
            actionItems: aiSummary.actionItems,
            sentiment: aiSummary.sentiment,
            keyPoints: aiSummary.keyPoints,
            quickInsights,
            isRead: false,
        };

        // Save to storage
        const data = readData('mails.json') || { mails: [] };
        data.mails.unshift(newMail); // Add to beginning
        writeData('mails.json', data);

        return NextResponse.json({
            success: true,
            mail: newMail,
        });
    } catch (error) {
        console.error('POST /api/mail error:', error);
        return NextResponse.json(
            { error: 'Failed to process email' },
            { status: 500 }
        );
    }
}

// PATCH: Mark email as read or update
export async function PATCH(request) {
    try {
        const body = await request.json();
        const { id, isRead } = body;

        if (!id) {
            return NextResponse.json(
                { error: 'Email ID is required' },
                { status: 400 }
            );
        }

        const data = readData('mails.json');
        if (!data || !data.mails) {
            return NextResponse.json(
                { error: 'Mail not found' },
                { status: 404 }
            );
        }

        const mailIndex = data.mails.findIndex(m => m.id === id);
        if (mailIndex === -1) {
            return NextResponse.json(
                { error: 'Mail not found' },
                { status: 404 }
            );
        }

        data.mails[mailIndex].isRead = isRead;
        writeData('mails.json', data);

        return NextResponse.json({
            success: true,
            mail: data.mails[mailIndex],
        });
    } catch (error) {
        console.error('PATCH /api/mail error:', error);
        return NextResponse.json(
            { error: 'Failed to update email' },
            { status: 500 }
        );
    }
}

// DELETE: Remove an email
export async function DELETE(request) {
    try {
        const { searchParams } = new URL(request.url);
        const id = searchParams.get('id');

        if (!id) {
            return NextResponse.json(
                { error: 'Email ID is required' },
                { status: 400 }
            );
        }

        const data = readData('mails.json');
        if (!data || !data.mails) {
            return NextResponse.json(
                { error: 'Mail not found' },
                { status: 404 }
            );
        }

        const initialLength = data.mails.length;
        data.mails = data.mails.filter(m => m.id !== id);

        if (data.mails.length === initialLength) {
            return NextResponse.json(
                { error: 'Mail not found' },
                { status: 404 }
            );
        }

        writeData('mails.json', data);

        return NextResponse.json({
            success: true,
            message: 'Email deleted',
        });
    } catch (error) {
        console.error('DELETE /api/mail error:', error);
        return NextResponse.json(
            { error: 'Failed to delete email' },
            { status: 500 }
        );
    }
}
