import { redirect } from "next/navigation";

// Map old DIY slug → new kit slug
const SLUG_MAP: Record<string, string> = {
  pool:  "pool-surround",
  stair: "stair",
  patio: "patio",
  path:  "path",
};

export function GET(
  _req: Request,
  { params }: { params: { slug: string } }
) {
  const newSlug = SLUG_MAP[params.slug] ?? params.slug;
  redirect(`/kits/${newSlug}`);
}
