/**
 * Cab Pool API Route - Placeholder
 * Owner: MANMOHAN
 */

import { NextResponse } from 'next/server';

export async function GET() {
    return NextResponse.json({
        message: 'Cab Pool API - Coming Soon',
        owner: 'Manmohan',
        rides: []
    });
}

export async function POST() {
    return NextResponse.json({
        error: 'Not implemented yet'
    }, { status: 501 });
}

export async function DELETE() {
    return NextResponse.json({
        error: 'Not implemented yet'
    }, { status: 501 });
}
