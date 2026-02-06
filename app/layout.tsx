import clsx from 'clsx';
import type { Metadata } from 'next';
import { Roboto } from 'next/font/google';
import './globals.css';

const robotoSans = Roboto({
  variable: '--font-sans',
  weight: ['100', '300', '400', '500', '600', '700'],
  display: 'swap',
  subsets: ['latin'],
});

export const metadata: Metadata = {
  title: 'StayOn Pages | Create and Share Disposable Pages Instantly',
  description:
    'Create anonymous shopping lists, event itineraries, and voting polls instantly. No account required, no ads, no tracking, and links auto-expire for privacy.',
};

export default function RootLayout({ children }: LayoutProps<'/'>) {
  return (
    <html lang="en">
      <body className={clsx(robotoSans.variable, 'font-sans', 'antialiased')}>
        {children}
      </body>
    </html>
  );
}
