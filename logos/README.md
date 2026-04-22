# logos/ — deprecated (2026-04-21)

This directory is **no longer the source of truth** for sport logo images.

All sport banner + logo artwork now lives in Cloudflare R2:

- **Bucket:** `oss-assets`
- **Public CDN:** `https://assets.opensourcesports.io`
- **Paths:**
  - `banners/<sport-slug>.<ext>` — sport hero banners
  - `logos/<sport-slug>.<ext>` — sport logos (admin uploads)
  - `logos/sports/<slug>.<ext>` / `logos/orgs/<slug>.<ext>` — legacy batch-uploaded logos (still served)

## Why the move

- raw.githubusercontent.com is rate-limited (5000 req/hr/IP) and has no CDN
- Storing 10k+ binaries in a public repo bloats every clone
- Cloudflare's R2 free tier covers unlimited read egress through the Cloudflare edge

## How to add or replace an image

Use the app — not git:

1. **Admin (any sport, including official):** log into opensourcesports.io
   with a Keycloak account that has the `admin` realm role, go to
   `/admin/sport-images`, search the sport, upload a new banner or logo.
2. **Creator (own custom sport):** open your sport's `/rules/<slug>` page,
   use the inline banner/logo upload card.

Both flows call `src/lib/r2-upload.ts` which signs a direct PUT to
`oss-assets` via AWS SigV4 and updates the DB `sports.banner_url` /
`sports.logo_url` to the new CDN URL.

## Do not commit new images here

Anything placed in this directory is cruft — the app never reads from
`raw.githubusercontent.com` anymore. The sync pipeline (`src/lib/sync/`)
pulls only `*.html` rulebooks from this repo.

Related:
- Cleanup script: `apps/open-source-sports/scripts/cleanup-data-repo-assets.mjs`
- Backfill script: `apps/open-source-sports/scripts/backfill-r2-images.mjs`
- Docs: `docs/oss/PROCESS.md` → "Image storage (Cloudflare R2)"
