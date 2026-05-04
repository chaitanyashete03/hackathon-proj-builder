// ══════════════════════════════════════════════════════════
// HackForge Code Synthesis Engine
// ══════════════════════════════════════════════════════════
import JSZip from 'jszip';
import { GoogleGenerativeAI } from '@google/generative-ai';
import { buildFilePrompt, type GenerateInput } from './prompts';

// Files to generate — in dependency order
export const FILES_TO_GENERATE = [
  'package.json',
  'tailwind.config.js',
  'app/globals.css',
  'app/layout.tsx',
  'components/Navbar.tsx',
  'components/Hero.tsx',
  'app/page.tsx',
  'README.md',
];

// Static boilerplate files that don't need AI generation
function getStaticFiles(input: GenerateInput): Record<string, string> {
  return {
    'postcss.config.js': `module.exports = { plugins: { tailwindcss: {}, autoprefixer: {} } };`,
    'next.config.js': `/** @type {import('next').NextConfig} */\nconst nextConfig = {};\nmodule.exports = nextConfig;`,
    'tsconfig.json': JSON.stringify({
      compilerOptions: {
        target: 'es5',
        lib: ['dom', 'dom.iterable', 'esnext'],
        allowJs: true,
        skipLibCheck: true,
        strict: true,
        noEmit: true,
        esModuleInterop: true,
        module: 'esnext',
        moduleResolution: 'bundler',
        resolveJsonModule: true,
        isolatedModules: true,
        jsx: 'preserve',
        incremental: true,
        plugins: [{ name: 'next' }],
        paths: { '@/*': ['./*'] }
      },
      include: ['next-env.d.ts', '**/*.ts', '**/*.tsx', '.next/types/**/*.ts'],
      exclude: ['node_modules']
    }, null, 2),
    '.gitignore': `# Dependencies\nnode_modules\n.pnp\n.pnp.js\n\n# Next.js\n.next/\nout/\n\n# Env\n.env\n.env.local\n.env.*.local\n\n# Debug\nnpm-debug.log*\n\n# Vercel\n.vercel\n\n# TypeScript\n*.tsbuildinfo\nnext-env.d.ts`,
    'app/favicon.ico': '', // placeholder
    '.env.example': `# Add your environment variables here\nNEXT_PUBLIC_APP_NAME=${input.projectName}`,
  };
}

export interface GenerationProgress {
  file: string;
  status: 'pending' | 'generating' | 'done' | 'error';
  index: number;
  total: number;
}

type ProgressCallback = (progress: GenerationProgress) => void;

// ── Main Generation Function ──────────────────────────────
export async function generateProject(
  input: GenerateInput,
  onProgress?: ProgressCallback
): Promise<{ files: Record<string, string>; zip: Buffer }> {
  const apiKey = process.env.GEMINI_API_KEY || '';
  const genAI = new GoogleGenerativeAI(apiKey);
  const model = genAI.getGenerativeModel({ 
    model: 'gemini-1.5-pro',
    generationConfig: {
      temperature: 0.8,
      maxOutputTokens: 8192,
    }
  });

  const generatedFiles: Record<string, string> = {};
  const total = FILES_TO_GENERATE.length;

  for (let i = 0; i < FILES_TO_GENERATE.length; i++) {
    const fileName = FILES_TO_GENERATE[i];
    
    onProgress?.({ file: fileName, status: 'generating', index: i, total });

    try {
      const prompt = buildFilePrompt(fileName, input, generatedFiles);
      const result = await model.generateContent(prompt);
      let content = result.response.text();
      
      // Strip markdown code fences if Gemini wraps them
      content = stripCodeFences(content);
      
      generatedFiles[fileName] = content;
      onProgress?.({ file: fileName, status: 'done', index: i, total });
    } catch (err) {
      console.error(`Failed generating ${fileName}:`, err);
      generatedFiles[fileName] = getFallbackContent(fileName, input);
      onProgress?.({ file: fileName, status: 'error', index: i, total });
    }
  }

  // Add static files
  const staticFiles = getStaticFiles(input);
  const allFiles = { ...generatedFiles, ...staticFiles };

  // Assemble ZIP
  const zip = new JSZip();
  for (const [path, content] of Object.entries(allFiles)) {
    if (content) zip.file(path, content);
  }
  
  // Add components folder placeholder
  zip.folder('components');
  zip.folder('app');

  const zipBuffer = await zip.generateAsync({ type: 'nodebuffer' });

  return { files: generatedFiles, zip: zipBuffer };
}

