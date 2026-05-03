import { GoogleGenerativeAI } from "@google/generative-ai";

const MOCK_GEMINI_RESPONSE = `
Based on the input "Mental health support for remote teams", here is the AI strategy:
1. Pain Points: Isolation, burnout, lack of boundary between work and life.
2. Target Audience: Remote workers, HR managers.
3. Solution: An async check-in bot with AI-driven sentiment analysis and private nudges.
4. Stack: Next.js, Supabase, Tailwind, Gemini for sentiment.
`;

export async function generateContent(prompt: string): Promise<string> {
  const apiKey = process.env.GEMINI_API_KEY || "";
  
  if (!apiKey || apiKey === "mock-gemini-key") {
    console.warn("Using mock Gemini response (API key missing or mock)");
    // Small delay to simulate network
    await new Promise(res => setTimeout(res, 800));
    return MOCK_GEMINI_RESPONSE;
  }

  try {
    const genAI = new GoogleGenerativeAI(apiKey);
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-pro" });
    const result = await model.generateContent(prompt);
    const response = await result.response;
    return response.text();
  } catch (error) {
    console.error("Gemini API failed, falling back to mock.", error);
    return MOCK_GEMINI_RESPONSE;
  }
}
