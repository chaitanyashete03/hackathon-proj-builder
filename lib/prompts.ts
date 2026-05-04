// ══════════════════════════════════════════════════════════
// HackForge Prompt Library — The Brain of the System
// ══════════════════════════════════════════════════════════

export interface ResearchInput {
  topic: string;
  vibe: string;
  category: string;
  searchResults: string;
}

export interface GenerateInput {
  projectName: string;
  tagline: string;
  productVision: string;
  uniqueWowFactors: string[];
  mvpFeatures: string[];
  techStack: Record<string, string>;
  designSystem: {
    primaryColor: string;
    secondaryColor: string;
    accentColor: string;
    fontPair: [string, string];
    vibe: string;
    componentStyle: string;
  };
  userPersonas: Array<{ name: string; role: string; painPoint: string }>;
  vibe: string;
  category: string;
  topic: string;
}

export interface RefineInput extends GenerateInput {
  feedback: string;
  existingFiles: Record<string, string>;
}

// ── Research Synthesis Prompt ──────────────────────────────
export function buildResearchPrompt(input: ResearchInput): string {
  return `You are a world-class product strategist, Y-Combinator partner, and Awwwards judge combined.

A founder has an idea: "${input.topic}"
Category: ${input.category}
Design Vibe they want: ${input.vibe}

Here is real market research gathered for you:
${input.searchResults}

Your job: Synthesize all of this into a PRECISE JSON object. Be SPECIFIC, not generic.
Do NOT say things like "modern UI" or "user-friendly" — be concrete and innovative.

Return ONLY valid JSON (no markdown, no explanation):
{
  "projectName": "catchy brandable name under 2 words",
  "tagline": "under 10 words, punchy and memorable",
  "productVision": "2-sentence product vision that would excite a VC",
  "uniqueWowFactors": [
    "Specific wow feature 1 — concrete, not generic",
    "Specific wow feature 2",
    "Specific wow feature 3",
    "Specific wow feature 4",
    "Specific wow feature 5"
  ],
  "userPersonas": [
    { "name": "First Name", "role": "Job Title", "painPoint": "Specific problem they face" },
    { "name": "First Name", "role": "Job Title", "painPoint": "Specific problem they face" },
    { "name": "First Name", "role": "Job Title", "painPoint": "Specific problem they face" }
  ],
  "mvpFeatures": [
    "Feature 1 — buildable in 48h, concrete description",
    "Feature 2",
    "Feature 3",
    "Feature 4",
    "Feature 5",
    "Feature 6"
  ],
  "techStack": {
    "frontend": "e.g. Next.js 14 App Router + Framer Motion",
    "backend": "e.g. Supabase (Auth + Postgres + Realtime)",
    "ai": "e.g. Gemini 1.5 Pro for analysis",
    "deployment": "Vercel",
    "justification": "2 sentence justification for this specific product"
  },
  "designSystem": {
    "primaryColor": "#HEX — choose something specific and bold for this niche",
    "secondaryColor": "#HEX — complementary",
    "accentColor": "#HEX — for CTAs and highlights",
    "fontPair": ["Display font name from Google Fonts", "Body font name from Google Fonts"],
    "vibe": "${input.vibe}",
    "componentStyle": "describe the visual style in 1 sentence (e.g. 'Glassmorphic cards with neon borders on deep black')"
  },
  "competitorGaps": [
    "Gap 1 — what no competitor does well that this can own",
    "Gap 2",
    "Gap 3"
  ]
}`;
}

