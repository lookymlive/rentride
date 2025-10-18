import '../globals.css';
import type { Metadata } from 'next';
import { Navbar } from '@/components/Header';
import RootStyleRegistry from '../registry';
import { ColorSchemeScript } from '@mantine/core';

/* Adding this line fixed: DynamicServerError: Dynamic server usage: cookies
  when building the project. 
*/
export const dynamic = 'force-dynamic';

export const metadata: Metadata = {
  title: 'RentRide - Your Journey, Your Ride',
  description: 'Modern car rental platform. Rent cars anywhere, anytime. Built with Next.js 15 and React 19.',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en-US">
      <meta name="viewport" content="width=device-width, initial-scale=1" />
      <link rel="icon" href="/favicon.ico" />
      <head>
        <ColorSchemeScript defaultColorScheme="dark" />
      </head>

      <body>
        <RootStyleRegistry>
          <Navbar />
          {children}
        </RootStyleRegistry>
      </body>
    </html>
  );
}
