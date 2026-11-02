## 2026-11-02 — KBM-2: lint clean on main (ContactForm)

`npm run lint` failed on main with one error in `src/components/ContactForm.tsx`
(`react-hooks/set-state-in-effect`), reported since 9 Oct. The flagged line is the one-time
pre-fill of the contact form from the estimate the Project Estimator saves in the browser
("Request a quote"). It runs once on page load and is not a render loop, so the line now
carries a scoped lint exception with the reason. No code path changed; the form shows and
sends exactly what it did. Closes KBM-2. PR #<n>.
