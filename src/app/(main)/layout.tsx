import '../globals.css';
import 'leaflet/dist/leaflet.css';
import type { Metadata } from 'next';
import { Navbar } from '@/components/Header';
import RootStyleRegistry from '../registry';
import { ColorSchemeScript } from '@mantine/core';

/* Adding this line fixed: DynamicServerError: Dynamic server usage: cookies
  when building the project. 
*/
export const dynamic = 'force-dynamic';

export const metadata: Metadata = {
  title: 'RentIA - Carsharing Inteligente | Tu Auto por Minutos',
  description: 'Alquila autos por minutos, horas o días. 100% digital y sin contacto. Desbloquea desde tu móvil. Disponible en Buenos Aires. Movilidad inteligente cuando la necesites.',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en-US" suppressHydrationWarning>
      <meta name="viewport" content="width=device-width, initial-scale=1" />
      <link rel="icon" href="/favicon.ico" />
      <head>
        <ColorSchemeScript defaultColorScheme="dark" />
      </head>

      <body suppressHydrationWarning>
        <RootStyleRegistry>
          <Navbar />
          {children}
        </RootStyleRegistry>
      </body>
    </html>
  );
}
