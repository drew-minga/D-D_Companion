'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';

const links = [
  { href: '/', label: 'Home' },
  { href: '/dice', label: 'Dice' },
  { href: '/characters', label: 'Characters' },
  { href: '/lookup', label: 'Lookup' },
  { href: '/combat', label: 'Combat' },
];

export default function Nav() {
  const pathname = usePathname();
  return (
    <header className="border-b border-ink/10 bg-white/60 backdrop-blur">
      <div className="mx-auto flex w-full max-w-6xl items-center justify-between px-4 py-3">
        <Link href="/" className="heading text-xl text-blood">
          D&amp;D Companion
        </Link>
        <nav className="flex flex-wrap gap-1">
          {links.map((l) => {
            const active = l.href === '/' ? pathname === '/' : pathname?.startsWith(l.href);
            return (
              <Link
                key={l.href}
                href={l.href}
                className={
                  'rounded-md px-3 py-1.5 text-sm transition ' +
                  (active ? 'bg-blood text-parchment' : 'hover:bg-ink/5')
                }
              >
                {l.label}
              </Link>
            );
          })}
        </nav>
      </div>
    </header>
  );
}
