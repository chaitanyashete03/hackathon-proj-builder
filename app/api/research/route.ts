import { NextResponse } from 'next/server';
import { GoogleGenerativeAI } from '@google/generative-ai';
import { buildResearchPrompt } from '@/lib/prompts';
import { retry } from '@/lib/retry';

// ── Tavily multi-query search ─────────────────────────────
async function searchTavily(query: string): Promise<string> {
  const apiKey = process.env.TAVILY_API_KEY || '';
  if (!apiKey || apiKey === 'tvly-mock-key') {
    return `[Mock search result for: ${query}] — Key competitors include established players with mediocre UX. Major gap: no AI-powered solution exists. Users report frustration with current tools.`;
  }

  try {
    const res = await fetch('https://api.tavily.com/search', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ api_key: apiKey, query, search_depth: 'advanced', max_results: 5 }),
    });
    const data = await res.json();
    return (data.results || [])
      .map((r: { title: string; content: string; url: string }) => `[${r.title}]\n${r.content}\nSource: ${r.url}`)
      .join('\n\n');
  } catch {
    return `[Search failed for: ${query}]`;
  }
}

export async function POST(req: Request) {
  try {
    const { topic, vibe = 'Glassmorphism', category = 'productivity' } = await req.json();

    if (!topic || typeof topic !== 'string') {
      return NextResponse.json({ error: 'Missing topic' }, { status: 400 });
    }

    // 5 parallel search queries for deep intelligence
    const queries = [
      `Best ${category} apps 2024 market leaders features`,
      `${topic} user pain points problems frustrations`,
      `${topic} startup ideas unique differentiators`,
      `${category} app tech stack architecture 2024`,
      `award-winning ${category} UI design patterns Awwwards`,
    ];

    const searchResults = await Promise.all(queries.map(q => retry(() => searchTavily(q))));
    const combinedResults = searchResults
      .map((r, i) => `=== Query ${i + 1}: ${queries[i]} ===\n${r}`)
      .join('\n\n');

    // AI Synthesis
    const apiKey = process.env.GEMINI_API_KEY || '';
    const genAI = new GoogleGenerativeAI(apiKey);
    const model = genAI.getGenerativeModel({
      model: 'gemini-1.5-pro',
      generationConfig: { temperature: 0.9, maxOutputTokens: 4096 },
    });

    const prompt = buildResearchPrompt({ topic, vibe, category, searchResults: combinedResults });
    const result = await model.generateContent(prompt);
    let rawText = result.response.text();

    // Strip markdown code fences if present
    rawText = rawText.replace(/^```(?:json)?\n?/m, '').replace(/\n?```$/m, '').trim();

    let synthesized: Record<string, unknown>;
    try {
      synthesized = JSON.parse(rawText);
    } catch {
      // If JSON parse fails, return a structured fallback
      synthesized = {
        projectName: topic.split(' ').slice(0, 2).join('') + 'AI',
        tagline: `The smarter way to ${topic.split(' ')[0].toLowerCase()}`,
        productVision: `A next-generation ${category} tool that uses AI to solve ${topic}.`,
        uniqueWowFactors: [
          'AI-powered intelligent suggestions that learn from user behavior',
          'Real-time collaboration with conflict-free sync',
          'One-click deployment to any cloud provider',
          'Built-in analytics dashboard with actionable insights',
          'Voice-controlled interface for hands-free operation',
        ],
        userPersonas: [
          { name: 'Alex', role: 'Product Manager', painPoint: 'Too much time spent on manual tasks' },
          { name: 'Sarah', role: 'Developer', painPoint: 'Poor tooling slows down iteration speed' },
          { name: 'Mike', role: 'Designer', painPoint: 'Disconnected tools break creative flow' },
        ],
        mvpFeatures: [
          'Smart onboarding with AI goal detection',
          'Real-time collaboration canvas',
          'AI analysis and recommendations engine',
          'One-click export to multiple formats',
          'Team workspace with role-based access',
          'Automated weekly progress reports',
        ],
        techStack: {
          frontend: 'Next.js 14 + Framer Motion + Tailwind CSS',
          backend: 'Supabase (Auth + Postgres + Realtime)',
          ai: 'Gemini 1.5 Pro',
          deployment: 'Vercel',
          justification: 'This stack enables rapid iteration with built-in realtime and AI capabilities.',
        },
        designSystem: {
          primaryColor: '#6C3AED',
          secondaryColor: '#0A0A1A',
          accentColor: '#FF3D71',
          fontPair: ['Space Grotesk', 'Inter'],
          vibe,
          componentStyle: 'Glassmorphic cards with gradient borders on deep void black background',
        },
        competitorGaps: [
          'No competitor offers true AI-native workflow automation',
          'All existing tools require too much manual setup',
          'None have a mobile-first collaborative experience',
        ],
      };
    }

    return NextResponse.json({ success: true, data: synthesized });
  } catch (error) {
    console.error('Research route error:', error);
    return NextResponse.json({ error: 'Research failed' }, { status: 500 });
  }
}
