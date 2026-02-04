'use server';

import { GoogleGenerativeAI } from '@google/generative-ai';
import { createClient } from '@supabase/supabase-js';
import { WeatherService } from '@tbh-beekeeper/shared';

// Initialize Supabase Client for Server Action
// We need to use process.env vars directly here
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

// Update getSupabase to accept an optional access token
function getSupabase(accessToken?: string) {
    const options: any = {};

    if (accessToken) {
        options.global = {
            headers: {
                Authorization: `Bearer ${accessToken}`,
            },
        };
    }

    return createClient(supabaseUrl, supabaseKey, options);
}

export interface AIResponse {
    answer?: string;
    error?: string;
    clarificationNeeded?: boolean;
}

export async function askBeekeepingAI(
    userId: string,
    question: string,
    apiaryId: string,
    accessToken: string
): Promise<AIResponse> {
    try {
        const apiKey = process.env.GOOGLE_GENERATIVE_AI_API_KEY;
        if (!apiKey) {
            console.error('Missing GOOGLE_GENERATIVE_AI_API_KEY');
            return { error: 'AI Service is currently unavailable (Configuration Error).' };
        }

        if (accessToken) {
            console.log('AI Action: Access Token received');
        } else {
            console.log('AI Action: NO Access Token received');
        }

        // Initialize user-scoped Supabase client
        const supabase = getSupabase(accessToken);

        // 1. Fetch Context: Apiary (Location)
        const { data: apiary, error: apiaryError } = await supabase
            .from('apiaries')
            .select('*')
            .eq('id', apiaryId)
            .single();

        if (apiaryError || !apiary) {
            console.error('AI Action: Fetch Apiary Error', apiaryError);
            return { error: 'Could not fetch Apiary location context. ' + (apiaryError?.message || '') };
        }

        // 2. Fetch Context: Hives (Types)
        const { data: hives } = await supabase
            .from('hives')
            .select('name, type')
            .eq('apiary_id', apiaryId);

        const uniqueHiveTypes = Array.from(new Set(hives?.map(h => h.type) || []));

        // 3. Derive Weather/Season Context
        let weatherContext = "Location coordinates: N/A";
        if (apiary.latitude && apiary.longitude) {
            // We won't make a live weather call here to save time/latency, 
            // but we can approximate season based on Date and Latitude (North/South hemisphere).
            const month = new Date().getMonth() + 1; // 1-12
            const isNorth = apiary.latitude > 0;
            // Simple season logic
            let season = 'Unknown';
            if (isNorth) {
                if (month >= 3 && month <= 5) season = 'Spring';
                else if (month >= 6 && month <= 8) season = 'Summer';
                else if (month >= 9 && month <= 11) season = 'Autumn';
                else season = 'Winter';
            } else {
                if (month >= 3 && month <= 5) season = 'Autumn';
                else if (month >= 6 && month <= 8) season = 'Winter';
                else if (month >= 9 && month <= 11) season = 'Spring';
                else season = 'Summer';
            }
            weatherContext = `Location: ${apiary.zip_code || 'Lat/Lng provided'}. Estimated Season: ${season}.`;
        }

        // 4. Construct Prompt
        const systemPrompt = `
You are an expert beekeeping assistant for the 'BeekTools' application.
Goal: Answer the user's beekeeping question concisely and accurately.

CONTEXT:
${weatherContext}
User's Hive Types in this Apiary: ${uniqueHiveTypes.join(', ') || 'None specified'}.

RULES:
1. If the question is NOT related to beekeeping, bees, hives, or apiary management, politely decline to answer.
2. Context Awareness: Use the location/season context to tailor your advice (e.g., feeding advice differs in Winter vs Spring).
3. Hive Type Awareness: If the advice depends heavily on hive type (e.g. "adding a super") and the user has multiple incompatible types (e.g. Top Bar vs Langstroth) and didn't specify which one, ask for clarification.
4. Formatting: Use Markdown (bolding, lists) for readability. Keep it under 200 words if possible.
`;

        const userPrompt = `Question: ${question}`;

        // 5. Call Gemini
        const genAI = new GoogleGenerativeAI(apiKey);
        // Fallback to gemini-pro which is generally available on free tier v1beta
        const model = genAI.getGenerativeModel({ model: "gemini-pro" });

        const result = await model.generateContent([
            systemPrompt,
            userPrompt
        ]);

        const response = result.response;
        const answer = response.text();

        // 6. Save to History
        if (userId) {
            await supabase.from('ai_qa_history').insert({
                user_id: userId,
                question_original: question,
                answer: answer,
                context_data: {
                    apiary_id: apiaryId,
                    hive_types: uniqueHiveTypes,
                    weather_context: weatherContext
                }
            });
        }

        return { answer };

    } catch (error: any) {
        console.error('AI Action Error:', error);

        // Handle Rate Limits
        if (error.message?.includes('429') || error.status === 429) {
            return { error: 'The hive is busy (Rate Limit Reached). Please try again in a minute.' };
        }

        return { error: 'Failed to process request: ' + (error.message || 'Unknown error') };
    }
}
