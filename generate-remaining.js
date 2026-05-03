const fs = require('fs');
const path = require('path');

const write = (file, content) => {
  fs.mkdirSync(path.dirname(file), { recursive: true });
  fs.writeFileSync(file, content.trim() + '\n');
};

write('tsconfig.json', `{
  "compilerOptions": {
    "target": "es5", "lib": ["dom", "dom.iterable", "esnext"], "allowJs": true,
    "skipLibCheck": true, "strict": true, "noEmit": true, "esModuleInterop": true,
    "module": "esnext", "moduleResolution": "bundler", "resolveJsonModule": true,
    "isolatedModules": true, "jsx": "preserve", "incremental": true,
    "plugins": [{ "name": "next" }],
    "paths": { "@/*": ["./*"] }
  },
  "include": ["next-env.d.ts", "**/*.ts", "**/*.tsx", ".next/types/**/*.ts"],
  "exclude": ["node_modules"]
}`);

write('tailwind.config.js', `
/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./app/**/*.{ts,tsx}", "./components/**/*.{ts,tsx}"],
  theme: { extend: {} },
  plugins: [],
};`);

write('next.config.js', `
/** @type {import('next').NextConfig} */
const nextConfig = {};
module.exports = nextConfig;
`);

write('app/layout.tsx', `
import './globals.css';
import { Inter } from 'next/font/google';
const inter = Inter({ subsets: ['latin'] });
export const metadata = { title: 'HackForge', description: 'Ultimate Project Builder' };
export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (<html lang="en"><body className={inter.className + " bg-slate-950 text-white min-h-screen"}>{children}</body></html>);
}
`);

write('app/globals.css', `@tailwind base;\n@tailwind components;\n@tailwind utilities;`);

write('app/research/page.tsx', `export default function Research() { return <div className="p-10">Research Phase</div>; }`);
write('app/designer/page.tsx', `export default function Designer() { return <div className="p-10">Design Phase</div>; }`);
write('app/flow/page.tsx', `export default function Flow() { return <div className="p-10">Flow Phase</div>; }`);
write('app/builder/page.tsx', `export default function Builder() { return <div className="p-10">Builder Phase</div>; }`);

write('app/api/design/route.ts', `import { NextResponse } from 'next/server'; export async function POST() { return NextResponse.json({ success: true }); }`);
write('app/api/ux/route.ts', `import { NextResponse } from 'next/server'; export async function POST() { return NextResponse.json({ success: true }); }`);
write('app/api/deploy/route.ts', `import { NextResponse } from 'next/server'; export async function POST() { return NextResponse.json({ url: '/mock-download.zip' }); }`);

write('supabase/migrations/01_initial.sql', `
CREATE TABLE projects ( id UUID PRIMARY KEY DEFAULT uuid_generate_v4(), title TEXT, created_at TIMESTAMPTZ DEFAULT NOW() );
`);

write('components/ui/card.tsx', `
import * as React from "react"
import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"
export function cn(...inputs: ClassValue[]) { return twMerge(clsx(inputs)) }
export function Card({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) {
  return <div className={cn("rounded-xl border border-white/10 bg-black/40 backdrop-blur-md shadow-sm text-white", className)} {...props} />
}
`);
console.log("Boilerplate generated successfully.");
