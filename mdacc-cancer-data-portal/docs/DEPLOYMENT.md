# Deployment Notes

## Purpose
This runbook provides a lightweight deployment checklist for the MD Anderson Cancer Data Portal MVP.

## Preconditions
1. Source data in `data/raw/` is up to date.
2. Processed artifacts in `data/processed/` were rebuilt recently.
3. Local verification has passed.

## Recommended environment variable
- `NEXT_PUBLIC_SITE_URL`
  - Example: `https://portal.example.org`
  - Used for canonical metadata, sitemap URLs, and robots host/sitemap fields.
  - If not set, the app falls back to `http://localhost:3000`.

## Verification workflow
Run before deployment:

```bash
npm run verify
```

`verify` runs:
1. CSV validation (`data:validate`)
2. tests (`npm test`)
3. lint (`npm run lint`)
4. production build (`npm run build`)

## Production build steps
```bash
npm install
npm run data:build
npm run verify
npm run build
npm run start
```

## Deployment-facing artifacts to check
1. `data/processed/build_metadata.json`
2. `data/processed/validation_report.json`
3. `/sitemap.xml`
4. `/robots.txt`
5. Metadata previews for key routes:
   - `/`
   - `/explore`
   - `/researchers`
   - `/datasets`
   - `/technologies`
   - `/disease-areas`
   - `/projects`
   - `/about`
   - `/status`
   - `/compare`

## Final sanity check
1. Confirm list/detail pages load normally.
2. Confirm share/export controls still work on Explore and list pages.
3. Confirm detail-page quick-nav and related links still navigate correctly.
4. Confirm validation report status is not `failed` before release.
5. Confirm `/status` shows the expected build/validation summary.
6. Confirm compare tray and `/compare` URL view load correctly with sample selections.
