export interface TradeResourceCard {
  slug: string;
  title: string;
  blurb: string;
}

export const tradeResources: TradeResourceCard[] = [
  {
    slug: "driver-sizing",
    title: "Driver & Dimmer Sizing Guide",
    blurb: "Work out how many drivers, dimmers, and plugs a run actually needs.",
  },
  {
    slug: "12v-vs-24v",
    title: "12V vs 24V — Why It Matters Past 5 Metres",
    blurb: "The voltage-drop problem most outdoor strip lighting doesn't tell you about.",
  },
  {
    slug: "ip-ratings-explained",
    title: "IP54, IP65, IP68 — What the Second Digit Means",
    blurb: "The ingress protection scale, explained properly.",
  },
];
