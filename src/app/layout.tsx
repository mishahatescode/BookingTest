import { Inter } from 'next/font/google';
import './globals.css';

// Load the Inter font with variable weights
const inter = Inter({
  subsets: ['latin'],
  display: 'swap', // Ensure fast loading with fallback
});

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        {children}
      </body>
    </html>
  );
}
