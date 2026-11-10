## 2026-11-10 · /kitchen-designer is a permanent redirect (T320)

**What changed:** `screwthemiddleman.com/kitchen-designer` now answers 308 Permanent Redirect to `https://designer.kom-usa.com/` instead of 307 Temporary Redirect (`permanentRedirect()` instead of `redirect()` in `src/app/kitchen-designer/page.tsx`). The destination and the coming-soon fallback are unchanged. Comments that said "307" now say 308.

**Why:** Google Search Console flagged designer.kom-usa.com as "Duplicate without user-selected canonical", and the validation failed on November 9th, 2026 (T320, reopened). A temporary redirect tells Google the redirecting address is the one to keep. The 307 was chosen while the designer sat on a ChatGPT Site whose host could change; it now lives on KOM's own subdomain. Same change as kom-usa.com/kitchen-designer (kom-usa-platform #132). Ovidiu OK'd it on November 10th.

**Not changed:** no click counting exists on this site, so none is affected. No test was added: this repo has no test runner yet.
