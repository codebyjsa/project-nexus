/**
 * Auth API Route
 * POST: Login/Register functionality
 */

import { NextResponse } from 'next/server';
import { readData, writeData } from '@/lib/storage';
import { generateId } from '@/lib/utils';

// POST: Login or Register
export async function POST(request) {
    try {
        const body = await request.json();
        const { action, email, password, name } = body;

        if (!email || !password) {
            return NextResponse.json(
                { error: 'Email and password are required' },
                { status: 400 }
            );
        }

        const data = readData('users.json') || { users: [] };

        if (action === 'register') {
            // Check if user already exists
            const existingUser = data.users.find(u => u.email === email);
            if (existingUser) {
                return NextResponse.json(
                    { error: 'User already exists' },
                    { status: 409 }
                );
            }

            // Create new user (Note: In production, hash the password!)
            const newUser = {
                id: generateId(),
                email,
                name: name || email.split('@')[0],
                password, // WARNING: Store hashed password in production!
                createdAt: new Date().toISOString(),
                preferences: {
                    dietaryFilter: 'all',
                    notifications: true,
                },
            };

            data.users.push(newUser);
            writeData('users.json', data);

            // Return user without password
            const { password: _, ...userWithoutPassword } = newUser;
            return NextResponse.json({
                success: true,
                user: userWithoutPassword,
                message: 'Registration successful',
            });
        } else {
            // Login
            const user = data.users.find(u => u.email === email && u.password === password);

            if (!user) {
                return NextResponse.json(
                    { error: 'Invalid email or password' },
                    { status: 401 }
                );
            }

            // Return user without password
            const { password: _, ...userWithoutPassword } = user;
            return NextResponse.json({
                success: true,
                user: userWithoutPassword,
                message: 'Login successful',
            });
        }
    } catch (error) {
        console.error('POST /api/auth error:', error);
        return NextResponse.json(
            { error: 'Authentication failed' },
            { status: 500 }
        );
    }
}
