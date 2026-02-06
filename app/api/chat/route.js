import { NextResponse } from 'next/server';
import { promises as fs } from 'fs';
import path from 'path';

const GROQ_API_URL = 'https://api.groq.com/openai/v1/chat/completions';

// Load all app data for context
async function loadAppData() {
    const dataDir = path.join(process.cwd(), 'data');
    const data = {};

    try {
        // Load mess menu
        const messMenuPath = path.join(dataDir, 'mess-menu.json');
        const messMenuRaw = await fs.readFile(messMenuPath, 'utf-8');
        data.messMenu = JSON.parse(messMenuRaw);

        // Load mails
        const mailsPath = path.join(dataDir, 'mails.json');
        const mailsRaw = await fs.readFile(mailsPath, 'utf-8');
        data.mails = JSON.parse(mailsRaw);

        // Load places
        const placesPath = path.join(dataDir, 'places.json');
        const placesRaw = await fs.readFile(placesPath, 'utf-8');
        data.places = JSON.parse(placesRaw);

        // Load timetable
        const timetablePath = path.join(dataDir, 'timetable.json');
        const timetableRaw = await fs.readFile(timetablePath, 'utf-8');
        data.timetable = JSON.parse(timetableRaw);

        // Load marketplace
        const marketplacePath = path.join(dataDir, 'marketplace.json');
        const marketplaceRaw = await fs.readFile(marketplacePath, 'utf-8');
        data.marketplace = JSON.parse(marketplaceRaw);

        // Load cabpool
        const cabpoolPath = path.join(dataDir, 'cabpool.json');
        const cabpoolRaw = await fs.readFile(cabpoolPath, 'utf-8');
        data.cabpool = JSON.parse(cabpoolRaw);

        // Load lost-found
        const lostFoundPath = path.join(dataDir, 'lost-found.json');
        const lostFoundRaw = await fs.readFile(lostFoundPath, 'utf-8');
        data.lostFound = JSON.parse(lostFoundRaw);

    } catch (error) {
        console.error('Error loading app data:', error);
    }

    return data;
}

// Format mess menu for today
function formatTodayMenu(messMenu) {
    if (!messMenu?.menus?.length) return 'No mess menu data available.';

    const today = new Date().toISOString().split('T')[0];
    const todayMenu = messMenu.menus.find((m) => m.date === today);

    if (!todayMenu) {
        // Return all available menus
        return messMenu.menus
            .map((menu) => {
                const meals = menu.meals;
                let menuStr = `📅 ${menu.day} (${menu.date}):\n`;
                if (meals.breakfast) {
                    menuStr += `🌅 Breakfast (${meals.breakfast.time}): ${meals.breakfast.items.map((i) => i.name).join(', ')}\n`;
                }
                if (meals.lunch) {
                    menuStr += `☀️ Lunch (${meals.lunch.time}): ${meals.lunch.items.map((i) => i.name).join(', ')}\n`;
                }
                if (meals.snacks) {
                    menuStr += `🍿 Snacks (${meals.snacks.time}): ${meals.snacks.items.map((i) => i.name).join(', ')}\n`;
                }
                if (meals.dinner) {
                    menuStr += `🌙 Dinner (${meals.dinner.time}): ${meals.dinner.items.map((i) => i.name).join(', ')}\n`;
                }
                return menuStr;
            })
            .join('\n');
    }

    const meals = todayMenu.meals;
    let menuStr = `📅 Today's Menu (${todayMenu.day}, ${todayMenu.date}):\n`;
    if (meals.breakfast) {
        menuStr += `🌅 Breakfast (${meals.breakfast.time}): ${meals.breakfast.items.map((i) => i.name).join(', ')}\n`;
    }
    if (meals.lunch) {
        menuStr += `☀️ Lunch (${meals.lunch.time}): ${meals.lunch.items.map((i) => i.name).join(', ')}\n`;
    }
    if (meals.snacks) {
        menuStr += `🍿 Snacks (${meals.snacks.time}): ${meals.snacks.items.map((i) => i.name).join(', ')}\n`;
    }
    if (meals.dinner) {
        menuStr += `🌙 Dinner (${meals.dinner.time}): ${meals.dinner.items.map((i) => i.name).join(', ')}\n`;
    }
    return menuStr;
}

// Format mails for context
function formatMails(mailsData) {
    if (!mailsData?.mails?.length) return 'No mail data available.';

    return mailsData.mails
        .map((mail) => {
            let mailStr = `📧 ${mail.subject} (from: ${mail.from})\n`;
            mailStr += `   Category: ${mail.category}, Priority: ${mail.priority}/5\n`;
            mailStr += `   Summary: ${mail.summary}\n`;
            if (mail.deadlines?.length) {
                mailStr += `   Deadlines: ${mail.deadlines.map((d) => `${d.date}: ${d.description}`).join(', ')}\n`;
            }
            if (mail.actionItems?.length) {
                mailStr += `   Action Items: ${mail.actionItems.join('; ')}\n`;
            }
            return mailStr;
        })
        .join('\n');
}

