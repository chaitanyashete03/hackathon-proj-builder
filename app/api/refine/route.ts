import { NextResponse } from 'next/server';
import { refineFiles, buildZipFromFiles } from '@/lib/generator';
import type { GenerateInput } from '@/lib/prompts';

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { feedback, existingFiles, researchData, topic, vibe, category } = body;

    if (!feedback || !existingFiles || !researchData) {
      return NextResponse.json(
        { error: 'Missing feedback, existingFiles, or researchData' },
        { status: 400 }
      );
    }

    const input: GenerateInput = {
      projectName: researchData.projectName,
      tagline: researchData.tagline,
      productVision: researchData.productVision,
      uniqueWowFactors: researchData.uniqueWowFactors,
      mvpFeatures: researchData.mvpFeatures,
      techStack: researchData.techStack,
      designSystem: researchData.designSystem,
      userPersonas: researchData.userPersonas,
      vibe: vibe || researchData.designSystem?.vibe || 'Glassmorphism',
      category: category || 'productivity',
      topic: topic || researchData.projectName,
    };

    // Streaming SSE response
    const encoder = new TextEncoder();
    const readable = new ReadableStream({
      async start(controller) {
        const send = (data: object) => {
          controller.enqueue(encoder.encode(`data: ${JSON.stringify(data)}\n\n`));
        };

        try {
          const refined = await refineFiles(feedback, existingFiles, input, (progress) => {
            send({ type: 'progress', ...progress });
          });

          const zip = await buildZipFromFiles(refined);
          const zipBase64 = Buffer.from(zip).toString('base64');

          send({ type: 'complete', files: refined, zipBase64 });
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
  } catch (error) {
    console.error('Refine route error:', error);
    return NextResponse.json({ error: 'Refinement failed', detail: String(error) }, { status: 500 });
  }
}
