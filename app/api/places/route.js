/**
 * Places API Route - Placeholder
 * Owner: SEHAJ
 */

import { NextResponse } from 'next/server';

export async function GET() {
    return NextResponse.json({
        message: 'Places API - Coming Soon',
        owner: 'Sehaj',
        places: []
    });
}

export async function POST() {
    return NextResponse.json({
        error: 'Not implemented yet'
    }, { status: 501 });
}