// Format places/explorer data for context
function formatPlaces(placesData) {
    if (!placesData?.places?.length) return 'No places data available.';

    // Group places by category
    const categories = {};
    placesData.places.forEach((place) => {
        if (!categories[place.category]) {
            categories[place.category] = [];
        }
        categories[place.category].push(place);
    });

    const categoryEmojis = {
        food: '🍽️',
        cafe: '☕',
        nature: '🌿',
        entertainment: '🎮',
        shopping: '🛍️',
        spiritual: '🙏',
    };

    let output = '';
    for (const [category, places] of Object.entries(categories)) {
        const emoji = categoryEmojis[category] || '📍';
        output += `\n${emoji} ${category.toUpperCase()}:\n`;
        places.forEach((place) => {
            output += `• ${place.name} (⭐${place.rating}, ${place.distance}km away)\n`;
            output += `  📍 ${place.location.address}\n`;
            output += `  📝 ${place.description}\n`;
            output += `  💰 Price: ${place.priceRange}`;
            if (place.studentDiscount) {
                output += ` | 🎓 Student Discount: ${place.discountDetails || 'Available'}`;
            }
            output += '\n';
            output += `  🏷️ Vibes: ${place.vibes.join(', ')}\n`;

            // Include recent reviews
            if (place.reviews?.length > 0) {
                const recentReview = place.reviews[0];
                output += `  💬 Recent: "${recentReview.text}" - ${recentReview.userName}\n`;
            }
        });
    }
    return output;
}

// Build comprehensive system prompt with app data
function buildSystemPrompt(appData) {
    const messMenuContext = formatTodayMenu(appData.messMenu);
    const mailsContext = formatMails(appData.mails);
    const placesContext = formatPlaces(appData.places);

    return `You are Nexus AI, the intelligent campus assistant for Project Nexus - the ultimate college companion app. You have COMPLETE knowledge of all app data and can answer ANY question about campus life.

🎯 YOUR CAPABILITIES:
- You know ALL the mess menu details (items, timings, dietary info, allergens)
- You know ALL important emails, their summaries, deadlines, and action items
- You know ALL nearby places: restaurants, cafes, nature spots, entertainment, shopping, spiritual places
- You know ratings, reviews, student discounts, operating hours, prices, and vibes for every place
- You can help with timetables, marketplace, cab pooling, and lost & found
- You provide accurate, helpful, and friendly responses

📋 CURRENT APP DATA:

=== MESS MENU ===
${messMenuContext}

=== IMPORTANT EMAILS & NOTIFICATIONS ===
${mailsContext}

=== EXPLORER: NEARBY PLACES & HANGOUTS ===
${placesContext}

=== APP FEATURES ===
1. Daily Pulse (Mail Summarizer + Mess Menu)
2. Exchange Hub (Lost & Found, Marketplace, Cab Pool)
3. Explorer (Nearby places & hangouts)
4. Academics (Timetable, Grades, Courses)

🎓 YOUR PERSONALITY:
- Warm, friendly, and helpful like a senior student buddy
- Concise but thorough
- Use relevant emojis to make responses engaging
- Always provide accurate information from the app data
- If you don't have specific data, say so honestly
- Be proactive in suggesting helpful actions

💡 RESPONSE GUIDELINES:
- For mess menu questions: Give exact items, timings, and dietary info
- For email questions: Provide summaries, deadlines, and required actions
- For places/hangout questions: Recommend based on vibes, budget, distance, ratings, and student discounts
- For "where to eat/study/chill" questions: Suggest multiple options with pros/cons
- For date spot questions: Recommend romantic places with ambiance details
- For budget-friendly options: Highlight student discounts and price ranges
- Always be accurate - never make up information not in the data
- Keep responses conversational but informative`;
}

export async function POST(request) {
    try {
        const { messages } = await request.json();

        if (!messages || !Array.isArray(messages)) {
            return NextResponse.json(
                { error: 'Messages array is required' },
                { status: 400 }
            );
        }

        const apiKey = process.env.GROQ_API_KEY;

        if (!apiKey || apiKey === 'your_groq_api_key_here') {
            return NextResponse.json(
                { error: 'GROQ API key not configured' },
                { status: 500 }
            );
        }

        // Load all app data
        const appData = await loadAppData();

        // Build comprehensive system prompt with data
        const systemPrompt = buildSystemPrompt(appData);

        const response = await fetch(GROQ_API_URL, {
            method: 'POST',
            headers: {
                Authorization: `Bearer ${apiKey}`,
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                model: 'llama-3.3-70b-versatile',
                messages: [{ role: 'system', content: systemPrompt }, ...messages],
                temperature: 0.7,
                max_tokens: 2048,
                top_p: 0.9,
            }),
        });

        if (!response.ok) {
            const errorData = await response.json().catch(() => ({}));
            console.error('Groq API error:', errorData);
            return NextResponse.json(
                { error: 'Failed to get AI response' },
                { status: response.status }
            );
        }

        const data = await response.json();
        const aiMessage =
            data.choices?.[0]?.message?.content ||
            "Sorry, I couldn't generate a response.";

        return NextResponse.json({
            message: aiMessage,
            usage: data.usage,
        });
    } catch (error) {
        console.error('Chat API error:', error);
        return NextResponse.json(
            { error: 'Internal server error' },
            { status: 500 }
        );
    }
}
