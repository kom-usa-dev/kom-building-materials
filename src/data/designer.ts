/**
 * The 3D kitchen planner, and how screwthemiddleman.com points at it.
 *
 * Jordan built it — `kom-usa/KOM-3D-Kitchen-Designer`. It is **not** a Next app
 * this repo can host, so this site only points at it.
 *
 * ✅ **On KOM's Cloudflare at designer.kom-usa.com since 1 Oct** (T53), the same
 * place kom-usa.com/kitchen-designer points. Moved here 9 Oct: the old ChatGPT
 * Site copy below ends with the ChatGPT workspace on 28 Oct. Checked signed out:
 * 200 with the title `KOM 3D Kitchen & Material Designer`.
 *
 * History: **LIVE from 11 Sep to 9 Oct** on the **KOM workspace** ChatGPT Site rather than the personal
 * account everyone planned around: `kom-usa-0158.chatgpt.site`, not
 * `jpetrovich290.chatgpt.site`. Michael approved publication and Jordan
 * published it. Verified by three signed-out requests returning 200 with the
 * title `KOM 3D Kitchen & Material Designer`; the old personal URL was still
 * returning 401 minutes earlier, so the two are different Sites.
 *
 * **This site keeps BOTH tools** (Ovidiu, 11 Sep). The quick material estimate
 * is for a customer who knows the products and sizes they need; the 3D planner
 * is for one who needs help with the layout. The planner does not replace it.
 *
 * ⚠️ **`BLUEPRINT.md` §7 says "One universal project builder."** Offering a
 * second way in is a deliberate departure from that line, not an oversight.
 *
 * ⚠️ **THE TWO PATHS DO NOT SHARE A QUOTE INTAKE, and now that the planner is
 * live that is a real risk rather than a theoretical one.** The estimator on
 * `/project-builder` writes its total to `localStorage`, sends the customer to
 * `/contact`, and submits through Netlify Forms. The planner writes its request
 * to its own D1 `quote_requests` table and only forwards it when
 * `QUOTE_AUTOMATION_WEBHOOK_URL` is set — unset, the customer sees a
 * confirmation while the lead sits in a table nobody opens. **No copy on this
 * site may claim the two paths meet**, and none does: the sentence "Both paths
 * lead to one official quote request reviewed by the KOM team" was specified
 * for the hub and deliberately NOT shipped, because it is not true yet.
 */
export const KITCHEN_DESIGNER = {
  /**
   * Public URL of the planner, or null while it is unavailable.
   *
   * ⚠️ **Null is a supported state, not a broken one.** The card still renders,
   * in its coming-soon form, and `/kitchen-designer` serves the coming-soon page
   * instead of redirecting. Swapping the value is the whole change: the same
   * route then issues a 308 (T320) and the card flips to its available form.
   *
   * ⚠️ **Only ever a URL that has been checked SIGNED OUT.** A private Site
   * returns an OpenAI "Sign in required" page, and sending a customer there is
   * strictly worse than telling them it is coming.
   */
  url: "https://designer.kom-usa.com/" as string | null,

  /**
   * The hub card. Two states, one for each side of `url`.
   *
   * ⚠️ **Kitchens only.** The planner lays out kitchens; it does not price a
   * bathroom or a floor on its own. Said on the card, because sending someone
   * with a flooring job into a kitchen planner wastes their time and ours.
   */
  card: {
    statusSoon: "COMING SOON",
    statusLive: "AVAILABLE NOW",
    title: "Design your kitchen in 3D",
    description:
      "Enter room measurements, test cabinet layouts, and see how the kitchen fits together.",
    scope: "Kitchens only.",
    bestIf: "Best if: You need help choosing a layout.",
    actionSoon: "See what’s coming",
    actionLive: "Open the 3D planner",
  },
} as const;

/** Whether the planner can actually be opened today. */
export function plannerIsLive(): boolean {
  return KITCHEN_DESIGNER.url !== null;
}
