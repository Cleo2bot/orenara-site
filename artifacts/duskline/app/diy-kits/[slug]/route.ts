import { NextRequest, NextResponse } from "next/server";

const SLUG_MAP: Record<string, string> = {
  pool:  "pool-surround",
  stair: "stair",
  patio: "patio",
  path:  "path",
};

export function GET(
  req: NextRequest,
  { params }: { params: { slug: string } }
) {
  const newSlug = SLUG_MAP[params.slug] ?? params.slug;
  return NextResponse.redirect(
    new URL(`/kits/${newSlug}`, req.nextUrl.origin),
    { status: 301 }
  );
}
