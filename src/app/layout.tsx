import type { Metadata } from 'next';
import { WalletProvider } from '@/context/wallet-provider';
import { Toaster } from '@/components/ui/toaster';
import './globals.css';
import { AuthProvider } from '@/context/auth-provider';

export const metadata: Metadata = {
  title: 'Victory Fire',
  description: 'A competitive eSports platform for Free Fire tournaments in Pakistan.',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&family=Poppins:wght@600;700;800&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className="font-body antialiased">
        <AuthProvider>
          <WalletProvider>
            {children}
            <Toaster />
          </WalletProvider>
        </AuthProvider>
      </body>
    </html>
  );
}
