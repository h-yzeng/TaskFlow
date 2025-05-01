import './globals.css';
import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import { initializeDatabase } from '@/lib/db';
import AppLayout from './AppLayout';

initializeDatabase().catch(console.error);

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'Task Manager',
  description: 'A simple task management application',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <AppLayout>{children}</AppLayout>
      </body>
    </html>
  );
}