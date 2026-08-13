import Link from "next/link";
import SpaceBuilder from "../../../components/space-builder/SpaceBuilder";

export default function BuildPage() {
  return (
    <div className="min-h-screen bg-bone">

      {/* nav */}
      <nav className="fixed top-0 left-0 right-0 z-50 bg-bone/90 backdrop-blur-md border-b border-bone-line">
        <div className="max-w-6xl mx-auto px-6 h-14 flex items-center justify-between gap-6">
          <Link href="/" className="font-display text-sm tracking-[0.25em] text-ink/60 hover:text-ink transition-colors flex-shrink-0">ORENARA</Link>
          <div className="hidden sm:flex items-center gap-6 text-xs text-ink/50">
            <Link href="/kits" className="hover:text-ink transition-colors">Kits</Link>
            <Link href="/trade" className="hover:text-ink transition-colors">Trade</Link>
          </div>
        </div>
      </nav>

      {/* page header */}
      <div className="pt-14">
        <div className="max-w-6xl mx-auto px-6 pt-10 pb-8 border-b border-bone-line">
          <Link href="/kits" className="inline-flex items-center gap-1.5 text-ink/40 hover:text-ink text-xs font-spec tracking-wider mb-4 transition-colors">
            <span>←</span> All kits
          </Link>
          <h1 className="font-display text-3xl sm:text-4xl text-ink mb-2">Build Your Space</h1>
          <p className="text-ink/55 max-w-xl leading-relaxed">
            Add the areas you want to light. Each item is priced as part of one job — all runs share a single driver calculation.
          </p>
          <p className="mt-3 text-xs text-ink/40">
            Single area?{" "}
            <Link href="/kits" className="underline underline-offset-2 hover:text-ink/70 transition-colors">
              Browse individual kit specs →
            </Link>
          </p>
        </div>
      </div>

      {/* shared builder canvas */}
      <SpaceBuilder />

      {/* footer — pb-20 lg:pb-0 clears the mobile CTA bar */}
      <footer className="bg-bone-tile border-t border-bone-line mt-16 pb-20 lg:pb-0">
        <div className="max-w-6xl mx-auto px-6 py-8 flex flex-col sm:flex-row gap-4 justify-between items-start sm:items-center">
          <Link href="/" className="font-display text-sm tracking-[0.25em] text-ink/50 hover:text-ink transition-colors">ORENARA</Link>
          <div className="flex items-center gap-6 text-xs text-ink/40">
            <Link href="/kits" className="hover:text-ink/60 transition-colors">← All kits</Link>
            <Link href="/terms" className="hover:text-ink/60 transition-colors">Terms</Link>
            <Link href="/privacy" className="hover:text-ink/60 transition-colors">Privacy</Link>
          </div>
        </div>
      </footer>

    </div>
  );
}
