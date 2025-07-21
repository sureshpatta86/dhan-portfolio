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

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>
        <Providers>
          {children}
        </Providers>
        
        {/* Handle browser extension React errors */}
        <script
          dangerouslySetInnerHTML={{
            __html: `
              window.addEventListener('error', function(e) {
                if (e.error && e.error.message && e.error.message.includes('Minified React error #299')) {
                  console.warn('Browser extension React error caught and suppressed:', e.error.message);
                  e.preventDefault();
                  return false;
                }
              });
            `,
          }}
        />
      </body>
    </html>
  );
}