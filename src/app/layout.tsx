import './globals.css';
import { Providers } from '@/lib/providers';
import { APP_CONFIG } from '@/lib/config/app';

export const metadata = {
  title: APP_CONFIG.name,
  description: APP_CONFIG.description,
};

interface RootLayoutProps {
  children: React.ReactNode;
}

const RootLayout = ({ children }: RootLayoutProps) => {
  return (
    <html lang="en">
      <body>
        <Providers>
          {children}
        </Providers>
      </body>
    </html>
  );
};

export default RootLayout;