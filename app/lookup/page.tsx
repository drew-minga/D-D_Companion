import Link from 'next/link';

export default function LookupIndex() {
  return (
    <div className="space-y-6">
      <h1 className="heading text-3xl text-blood">Lookup</h1>
      <p className="text-ink/70">Search the System Reference Document (SRD) for spells and monsters.</p>
      <div className="grid gap-4 sm:grid-cols-2">
        <Link href="/lookup/spells" className="card hover:border-gold transition">
          <h2 className="heading text-xl text-blood">Spells</h2>
          <p className="mt-1 text-sm text-ink/70">Browse every SRD spell with casting time, range, and full descriptions.</p>
        </Link>
        <Link href="/lookup/monsters" className="card hover:border-gold transition">
          <h2 className="heading text-xl text-blood">Monsters</h2>
          <p className="mt-1 text-sm text-ink/70">Look up stat blocks, senses, and actions for creatures in the SRD.</p>
        </Link>
      </div>
    </div>
  );
}
