import { Outfit } from "next/font/google";

const outfit = Outfit({ subsets: ["latin"], weight: ["700", "800"] });

/** Outfit font className — use on display headings. */
export const sc = outfit.className;
