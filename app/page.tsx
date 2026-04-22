import Link from 'next/link';

const features = [
  {
    href: '/dice',
    title: 'Dice Roller',
    desc: 'Roll any combination of dice with modifiers, advantage, and disadvantage.',
  },
  {
    href: '/characters',
    title: 'Character Sheets',
    desc: 'Create and manage 5e character sheets stored locally in your browser.',
  },
  {
    href: '/lookup',
    title: 'Spells & Monsters',
    desc: 'Search the full 5e SRD for spells, monsters, items, and more.',
  },
  {
    href: '/combat',
    title: 'Combat Tracker',
    desc: 'Roll initiative, track HP and conditions, and keep the round moving.',
  },
];

export default function HomePage() {
  return (
    <div className="space-y-10">
      <section className="rounded-xl border border-ink/10 bg-white/60 p-8 text-center shadow-sm">
        <h1 className="heading text-4xl sm:text-5xl text-blood">Your adventure, organized.</h1>
        <p className="mx-auto mt-3 max-w-2xl text-ink/70">
          A fast, private, open-source companion for Dungeons &amp; Dragons 5th Edition. Everything runs in
          your browser — no accounts, no tracking.
        </p>
        <div className="mt-6 flex flex-wrap justify-center gap-2">
          <Link href="/dice" className="btn-primary">Roll some dice</Link>
          <Link href="/characters" className="btn-gold">Create a character</Link>
        </div>
      </section>

      <section className="grid gap-4 sm:grid-cols-2">
        {features.map((f) => (
          <Link key={f.href} href={f.href} className="card hover:border-gold transition group">
            <h2 className="heading text-xl text-blood group-hover:text-gold">{f.title}</h2>
            <p className="mt-2 text-sm text-ink/70">{f.desc}</p>
          </Link>
        ))}
      </section>
    </div>
  );
}
