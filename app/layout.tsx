import './globals.css';
import { Inter, Space_Grotesk } from 'next/font/google';

const inter = Inter({ subsets: ['latin'], variable: '--font-inter' });
const space = Space_Grotesk({ subsets: ['latin'], variable: '--font-space' });

export const metadata = { title: 'HackForge', description: 'Ultimate Project Builder' };

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${inter.variable} ${space.variable} dark`}>
      <body className="bg-[#050505] text-gray-100 min-h-screen font-sans antialiased selection:bg-purple-500/30">
        {children}
      </body>
    </html>
  );
}
