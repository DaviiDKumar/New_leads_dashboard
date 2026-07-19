// src/app/layout.js
import './globals.css'; 

export const metadata = {
  title: 'DataTech | Unified Leads Dashboard',
  description: 'High-performance tele-calling workspace and lead tracking system',
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" className="h-full bg-[#050505] scroll-smooth">
      <body className="h-full bg-[#050505] text-white antialiased font-sans selection:bg-white selection:text-black">
        <div className="min-h-full flex flex-col">
          <main className="flex-1 flex flex-col">
            {children}
          </main>
        </div>
      </body>
    </html>
  );
}