import { Inter } from 'next/font/google';
import './globals.css';
import Header from './components/Header';
import { AuthProvider } from '@/context/AuthContext';

const inter = Inter({ subsets: ['latin'] });

export const metadata = {
  title: 'Promotional Retail Hub',
  description: 'Manage your promotions seamlessly',
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <AuthProvider> {/* Wrap everything with the AuthProvider */}
          <Header />
          <main>{children}</main>
        </AuthProvider>
      </body>
    </html>
  );
}