import { ColorSchemeScript } from '@mantine/core';
import type { Metadata } from 'next';
import '../globals.css';
import RootStyleRegistry from '../registry';

/* Adding this line fixed: DynamicServerError: Dynamic server usage: cookies
  when building the project. 
*/
export const dynamic = 'force-dynamic';

export const metadata: Metadata = {
  title: 'RentRide - Provider Dashboard',
  description: 'Manage your fleet and bookings',
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
        <ColorSchemeScript />
      </head>

      <body>
        <RootStyleRegistry>{children}</RootStyleRegistry>
      </body>
    </html>
  );
}
