/**
 * Timetable API Route - Placeholder
 * Owner: SEHAJ
 */

import { NextResponse } from 'next/server';

export async function GET() {
    return NextResponse.json({
        message: 'Timetable API - Coming Soon',
        owner: 'Sehaj',
        schedules: []
    });
}

export async function POST() {
    return NextResponse.json({
        error: 'Not implemented yet'
    }, { status: 501 });
}

export async function PUT() {
    return NextResponse.json({
        error: 'Not implemented yet'
    }, { status: 501 });
}