// ── Code Generation Prompt per File ───────────────────────
export function buildFilePrompt(fileName: string, input: GenerateInput, allFiles: Record<string, string>): string {
  const context = Object.keys(allFiles).length > 0
    ? `\n\nAlready generated files for context:\n${Object.entries(allFiles).map(([f, c]) => `// ${f}\n${c.slice(0, 300)}...`).join('\n\n')}`
    : '';

  const sharedContext = `
Project: ${input.projectName} — "${input.tagline}"
Vision: ${input.productVision}
Category: ${input.category}
Vibe: ${input.vibe}

Design System:
- Primary: ${input.designSystem.primaryColor}
- Secondary: ${input.designSystem.secondaryColor}  
- Accent: ${input.designSystem.accentColor}
- Fonts: ${input.designSystem.fontPair.join(' + ')}
- Style: ${input.designSystem.componentStyle}

WOW Factors to show:
${input.uniqueWowFactors.map((f, i) => `${i + 1}. ${f}`).join('\n')}

MVP Features to build:
${input.mvpFeatures.map((f, i) => `${i + 1}. ${f}`).join('\n')}

Tech Stack: ${JSON.stringify(input.techStack)}
${context}`;

  const filePrompts: Record<string, string> = {
    'app/globals.css': `${sharedContext}

Generate a complete globals.css that:
1. Imports the Google Fonts: ${input.designSystem.fontPair.join(' and ')}
2. Sets up CSS custom properties using the exact design system colors
3. Sets body background to a dark void variant of the primary color
4. Includes: glass card utility, shimmer animation, gradient text utility
5. Tailwind @layer base, components, utilities
Style: ${input.designSystem.componentStyle}

Return ONLY the CSS file content, no explanation.`,

    'tailwind.config.js': `${sharedContext}

Generate a complete tailwind.config.js with:
1. Custom colors: primary (${input.designSystem.primaryColor}), secondary (${input.designSystem.secondaryColor}), accent (${input.designSystem.accentColor})
2. Font families for: display: ['${input.designSystem.fontPair[0]}'], sans: ['${input.designSystem.fontPair[1]}']
3. Custom animations: float, shimmer, pulse-glow
4. Dark mode: 'class'
5. Content paths for Next.js

Return ONLY the JS file content, no explanation.`,

    'app/layout.tsx': `${sharedContext}

Generate app/layout.tsx that:
1. Imports both Google Fonts: ${input.designSystem.fontPair.join(' and ')} using next/font/google
2. Sets proper metadata: title="${input.projectName}", description="${input.tagline}"
3. Applies font variables to body
4. Dark background matching the design system

Return ONLY the TSX file content, no explanation.`,

    'app/page.tsx': `${sharedContext}

Generate a STUNNING complete landing page for ${input.projectName}.
This is a ${input.vibe} styled ${input.category} product.

Must include these sections:
1. Hero — "${input.tagline}" as headline, product vision as sub, 2 CTAs
2. Wow Factors section — showcase all 5 unique features with icons
3. How It Works — 3-step process
4. User Personas — cards for each persona showing their pain point solved
5. Features Grid — all 6 MVP features in a bento grid
6. CTA Section — final conversion

Technical requirements:
- Use 'use client' directive
- Framer Motion for animations (motion.div, useInView, stagger)
- Custom CSS classes from globals.css
- Exact hex colors from the design system
- No placeholder images — use gradient/SVG visuals
- Mobile responsive

Return ONLY the TSX file content, no explanation.`,

    'components/Navbar.tsx': `${sharedContext}

Generate a premium Navbar component for ${input.projectName} that:
1. Shows logo (text-based, uses primary color gradient)
2. Navigation links: Features, How It Works, Personas, Get Started
3. Glass morphism background on scroll
4. CTA button in accent color
5. Mobile hamburger menu
6. Smooth scroll behavior

Return ONLY the TSX file content with 'use client', no explanation.`,

    'components/Hero.tsx': `${sharedContext}

Generate a jaw-dropping Hero section for ${input.projectName} with:
1. "${input.tagline}" as the main h1 (huge, gradient text)
2. "${input.productVision}" as subtitle
3. Two CTA buttons — primary and ghost
4. Animated background (CSS gradients + subtle particles using CSS)
5. A floating mock UI card showing the product in action
6. Scroll indicator
7. Trust badges: "Built at a Hackathon", "Open Source", "Zero Setup"

Style: ${input.designSystem.componentStyle}
Colors: Primary ${input.designSystem.primaryColor}, Accent ${input.designSystem.accentColor}

Return ONLY the TSX file content with 'use client', no explanation.`,

    'package.json': `${sharedContext}

Generate a complete package.json for a Next.js 14 project called "${input.projectName.toLowerCase().replace(/\s+/g, '-')}":
{
  "name": "${input.projectName.toLowerCase().replace(/\s+/g, '-')}",
  "version": "0.1.0",
  "private": true,
  "scripts": { "dev": "next dev", "build": "next build", "start": "next start" },
  "dependencies": {
    "next": "14.2.5",
    "react": "^18",
    "react-dom": "^18",
    "framer-motion": "^11",
    "lucide-react": "^0.400.0",
    "clsx": "^2.1.0",
    "tailwind-merge": "^2.3.0"
  },
  "devDependencies": {
    "typescript": "^5",
    "@types/node": "^20",
    "@types/react": "^18",
    "tailwindcss": "^3.4.0",
    "autoprefixer": "^10.0.1",
    "postcss": "^8"
  }
}

Return ONLY the JSON content, no explanation.`,

    'README.md': `${sharedContext}

Generate a professional README.md for ${input.projectName} that includes:
1. Project name + tagline as header
2. What it is (product vision)
3. Key features (wow factors list)
4. Tech stack table
5. Quick setup: git clone, npm install, npm run dev
6. Project structure
7. Built with HackForge badge

Return ONLY the markdown content, no explanation.`,
  };

  return filePrompts[fileName] || `Generate the file ${fileName} for the project ${input.projectName}. ${sharedContext}`;
}

// ── Refinement Prompt ─────────────────────────────────────
export function buildRefinePrompt(
  fileName: string,
  currentContent: string,
  feedback: string,
  input: GenerateInput
): string {
  return `You are refining code for ${input.projectName} (${input.tagline}).

The user's feedback: "${feedback}"

Current file (${fileName}):
\`\`\`
${currentContent.slice(0, 3000)}
\`\`\`

Design system:
- Colors: primary ${input.designSystem.primaryColor}, secondary ${input.designSystem.secondaryColor}, accent ${input.designSystem.accentColor}
- Fonts: ${input.designSystem.fontPair.join(', ')}
- Vibe: ${input.designSystem.vibe}

Apply the user's feedback to improve this file. Make targeted, specific improvements.
Keep all existing structure, only change what the feedback asks for.

Return ONLY the complete updated file content, no explanation.`;
}
