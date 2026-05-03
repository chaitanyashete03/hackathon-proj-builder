import { NextResponse } from 'next/server';
import { generateContent } from '@/lib/gemini';
import { performSearch } from '@/lib/tavily';
import { retry } from '@/lib/retry';

export async function POST(req: Request) {
  try {
    const { topic } = await req.json();
    if (!topic || typeof topic !== 'string') {
      return NextResponse.json({ error: "Missing topic" }, { status: 400 });
    }

    // Run search and generation in parallel with retry logic
    const [searchResults, aiAnalysis] = await Promise.all([
      retry(() => performSearch(`Market research and competitors for: ${topic}`)),
      retry(() => generateContent(`Act as a product strategist. Create a brief product strategy for: ${topic}`))
    ]);

    return NextResponse.json({
      success: true,
      data: {
        analysis: aiAnalysis,
        sources: searchResults
      }
    });
  } catch (error) {
    console.error("Research route error:", error);
    return NextResponse.json({ error: "Failed to process research" }, { status: 500 });
  }
}
