import type { Metadata } from 'next';
import './globals.css';
import Nav from '@/components/Nav';

export const metadata: Metadata = {
  title: 'D&D Companion',
  description: 'A free, open-source Dungeons & Dragons 5e companion: dice, characters, monsters, spells, and combat tracking.',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>
        <div className="min-h-full flex flex-col">
          <Nav />
          <main className="mx-auto w-full max-w-6xl flex-1 px-4 py-6">{children}</main>
          <footer className="border-t border-ink/10 bg-white/40 py-4 text-center text-xs text-ink/60">
            Built with <span className="text-blood">♥</span> for tabletop adventurers. Data from the{' '}
            <a className="underline" href="https://www.dnd5eapi.co/" target="_blank" rel="noreferrer">
              D&amp;D 5e SRD API
            </a>
            .
          </footer>
        </div>
      </body>
    </html>
  );
}
