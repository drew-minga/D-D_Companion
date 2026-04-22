import type { Metadata } from 'next';
import './globals.css';
import Nav from '@/components/Nav';

export const metadata: Metadata = {
  title: 'D&D Companion (2024)',
  description: 'A free, open-source Dungeons & Dragons companion for the 2024 Player\'s Handbook (5.5e). Character creation wizard, dice, combat tracking, spells, and monsters — all in your browser.',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>
        <div className="min-h-full flex flex-col">
          <Nav />
          <main className="mx-auto w-full max-w-6xl flex-1 px-4 py-6">{children}</main>
          <footer className="border-t border-ink/10 bg-white/40 py-4 text-center text-xs text-ink/60">
            Built with <span className="text-blood">♥</span> for tabletop adventurers. Character data from the{' '}
            <a className="underline" href="https://www.dndbeyond.com/sources/dnd/free-rules" target="_blank" rel="noreferrer">
              SRD 5.2 (CC BY 4.0)
            </a>
            {' '}· Spell &amp; monster lookup via the{' '}
            <a className="underline" href="https://www.dnd5eapi.co/" target="_blank" rel="noreferrer">
              D&amp;D 5e API
            </a>
            .
          </footer>
        </div>
      </body>
    </html>
  );
}
