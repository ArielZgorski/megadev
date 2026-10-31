# megadev: #4471 split by problem

The support desk merged 412 date reports into one ticket, #4471, and marked it known. It holds three problems.
Each now has its own ticket in this repo's issues.

| ticket | problem | reports |
|---|---|---|
| [#1](https://github.com/ArielZgorski/megadev/issues/1) | Shared parser reads day-first dates month first | 374 |
| [#2](https://github.com/ArielZgorski/megadev/issues/2) | booking-v3 form hints MM/DD/YYYY to day-first tenants | 33 |
| [#3](https://github.com/ArielZgorski/megadev/issues/3) | Invites land one day off (time zone) | 5 |

## What's here

- `support-kb/`: the kb export (`kb-export-267efc5e.zip`), plus my page and the logic behind it:
  - page: [`src/routes/kb/incidents/4471-split/+page.svx`](support-kb/src/routes/kb/incidents/4471-split/+page.svx)
  - logic: `src/lib/kb/problems.ts`, `ticket-split.ts`, `ProblemTable.svelte`, `ProblemCount.svelte`, `ReportList.svelte`
  - build scaffold so the export renders: `package.json`, `vite.config.js`, `src/app.html`, `src/routes/+layout.js`
- `rendered/`: the page as the desk sees it: [`4471-split.html`](rendered/4471-split.html) (standalone) and [`4471-split.png`](rendered/4471-split.png).

The desk's own files are unchanged. The counts are computed at build time from `reports-4471.json`, so they follow the data.

## Build

```sh
cd support-kb
npm install
npm run build     # static site in build/, page at build/kb/incidents/4471-split.html
npm run preview   # http://localhost:4173/kb/incidents/4471-split
```