// ── Targeted File Refinement ──────────────────────────────
export async function refineFiles(
  feedback: string,
  existingFiles: Record<string, string>,
  input: GenerateInput,
  onProgress?: ProgressCallback
): Promise<Record<string, string>> {
  const apiKey = process.env.GEMINI_API_KEY || '';
  const genAI = new GoogleGenerativeAI(apiKey);
  const model = genAI.getGenerativeModel({ 
    model: 'gemini-1.5-pro',
    generationConfig: { temperature: 0.7, maxOutputTokens: 8192 }
  });

  // Determine which files need to be changed based on feedback keywords
  const filesToRefine = determineFilesToRefine(feedback, existingFiles);
  const refined: Record<string, string> = { ...existingFiles };
  const total = filesToRefine.length;

  for (let i = 0; i < filesToRefine.length; i++) {
    const fileName = filesToRefine[i];
    onProgress?.({ file: fileName, status: 'generating', index: i, total });

    try {
      const prompt = `You are refining code for ${input.projectName}.

User feedback: "${feedback}"

Current ${fileName}:
\`\`\`
${(existingFiles[fileName] || '').slice(0, 4000)}
\`\`\`

Design: ${input.designSystem.primaryColor}, ${input.designSystem.secondaryColor}, vibe: ${input.designSystem.vibe}

Apply the feedback. Return ONLY the complete updated file, no markdown fences, no explanation.`;

      const result = await model.generateContent(prompt);
      let content = result.response.text();
      content = stripCodeFences(content);
      refined[fileName] = content;
      onProgress?.({ file: fileName, status: 'done', index: i, total });
    } catch (err) {
      console.error(`Failed refining ${fileName}:`, err);
      onProgress?.({ file: fileName, status: 'error', index: i, total });
    }
  }

  return refined;
}

// ── Re-assemble ZIP from existing files ──────────────────
export async function buildZipFromFiles(files: Record<string, string>): Promise<Buffer> {
  const zip = new JSZip();
  for (const [path, content] of Object.entries(files)) {
    if (content && path !== 'app/favicon.ico') zip.file(path, content);
  }
  return zip.generateAsync({ type: 'nodebuffer' });
}

// ── Helpers ───────────────────────────────────────────────
function stripCodeFences(content: string): string {
  // Remove ```tsx, ```ts, ```js, ```css, ```json, ``` etc.
  return content
    .replace(/^```(?:tsx|ts|js|jsx|css|json|javascript|typescript|markdown|md|html)?\n/gm, '')
    .replace(/\n```$/gm, '')
    .replace(/^```\n/gm, '')
    .trim();
}

function determineFilesToRefine(feedback: string, files: Record<string, string>): string[] {
  const lower = feedback.toLowerCase();
  const toRefine: string[] = [];

  // Smart keyword mapping — only regenerate affected files
  if (lower.includes('color') || lower.includes('theme') || lower.includes('style') || lower.includes('design') || lower.includes('dark') || lower.includes('light')) {
    toRefine.push('app/globals.css', 'tailwind.config.js');
  }
  if (lower.includes('hero') || lower.includes('headline') || lower.includes('banner') || lower.includes('landing')) {
    toRefine.push('components/Hero.tsx', 'app/page.tsx');
  }
  if (lower.includes('nav') || lower.includes('header') || lower.includes('menu')) {
    toRefine.push('components/Navbar.tsx');
  }
  if (lower.includes('feature') || lower.includes('section') || lower.includes('layout') || lower.includes('page')) {
    toRefine.push('app/page.tsx');
  }
  if (lower.includes('font') || lower.includes('typography') || lower.includes('text')) {
    toRefine.push('app/globals.css', 'tailwind.config.js', 'app/layout.tsx');
  }
  if (lower.includes('button') || lower.includes('cta') || lower.includes('call to action')) {
    toRefine.push('app/page.tsx', 'components/Hero.tsx');
  }

  // Default: regenerate main page + hero if no specific match
  if (toRefine.length === 0) {
    toRefine.push('app/page.tsx', 'components/Hero.tsx');
  }

  // Deduplicate + only include files that exist
  return Array.from(new Set(toRefine)).filter(f => files[f] !== undefined || FILES_TO_GENERATE.includes(f));
}

function getFallbackContent(fileName: string, input: GenerateInput): string {
  const fallbacks: Record<string, string> = {
    'package.json': JSON.stringify({
      name: input.projectName.toLowerCase().replace(/\s+/g, '-'),
      version: '0.1.0',
      private: true,
      scripts: { dev: 'next dev', build: 'next build', start: 'next start' },
      dependencies: { next: '14.2.5', react: '^18', 'react-dom': '^18', 'framer-motion': '^11' },
      devDependencies: { typescript: '^5', tailwindcss: '^3.4.0', autoprefixer: '^10.0.1', postcss: '^8' }
    }, null, 2),
    'README.md': `# ${input.projectName}\n\n${input.tagline}\n\n${input.productVision}\n\n## Setup\n\n\`\`\`bash\nnpm install\nnpm run dev\n\`\`\``,
    'app/page.tsx': `export default function Home() { return <div className="min-h-screen bg-black text-white flex items-center justify-center"><h1 className="text-4xl font-bold">${input.projectName}</h1></div>; }`,
  };
  return fallbacks[fileName] || `// ${fileName} — generation failed, please regenerate`;
}
