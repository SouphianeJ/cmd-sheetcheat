// filepath: c:\Users\s.jender\github public proj\cmd-shop\app\layout.tsx
import type { Metadata } from 'next';
import './globals.css'; // This import remains
import { AuthProvider } from '@/app/context/AuthContext';
export const metadata: Metadata = {
  title: 'Cmd Shop',
  description: 'A place to create and share cmds',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body> 
      <AuthProvider>
        <div className="site-wrapper"> {/* Optional: for overall structure if needed */}
          <header className="site-header">
            <div className="container">
              <a href="/" className="logo">CmdShop</a>
              <nav>
                <a href="/cmds">All Cmds</a>
                {/* Add other nav links here */}
              </nav>
            </div>
          </header>
          <main className="container">
            {children}
          </main>
          <footer className="site-footer">
            <p>&copy; {new Date().getFullYear()} CmdShop. All rights reserved.</p>
          </footer>
        </div>
        </AuthProvider>
      </body>
    </html>
  );
}

// The separate Layout component might not be needed if you structure directly in RootLayout
// or you can adapt it to use these new classes.
// For instance, the h1 and p in your original Layout component would get styles from the global H1/P rules.