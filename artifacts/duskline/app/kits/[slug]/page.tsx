"use client";

import React from "react";
import Image from "next/image";
import Link from "next/link";
import { KITS, KitId } from "../../../lib/kits-data";
import { PART_NUMBERS } from "../../../lib/quoteCalc";
import SpaceBuilder, { makeInitialItem, ItemType } from "../../../components/space-builder/SpaceBuilder";

/* ── Map kit slug → initial area type for pre-seeding ── */
const KIT_ITEM_TYPES: Partial<Record<KitId, ItemType>> = {
  "pool-surround": "pool",
  "stair":         "stair",
  "patio":         "box",
  "path":          "path",
};

function KitPageInner({ slug }: { slug: string }) {
  const kit = KITS.find((k) => k.id === slug);

  if (!kit) {
    return (
      <div className="min-h-screen bg-bone flex items-center justify-center">
        <div className="text-center">
          <p className="font-display text-2xl text-ink mb-4">Kit not found.</p>
          <Link href="/kits" className="text-ink/60 hover:text-ink text-sm underline">Back to kits</Link>
        </div>
      </div>
    );
  }

  const kitItemType: ItemType = KIT_ITEM_TYPES[kit.id as KitId] ?? "box";
  const initialItems = [makeInitialItem(kitItemType)];

  return (
    <div className="min-h-screen bg-bone">

      {/* nav */}
      <nav className="fixed top-0 left-0 right-0 z-50 bg-bone/90 backdrop-blur-md border-b border-bone-line">
        <div className="max-w-6xl mx-auto px-6 h-14 flex items-center justify-between gap-6">
          <Link href="/" className="font-display text-sm tracking-[0.25em] text-ink/60 hover:text-ink transition-colors flex-shrink-0">ORENARA</Link>
          <div className="hidden sm:flex items-center gap-6 text-xs text-ink/50">
            <Link href="/kits" className="hover:text-ink transition-colors">Kits</Link>
            <Link href="/kits/build" className="hover:text-ink transition-colors">Build your space</Link>
            <Link href="/trade" className="hover:text-ink transition-colors">Trade</Link>
          </div>
        </div>
      </nav>

      {/* hero */}
      <div className="pt-14">
        <div className="relative w-full aspect-[21/9] overflow-hidden bg-ink">
          <Image
            src={kit.image}
            alt={kit.name}
            fill
            className="object-cover img-treated opacity-60"
            priority
            sizes="100vw"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-ink/60 via-transparent to-transparent"/>
          <div className="absolute bottom-0 left-0 right-0 max-w-6xl mx-auto px-6 pb-8">
            <Link href="/kits" className="inline-flex items-center gap-1.5 text-bone/50 hover:text-bone text-xs font-spec tracking-wider mb-4 transition-colors">
              <span>←</span> All kits
            </Link>
            <div className="flex items-center gap-3 flex-wrap mb-2">
              <span className="font-spec text-[8px] tracking-widest uppercase bg-bone/15 border border-bone/20 text-bone/70 px-2.5 py-1 rounded-xs backdrop-blur-sm">
                {kit.channelBadge}
              </span>
            </div>
            <h1 className="font-display text-4xl sm:text-5xl text-bone leading-tight">{kit.name}</h1>
          </div>
        </div>
      </div>

      {/* application copy */}
      <div className="max-w-6xl mx-auto px-6 pt-10 pb-8 border-b border-bone-line">
        <p className="font-spec text-[9px] tracking-widest text-ink/40 uppercase mb-2">Application</p>
        <p className="text-ink/70 leading-relaxed max-w-2xl">{kit.application}</p>
        {kit.channelNote && (
          <p className="text-xs text-ink/50 leading-relaxed italic mt-2">{kit.channelNote}</p>
        )}
      </div>

      {/* shared builder — pre-seeded with this kit's area type */}
      <SpaceBuilder
        initialItems={initialItems}
        kitName={kit.name}
        kitId={kit.id}
      />

      {/* supporting content — what's included + ideal for */}
      <div className="max-w-6xl mx-auto px-6 py-12 border-t border-bone-line">
        <div className="grid lg:grid-cols-2 gap-10">

          {/* what's included */}
          <div>
            <p className="font-spec text-[9px] tracking-widest text-ink/40 uppercase mb-4">What&apos;s included</p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {[
                {
                  label: "IP68 silicone strip",
                  detail: `${PART_NUMBERS.stripMono} · 24V · mono up to 10m per run · ${PART_NUMBERS.stripCC} over 10m`,
                },
                {
                  label: `${kit.channel} channel`,
                  detail: "Diffuser included · profile selected in the builder above",
                },
                {
                  label: "Mean Well HLG-150H-24B",
                  detail: `${PART_NUMBERS.driver} · 24V DC · IP67 · 80% derated · one per independently-fed run`,
                },
                {
                  label: "Factory IP68 connectors",
                  detail: `${PART_NUMBERS.connectorSet} · moulded onto strip ends · pressure-tested before dispatch`,
                },
              ].map((item) => (
                <div key={item.label} className="rounded-xs border border-bone-line bg-bone-tile p-4">
                  <p className="font-display text-sm text-ink mb-1">{item.label}</p>
                  <p className="text-xs text-ink/55 leading-relaxed">{item.detail}</p>
                </div>
              ))}
            </div>
          </div>

          {/* ideal for */}
          <div>
            <p className="font-spec text-[9px] tracking-widest text-ink/40 uppercase mb-3">Ideal for</p>
            <ul className="space-y-2">
              {kit.idealFor.map((point) => (
                <li key={point} className="flex items-start gap-3 text-sm text-ink/65">
                  <span className="w-1 h-1 rounded-full bg-ink/30 flex-shrink-0 mt-2"/>
                  {point}
                </li>
              ))}
            </ul>
          </div>

        </div>
      </div>

      {/* footer — pb-20 lg:pb-0 clears the mobile CTA bar from SpaceBuilder */}
      <footer className="bg-bone-tile border-t border-bone-line pb-20 lg:pb-0">
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

export default function KitSlugPage({ params }: { params: { slug: string } }) {
  return <KitPageInner slug={params.slug} />;
}
