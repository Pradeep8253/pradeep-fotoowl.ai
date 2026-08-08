import { MediaAppProvider } from './providers/MediaAppProvider.jsx';
import './globals.css';

export const metadata = {
  title: 'Media SDK Explorer',
  description: 'Headless Media SDK and Component Library Demo',
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>
        <MediaAppProvider>
          {children}
        </MediaAppProvider>
      </body>
    </html>
  );
}
