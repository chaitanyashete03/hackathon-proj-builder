import './globals.css';
import { Inter, Space_Grotesk, JetBrains_Mono } from 'next/font/google';

const inter = Inter({ 
  subsets: ['latin'], 
  variable: '--font-inter',
  display: 'swap',
});

const spaceGrotesk = Space_Grotesk({ 
  subsets: ['latin'], 
  variable: '--font-space',
  display: 'swap',
});

const jetbrainsMono = JetBrains_Mono({
  subsets: ['latin'],
  variable: '--font-mono',
  display: 'swap',
});

export const metadata = { 
  title: 'HackForge — Build Hackathon Projects at Thought Speed',
  description: 'AI-powered hackathon project builder with real-time collaboration, intelligent research, and automatic code generation. From idea to deployed project in minutes.',
  themeColor: '#05050A',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${inter.variable} ${spaceGrotesk.variable} ${jetbrainsMono.variable} dark`}>
      <body className="bg-void-black text-text-primary min-h-screen font-sans antialiased">
        {children}
      </body>
    </html>
  );
}
