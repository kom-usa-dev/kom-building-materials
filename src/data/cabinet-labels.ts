import type { CabinetItem } from "@/types/product";

/**
 * One place for how a cabinet group is named and counted (T306, November 2nd):
 * the catalog page (/cabinets), the estimator's rows, the estimate panel and
 * the quote text all read from here, so a visitor sees the same name
 * everywhere. Groups without a label keep their data name on every page.
 */

export const GROUP_LABELS: Record<string, string> = {
  "Wall Cabinets:1 Door":            "One-Door Wall Cabinet",
  "Wall Cabinets:2 Door":            "Two-Door Wall Cabinet",
  "Wall Cabinets:Bridge Cabinets":   "Bridge Cabinet",
  "Base Cabinets:1 Door":            "One-Door Base Cabinet",
  "Base Cabinets:2 Door":            "Two-Door Base Cabinet",
  "Base Cabinets:3 Drawer":          "3-Drawer Base Cabinet",
  "Base Cabinets:Sink Base":         "Sink Base Cabinet",
  "Base Cabinets:Blind Corner":      "Blind Corner Base Cabinet",
  "Pantry Cabinets:Utility Pantry — 1 Door": "Full-Height Pantry Cabinet",
  "Accessories:Trash Pull-Out":      "Trash Pull-Out Cabinet",
  "Accessories:Fillers":             "Cabinet Fillers",
  "Accessories:Toe Kick":            "Toe Kick Strip",
  "Accessories:Refrigerator Panel":  "Refrigerator Panel",
  "Accessories:End Panels":          "End Panels",
  "Specialty Cabinets:Oven Cabinets":        "Oven Tower Cabinet",
  "Specialty Cabinets:Microwave Cabinet":    "Microwave Wall Cabinet",
  "Specialty Cabinets:Lazy Susan":           "Corner Lazy Susan",
  "Specialty Cabinets:Diagonal Sink Base":   "Diagonal Corner Sink Base",
  "Specialty Cabinets:Wall Blind Corner":    "Wall Blind Corner Cabinet",
  "Vanity Cabinets:Vanity Base":       "Vanity Base Cabinet",
  "Vanity Cabinets:Vanity Combination":"Vanity Combination Cabinet",
};

export const GROUP_DESCRIPTIONS: Record<string, string> = {
  "Wall Cabinets:1 Door":            "Single-door upper cabinet, 12\" deep. Great for corners and narrow spaces.",
  "Wall Cabinets:2 Door":            "Two-door upper cabinet, 12\" deep. The standard choice for open runs above countertops.",
  "Wall Cabinets:Bridge Cabinets":   "Shallow 18\" tall cabinet, 12\" deep. Fits above windows, range hoods, and appliances.",
  "Base Cabinets:1 Door":            "Single-door base with one adjustable shelf. 24\" deep, 34.5\" tall.",
  "Base Cabinets:2 Door":            "Two-door base with one adjustable shelf. 24\" deep, 34.5\" tall.",
  "Base Cabinets:3 Drawer":          "Three full-extension drawers. 24\" deep, 34.5\" tall. Ideal for pots, utensils, and tools.",
  "Base Cabinets:Sink Base":         "Open interior — no center shelf — designed for undermount or drop-in sink installation. 24\" deep, 34.5\" tall.",
  "Base Cabinets:Blind Corner":      "Corner base cabinet that maximizes awkward corner storage. 24\" deep, 34.5\" tall.",
  "Pantry Cabinets:Utility Pantry — 1 Door": "Full-height pantry with multiple adjustable shelves. 24\" deep. Great for bulk storage.",
  "Accessories:Trash Pull-Out":      "Base cabinet with an integrated pull-out trash bin system. 24\" deep, 34.5\" tall.",
  "Accessories:Fillers":             "Straight and fluted filler strips to close gaps between cabinets, walls, and appliances.",
  "Accessories:Toe Kick":            "Painted toe kick board, 8' long × 4.5\" tall. Finishes the base of any cabinet run.",
  "Accessories:Refrigerator Panel":  "Finished decorative panel for built-in refrigerator surround. 24\" deep × 96\" tall.",
  "Accessories:End Panels":          "Decorative finished panels for exposed cabinet sides — available in wall and base sizes.",
  "Specialty Cabinets:Oven Cabinets":        "Full-height tower designed for wall oven installation. 24\" deep. Available in 30\" and 33\" widths.",
  "Specialty Cabinets:Microwave Cabinet":    "Wall cabinet sized specifically for above-counter microwave installation. 30\"W × 18\"H × 18\"D.",
  "Specialty Cabinets:Lazy Susan":           "Corner base cabinet with rotating shelves for effortless corner access. Cabinet and hardware kit sold separately.",
  "Specialty Cabinets:Diagonal Sink Base":   "Angled corner base cabinet for diagonal sink placement in island or angled kitchen layouts.",
  "Specialty Cabinets:Wall Blind Corner":    "Upper corner cabinet spanning both walls to maximize corner storage.",
  "Vanity Cabinets:Vanity Base":       "Bathroom vanity base, 21\" deep × 34.5\" tall. Sized for standard bathroom sink installation.",
  "Vanity Cabinets:Vanity Combination":"Full-width bathroom vanity, 21\" deep × 34.5\" tall. Suitable for double-sink configurations.",
};

export function groupKey(section: string, group: string): string {
  return `${section}:${group}`;
}

/** The name shown everywhere: the catalog label, or the group's data name when there is none. */
export function groupLabel(section: string, group: string): string {
  return GROUP_LABELS[groupKey(section, group)] ?? group;
}

/** The group's address in the estimator: /project-builder?group=<slug>, e.g. wall-cabinets-2-door. */
export function groupSlug(section: string, group: string): string {
  return `${section} ${group}`.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-+|-+$/g, "");
}

/** Groups listed by width ("9"W × 30"H × 12"D") get widths and heights; the others (toe kick, panels, lazy susan) a size list. */
export function hasWidths(items: CabinetItem[]): boolean {
  return /^\d+"W/.test(items[0]?.dimensions ?? "");
}

/** "15 sizes", "1 size": how many sizes a group has, the same word on every row and page (Ovidiu, November 2nd). */
export function sizeCount(items: CabinetItem[]): string {
  const n = items.length;
  return `${n} size${n === 1 ? "" : "s"}`;
}
