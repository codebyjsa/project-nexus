/**
 * AI Mail Summarizer using Groq API
 * Provides intelligent email parsing, categorization, and summarization
 */

const GROQ_API_URL = 'https://api.groq.com/openai/v1/chat/completions';

/**
 * Summarize an email using Groq AI
 * @param {string} emailContent - The full email content to summarize
 * @param {string} subject - Email subject (optional)
 * @returns {Object} Summarized email data
 */
export async function summarizeEmail(emailContent, subject = '') {
    const apiKey = process.env.GROQ_API_KEY;

    if (!apiKey) {
        throw new Error('GROQ_API_KEY not configured');
    }

    const systemPrompt = `You are an intelligent email summarizer for college students. Your job is to:
1. Extract the key information from emails
2. Categorize them (academic, event, urgent, general)
3. Assign priority (1-5, where 5 is highest)
4. Extract any deadlines mentioned
5. List actionable items
6. Analyze sentiment (positive, negative, neutral)

Respond ONLY with a valid JSON object in this exact format:
{
  "summary": "One-sentence summary of the email (max 150 characters)",
  "category": "academic|event|urgent|general",
  "priority": 1-5,
  "deadlines": [{"date": "YYYY-MM-DD", "description": "deadline description"}],
  "actionItems": ["action 1", "action 2"],
  "sentiment": "positive|negative|neutral",
  "keyPoints": ["key point 1", "key point 2"]
}

Rules:
- Be concise and actionable
- Extract actual dates and convert to YYYY-MM-DD format
- Priority 5 = urgent/deadline today/tomorrow, 4 = within a week, 3 = within a month, 2 = informational, 1 = low priority
- Categorize as "urgent" if words like URGENT, IMPORTANT, ASAP, DEADLINE appear
- Maximum 3 action items, maximum 4 key points
- Keep summary under 150 characters`;

    const userPrompt = subject
        ? `Subject: ${subject}\n\nEmail Content:\n${emailContent}`
        : `Email Content:\n${emailContent}`;

    try {
        const response = await fetch(GROQ_API_URL, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${apiKey}`,
            },
            body: JSON.stringify({
                model: 'llama-3.3-70b-versatile',
                messages: [
                    { role: 'system', content: systemPrompt },
                    { role: 'user', content: userPrompt }
                ],
                temperature: 0.3,
                max_tokens: 500,
                response_format: { type: 'json_object' }
            }),
        });

        if (!response.ok) {
            const error = await response.json();
            throw new Error(error.error?.message || 'Groq API error');
        }

        const data = await response.json();
        const content = data.choices[0]?.message?.content;

        if (!content) {
            throw new Error('No response from AI');
        }

        // Parse the JSON response
        const parsed = JSON.parse(content);

        // Validate and sanitize the response
        return {
            summary: parsed.summary || 'Unable to summarize',
            category: ['academic', 'event', 'urgent', 'general'].includes(parsed.category)
                ? parsed.category
                : 'general',
            priority: Math.min(5, Math.max(1, parseInt(parsed.priority) || 3)),
            deadlines: Array.isArray(parsed.deadlines) ? parsed.deadlines.slice(0, 5) : [],
            actionItems: Array.isArray(parsed.actionItems) ? parsed.actionItems.slice(0, 3) : [],
            sentiment: ['positive', 'negative', 'neutral'].includes(parsed.sentiment)
                ? parsed.sentiment
                : 'neutral',
            keyPoints: Array.isArray(parsed.keyPoints) ? parsed.keyPoints.slice(0, 4) : [],
        };
    } catch (error) {
        console.error('AI Summarization error:', error);
        throw error;
    }
}

/**
 * Batch summarize multiple emails
 * @param {Array} emails - Array of email objects with content and subject
 * @returns {Array} Array of summarized email data
 */
export async function batchSummarize(emails) {
    const results = await Promise.allSettled(
        emails.map(email => summarizeEmail(email.content, email.subject))
    );

    return results.map((result, index) => ({
        originalEmail: emails[index],
        success: result.status === 'fulfilled',
        data: result.status === 'fulfilled' ? result.value : null,
        error: result.status === 'rejected' ? result.reason.message : null,
    }));
}

/**
 * Extract quick insights from email without full AI processing
 * Useful for initial categorization before detailed analysis
 * @param {string} emailContent - Email content
 * @returns {Object} Quick insights
 */
export function quickAnalysis(emailContent) {
    const lowerContent = emailContent.toLowerCase();

    // Quick category detection
    const urgentKeywords = ['urgent', 'asap', 'immediately', 'deadline', 'important', 'reminder'];
    const academicKeywords = ['exam', 'assignment', 'grade', 'course', 'semester', 'lecture', 'professor', 'class'];
    const eventKeywords = ['event', 'fest', 'celebration', 'registration', 'workshop', 'seminar', 'competition'];

    let category = 'general';
    if (urgentKeywords.some(k => lowerContent.includes(k))) {
        category = 'urgent';
    } else if (academicKeywords.some(k => lowerContent.includes(k))) {
        category = 'academic';
    } else if (eventKeywords.some(k => lowerContent.includes(k))) {
        category = 'event';
    }

    // Quick date extraction (simple patterns)
    const datePatterns = [
        /(\d{1,2})[\/\-](\d{1,2})[\/\-](\d{4}|\d{2})/g,
        /(january|february|march|april|may|june|july|august|september|october|november|december)\s+\d{1,2}/gi,
        /\d{1,2}\s+(january|february|march|april|may|june|july|august|september|october|november|december)/gi,
    ];

    const foundDates = [];
    datePatterns.forEach(pattern => {
        const matches = emailContent.match(pattern);
        if (matches) foundDates.push(...matches);
    });

    // Word count for priority estimation
    const wordCount = emailContent.split(/\s+/).length;
    const estimatedReadTime = Math.ceil(wordCount / 200); // avg reading speed

    return {
        category,
        hasUrgentMarkers: category === 'urgent',
        foundDates: [...new Set(foundDates)].slice(0, 5),
        wordCount,
        estimatedReadTime: `${estimatedReadTime} min`,
    };
}
