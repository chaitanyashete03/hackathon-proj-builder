import { NextResponse } from 'next/server';
import JSZip from 'jszip';

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const zip = new JSZip();
    
    // Add some boilerplate files to simulate generation
    zip.file("package.json", JSON.stringify({
      name: "generated-startup",
      version: "1.0.0",
      dependencies: { "next": "14.2.5", "react": "18.3.1" }
    }, null, 2));
    zip.file("README.md", `# Generated Project\n\nBased on: ${body.topic || "HackForge"}`);
    zip.file("app/page.tsx", `export default function Home() { return <div>Hello Startup</div> }`);

    const zipBuffer = await zip.generateAsync({ type: 'nodebuffer' });

    return new NextResponse(zipBuffer, {
      status: 200,
      headers: {
        'Content-Type': 'application/zip',
        'Content-Disposition': 'attachment; filename="hackforge-project.zip"'
      }
    });
  } catch (error) {
    console.error("Generate route error:", error);
    return NextResponse.json({ error: "Generation failed" }, { status: 500 });
  }
}
