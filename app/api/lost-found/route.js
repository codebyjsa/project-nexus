import { promises as fs } from 'fs';
import path from 'path';
import { NextResponse } from 'next/server';

const DATA_FILE = path.join(process.cwd(), 'data', 'lost-found.json');

// Helper function to read data
async function readData() {
    try {
        const fileContent = await fs.readFile(DATA_FILE, 'utf-8');
        return JSON.parse(fileContent);
    } catch (error) {
        // If file doesn't exist or is empty, return empty array
        return [];
    }
}

// Helper function to write data
async function writeData(data) {
    await fs.writeFile(DATA_FILE, JSON.stringify(data, null, 2), 'utf-8');
}

// GET - Fetch all lost/found items
export async function GET() {
    try {
        const items = await readData();
        return NextResponse.json(items);
    } catch (error) {
        return NextResponse.json(
            { error: 'Failed to fetch items' },
            { status: 500 }
        );
    }
}

// POST - Add new lost/found item
export async function POST(request) {
    try {
        const body = await request.json();
        const items = await readData();

        // Create new item with auto-generated ID
        const newItem = {
            id: Date.now().toString(),
            title: body.title,
            description: body.description,
            category: body.category,
            status: body.status, // 'lost' or 'found'
            location: body.location,
            userName: body.userName,
            createdAt: new Date().toISOString(),
            // Future AI extension point: Add imageUrl field for AI image recognition
        };

        items.push(newItem);
        await writeData(items);

        return NextResponse.json(newItem, { status: 201 });
    } catch (error) {
        return NextResponse.json(
            { error: 'Failed to create item' },
            { status: 500 }
        );
    }
}

// PUT - Update existing item by ID
export async function PUT(request) {
    try {
        const { searchParams } = new URL(request.url);
        const id = searchParams.get('id');

        if (!id) {
            return NextResponse.json(
                { error: 'Item ID is required' },
                { status: 400 }
            );
        }

        const body = await request.json();
        const items = await readData();

        const itemIndex = items.findIndex(item => item.id === id);

        if (itemIndex === -1) {
            return NextResponse.json(
                { error: 'Item not found' },
                { status: 404 }
            );
        }

        // Update item while preserving id and createdAt
        items[itemIndex] = {
            ...items[itemIndex],
            title: body.title,
            description: body.description,
            category: body.category,
            status: body.status,
            location: body.location,
            userName: body.userName,
            updatedAt: new Date().toISOString(),
        };

        await writeData(items);

        return NextResponse.json(items[itemIndex]);
    } catch (error) {
        return NextResponse.json(
            { error: 'Failed to update item' },
            { status: 500 }
        );
    }
}

// DELETE - Remove item by ID
export async function DELETE(request) {
    try {
        const { searchParams } = new URL(request.url);
        const id = searchParams.get('id');

        if (!id) {
            return NextResponse.json(
                { error: 'Item ID is required' },
                { status: 400 }
            );
        }

        const items = await readData();
        const filteredItems = items.filter(item => item.id !== id);

        if (items.length === filteredItems.length) {
            return NextResponse.json(
                { error: 'Item not found' },
                { status: 404 }
            );
        }

        await writeData(filteredItems);

        return NextResponse.json({ success: true });
    } catch (error) {
        return NextResponse.json(
            { error: 'Failed to delete item' },
            { status: 500 }
        );
    }
}
