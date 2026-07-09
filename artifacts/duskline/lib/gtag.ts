// Google Ads conversion tracking helper.
// All IDs come from environment variables — never hardcoded.
// When NEXT_PUBLIC_GOOGLE_ADS_ID is unset, every call is a no-op.

export function reportConversion(label?: string) {
  const id = process.env.NEXT_PUBLIC_GOOGLE_ADS_ID;

  if (process.env.NODE_ENV !== "production") {
    if (!id || !label) {
      console.log("[Orenara] conversion skipped: tracking disabled");
    } else {
      console.log(`[Orenara] conversion fired: ${label}`);
    }
  }

  if (
    !id ||
    !label ||
    typeof window === "undefined" ||
    !(window as any).gtag
  ) {
    return;
  }

  (window as any).gtag("event", "conversion", {
    send_to: `${id}/${label}`,
  });
}
