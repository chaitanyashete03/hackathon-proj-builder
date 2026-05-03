import './globals.css';
import { Inter } from 'next/font/google';
const inter = Inter({ subsets: ['latin'] });
export const metadata = { title: 'HackForge', description: 'Ultimate Project Builder' };
export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (<html lang="en"><body className={inter.className + " bg-slate-950 text-white min-h-screen"}>{children}</body></html>);
}
