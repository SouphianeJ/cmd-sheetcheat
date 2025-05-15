// filepath: c:\Users\s.jender\github public proj\prompt-shop\app\layout.tsx
import type { Metadata } from 'next';
import './globals.css'; // This import remains

export const metadata: Metadata = {
  title: 'Prompt Shop',
  description: 'A place to create and share prompts',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body> {/* Body tag gets styles from globals.css directly */}
        <div className="site-wrapper"> {/* Optional: for overall structure if needed */}
          <header className="site-header">
            <div className="container">
              <a href="/" className="logo">PromptShop</a>
              <nav>
                <a href="/prompts">All Prompts</a>
                {/* Add other nav links here */}
              </nav>
            </div>
          </header>
          <main className="container">
            {children}
          </main>
          <footer className="site-footer">
            <p>&copy; {new Date().getFullYear()} PromptShop. All rights reserved.</p>
          </footer>
        </div>
      </body>
    </html>
  );
}

// The separate Layout component might not be needed if you structure directly in RootLayout
// or you can adapt it to use these new classes.
// For instance, the h1 and p in your original Layout component would get styles from the global H1/P rules.