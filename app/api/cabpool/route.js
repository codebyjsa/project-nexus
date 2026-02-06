import { promises as fs } from 'fs';
import path from 'path';
import { NextResponse } from 'next/server';

const DATA_FILE = path.join(process.cwd(), 'data', 'cabpool.json');

// Helper function to read data
async function readData() {
    try {
        const fileContent = await fs.readFile(DATA_FILE, 'utf-8');
        return JSON.parse(fileContent);
    } catch (error) {
        return [];
    }
}

// Helper function to write data
async function writeData(data) {
    await fs.writeFile(DATA_FILE, JSON.stringify(data, null, 2), 'utf-8');
}

// GET - Fetch all cab pool rides
export async function GET() {
    try {
        const rides = await readData();
        // Sort by departure time (chronological)
        rides.sort((a, b) => new Date(a.departureTime) - new Date(b.departureTime));
        return NextResponse.json(rides);
    } catch (error) {
        return NextResponse.json(
            { error: 'Failed to fetch rides' },
            { status: 500 }
        );
    }
}

// POST - Add new cab pool ride
export async function POST(request) {
    try {
        const body = await request.json();
        const rides = await readData();

        // Create new ride with auto-generated ID
        const newRide = {
            id: Date.now().toString(),
            destination: body.destination,
            departureTime: body.departureTime,
            seatsAvailable: body.seatsAvailable,
            costEstimate: body.costEstimate,
            userName: body.userName,
            createdAt: new Date().toISOString(),
            // Future extension points:
            // - Add pickupLocation for route optimization
            // - Add realTimeTracking boolean for future GPS integration
        };

        rides.push(newRide);
        await writeData(rides);

        return NextResponse.json(newRide, { status: 201 });
    } catch (error) {
        return NextResponse.json(
            { error: 'Failed to create ride' },
            { status: 500 }
        );
    }
}

// DELETE - Remove ride by ID
export async function DELETE(request) {
    try {
        const { searchParams } = new URL(request.url);
        const id = searchParams.get('id');

        if (!id) {
            return NextResponse.json(
                { error: 'Ride ID is required' },
                { status: 400 }
            );
        }

        const rides = await readData();
        const filteredRides = rides.filter(ride => ride.id !== id);

        if (rides.length === filteredRides.length) {
            return NextResponse.json(
                { error: 'Ride not found' },
                { status: 404 }
            );
        }

        await writeData(filteredRides);

        return NextResponse.json({ success: true });
    } catch (error) {
        return NextResponse.json(
            { error: 'Failed to delete ride' },
            { status: 500 }
        );
    }
}
