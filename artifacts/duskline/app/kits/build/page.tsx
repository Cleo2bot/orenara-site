import Image from "next/image";
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

      {/* hero — full-bleed dark photo */}
      <section className="pt-14">
        <div className="relative overflow-hidden bg-ink min-h-[56vh] flex items-end">
          <div className="absolute inset-0">
            <Image
              src="/images/gallery/orenara-travertine-pool-edge.webp"
              alt="Pool coping LED lighting at dusk — Orenara IP68 strip"
              fill
              className="object-cover img-treated opacity-45"
              priority
              sizes="100vw"
            />
          </div>
          <div className="relative max-w-6xl mx-auto px-6 py-16 lg:py-24 w-full">
            <Link
              href="/kits"
              className="inline-flex items-center gap-1.5 font-spec text-[9px] tracking-widest text-bone/40 uppercase hover:text-bone/70 transition-colors mb-8"
            >
              <span>←</span> All kits
            </Link>
            <p className="font-spec text-[9px] tracking-widest text-bone/40 uppercase mb-4">
              What counts as a zone
            </p>
            <h1 className="font-display text-4xl sm:text-5xl lg:text-6xl text-bone leading-tight max-w-2xl mb-5">
              A zone is an area,<br />
              not a measurement.
            </h1>
            <p className="text-bone/65 text-lg leading-relaxed max-w-xl mb-8">
              The pool surround. The pergola. The front path. One zone can hold
              several runs — the curved edge, the straight edge, the steps. Pace
              out what you can; we confirm every measurement with you before
              anything is cut.
            </p>
            <div className="flex flex-wrap items-center gap-5">
              <a
                href="#add-area"
                className="inline-block font-spec text-[9px] tracking-widest uppercase bg-bone text-ink px-6 py-3 rounded-xs hover:bg-bone/90 transition-colors"
              >
                Add your first zone
              </a>
              <Link
                href="/kits"
                className="font-spec text-[9px] tracking-widest uppercase text-bone/50 hover:text-bone/80 transition-colors"
              >
                Single area? Browse individual kit specs →
              </Link>
            </div>
          </div>
        </div>
      </section>

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
