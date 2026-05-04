import { NextResponse } from 'next/server';
import { generateProject, buildZipFromFiles, type GenerationProgress } from '@/lib/generator';
import type { GenerateInput } from '@/lib/prompts';

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { researchData, topic, vibe, category, stream = false } = body;

    if (!researchData) {
      return NextResponse.json({ error: 'Missing researchData — run research first' }, { status: 400 });
    }

    const input: GenerateInput = {
      projectName: researchData.projectName || 'HackProject',
      tagline: researchData.tagline || 'Built at thought speed',
      productVision: researchData.productVision || '',
      uniqueWowFactors: researchData.uniqueWowFactors || [],
      mvpFeatures: researchData.mvpFeatures || [],
      techStack: researchData.techStack || {},
      designSystem: researchData.designSystem || {
        primaryColor: '#6C3AED',
        secondaryColor: '#0A0A1A',
        accentColor: '#FF3D71',
        fontPair: ['Space Grotesk', 'Inter'],
        vibe: 'Glassmorphism',
        componentStyle: 'Glassmorphic cards on deep dark background',
      },
      userPersonas: researchData.userPersonas || [],
      vibe: vibe || researchData.designSystem?.vibe || 'Glassmorphism',
      category: category || 'productivity',
      topic: topic || researchData.projectName,
    };

    if (stream) {
      // ── Streaming mode — returns progress SSE ──────────
      const encoder = new TextEncoder();
      const readable = new ReadableStream({
        async start(controller) {
          const send = (data: object) => {
            controller.enqueue(encoder.encode(`data: ${JSON.stringify(data)}\n\n`));
          };

          try {
            const { files, zip } = await generateProject(input, (progress: GenerationProgress) => {
              send({ type: 'progress', ...progress });
            });

            // Encode zip as base64 to send over SSE
            const zipBase64 = Buffer.from(zip).toString('base64');
            send({ type: 'complete', files, zipBase64 });
          } catch (err) {
            send({ type: 'error', message: String(err) });
          } finally {
            controller.close();
          }
        },
      });

      return new Response(readable, {
        headers: {
          'Content-Type': 'text/event-stream',
          'Cache-Control': 'no-cache',
          Connection: 'keep-alive',
        },
      });
    } else {
      // ── Non-streaming mode — waits for full completion ──
      const { files, zip } = await generateProject(input);

      return NextResponse.json({
        success: true,
        files,
        zipBase64: Buffer.from(zip).toString('base64'),
        projectName: input.projectName,
      });
    }
  } catch (error) {
    console.error('Generate route error:', error);
    return NextResponse.json({ error: 'Generation failed', detail: String(error) }, { status: 500 });
  }
}
