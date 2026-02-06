/**
 * Mess Menu API Route
 * GET: Retrieve today's menu or menu for a specific date
 * POST: Add new menu (admin function)
 */

import { NextResponse } from 'next/server';
import { readData, writeData } from '@/lib/storage';
import { generateId, isToday } from '@/lib/utils';

// GET: Retrieve mess menu
export async function GET(request) {
    try {
        const { searchParams } = new URL(request.url);
        const date = searchParams.get('date'); // Optional: YYYY-MM-DD
        const meal = searchParams.get('meal'); // Optional: breakfast, lunch, snacks, dinner
        const dietary = searchParams.get('dietary'); // Optional: veg, non-veg

        const data = readData('mess-menu.json');

        if (!data || !data.menus) {
            return NextResponse.json({
                menu: null,
                message: 'No menu available'
            });
        }

        // Find menu for the specified date or today
        const today = new Date().toISOString().split('T')[0];
        const targetDate = date || today;

        let menu = data.menus.find(m => m.date === targetDate);

        // If no exact date match, try to find any available menu (for demo)
        if (!menu && data.menus.length > 0) {
            menu = data.menus[0]; // Return the first available menu
        }

        if (!menu) {
            return NextResponse.json({
                menu: null,
                message: 'No menu available for this date'
            });
        }

        // Filter by dietary preference if specified
        if (dietary && menu.meals) {
            const filteredMeals = {};
            for (const [mealType, mealData] of Object.entries(menu.meals)) {
                filteredMeals[mealType] = {
                    ...mealData,
                    items: mealData.items.filter(item =>
                        dietary === 'all' || item.type === dietary
                    )
                };
            }
            menu = { ...menu, meals: filteredMeals };
        }

        // Filter by specific meal if specified
        if (meal && menu.meals && menu.meals[meal]) {
            return NextResponse.json({
                menu: {
                    ...menu,
                    meals: { [meal]: menu.meals[meal] }
                },
                currentMeal: meal,
            });
        }

        // Determine current meal based on time
        const now = new Date();
        const hour = now.getHours();
        let currentMeal = 'breakfast';
        if (hour >= 19) currentMeal = 'dinner';
        else if (hour >= 17) currentMeal = 'snacks';
        else if (hour >= 12) currentMeal = 'lunch';

        return NextResponse.json({
            menu,
            currentMeal,
            allMeals: Object.keys(menu.meals || {}),
        });
    } catch (error) {
        console.error('GET /api/mess error:', error);
        return NextResponse.json(
            { error: 'Failed to fetch menu' },
            { status: 500 }
        );
    }
}

// POST: Add new menu
export async function POST(request) {
    try {
        const body = await request.json();
        const { date, day, meals } = body;

        if (!date || !meals) {
            return NextResponse.json(
                { error: 'Date and meals are required' },
                { status: 400 }
            );
        }

        // Validate date format
        const dateRegex = /^\d{4}-\d{2}-\d{2}$/;
        if (!dateRegex.test(date)) {
            return NextResponse.json(
                { error: 'Invalid date format. Use YYYY-MM-DD' },
                { status: 400 }
            );
        }

        const newMenu = {
            id: `menu-${date}`,
            date,
            day: day || new Date(date).toLocaleDateString('en-US', { weekday: 'long' }),
            meals,
            createdAt: new Date().toISOString(),
        };

        const data = readData('mess-menu.json') || { menus: [] };

        // Check if menu for this date already exists
        const existingIndex = data.menus.findIndex(m => m.date === date);
        if (existingIndex !== -1) {
            // Update existing menu
            data.menus[existingIndex] = newMenu;
        } else {
            // Add new menu
            data.menus.push(newMenu);
        }

        // Sort by date (newest first)
        data.menus.sort((a, b) => new Date(b.date) - new Date(a.date));

        writeData('mess-menu.json', data);

        return NextResponse.json({
            success: true,
            menu: newMenu,
        });
    } catch (error) {
        console.error('POST /api/mess error:', error);
        return NextResponse.json(
            { error: 'Failed to add menu' },
            { status: 500 }
        );
    }
}

// DELETE: Remove a menu
export async function DELETE(request) {
    try {
        const { searchParams } = new URL(request.url);
        const date = searchParams.get('date');

        if (!date) {
            return NextResponse.json(
                { error: 'Date is required' },
                { status: 400 }
            );
        }

        const data = readData('mess-menu.json');
        if (!data || !data.menus) {
            return NextResponse.json(
                { error: 'Menu not found' },
                { status: 404 }
            );
        }

        const initialLength = data.menus.length;
        data.menus = data.menus.filter(m => m.date !== date);

        if (data.menus.length === initialLength) {
            return NextResponse.json(
                { error: 'Menu not found' },
                { status: 404 }
            );
        }

        writeData('mess-menu.json', data);

        return NextResponse.json({
            success: true,
            message: 'Menu deleted',
        });
    } catch (error) {
        console.error('DELETE /api/mess error:', error);
        return NextResponse.json(
            { error: 'Failed to delete menu' },
            { status: 500 }
        );
    }
}
