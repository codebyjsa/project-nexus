import { promises as fs } from 'fs';
import path from 'path';
import { NextResponse } from 'next/server';

const DATA_FILE = path.join(process.cwd(), 'data', 'marketplace.json');

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

// GET - Fetch all marketplace items
export async function GET() {
    try {
        const items = await readData();
        return NextResponse.json(items);
    } catch (error) {
        return NextResponse.json(
            { error: 'Failed to fetch products' },
            { status: 500 }
        );
    }
}

// POST - Add new product listing
export async function POST(request) {
    try {
        const body = await request.json();
        const items = await readData();

        // Create new product with auto-generated ID
        const newProduct = {
            id: Date.now().toString(),
            title: body.title,
            description: body.description,
            price: body.price,
            category: body.category,
            condition: body.condition, // 'new' | 'good' | 'used'
            userName: body.userName,
            createdAt: new Date().toISOString(),
            // Future AI extension point: Add aiPriceSuggestion field for AI pricing engine
        };

        items.push(newProduct);
        await writeData(items);

        return NextResponse.json(newProduct, { status: 201 });
    } catch (error) {
        return NextResponse.json(
            { error: 'Failed to create product' },
            { status: 500 }
        );
    }
}

// DELETE - Remove product by ID
export async function DELETE(request) {
    try {
        const { searchParams } = new URL(request.url);
        const id = searchParams.get('id');

        if (!id) {
            return NextResponse.json(
                { error: 'Product ID is required' },
                { status: 400 }
            );
        }

        const items = await readData();
        const filteredItems = items.filter(item => item.id !== id);

        if (items.length === filteredItems.length) {
            return NextResponse.json(
                { error: 'Product not found' },
                { status: 404 }
            );
        }

        await writeData(filteredItems);

        return NextResponse.json({ success: true });
    } catch (error) {
        return NextResponse.json(
            { error: 'Failed to delete product' },
            { status: 500 }
        );
    }
}
