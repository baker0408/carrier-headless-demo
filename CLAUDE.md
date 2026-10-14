# Carrier Comfort360 — Headless B2B Commerce Storefront

A React 19 + Vite + Tailwind + shadcn storefront (Salesforce's
`trailheadapps/commerce-b2b-headless` reference app) configured, branded, and
deployed as a **Multi-framework React UI Bundle** into the `carrier` demo org.
It runs as its own Experience Cloud site alongside — not replacing — the
existing LWR B2B store.

## Org Connection

- **Org alias:** `carrier`
- **Username:** `justin.baker.ee1a58fa71@salesforce.com`
- **Instance:** `https://trailsignup-07ac37175498d3.my.salesforce.com`
- **Org Id:** `00Dfj00000kUocnEAC`
- **Org API version:** `68.0`

All `sf` CLI commands in this project MUST use `--target-org carrier`.
Do NOT use `org62` — that is the internal Salesforce production org.

## Platform Prerequisite (REQUIRED)

The **Multi-framework React UI Bundle** platform feature must be enabled on the
org before the `uiBundle` metadata will deploy. It **is enabled** on `carrier`
(verified 2026-10-14 — the full bundle deployed, 145/145 components, 0 errors).
On an org without it, `sf project deploy start` fails on the `uiBundles/`
component; enable the feature first, then redeploy.

## Live Storefront

`https://trailsignup-07ac37175498d3.my.site.com/commerceb2bheadlessvforcesite`

All SPA pages are auth-gated (standard B2B behavior): a guest at the root is
sent to the Experience Cloud login, and the Carrier-branded React app renders
only inside the authenticated buyer session.

**Verified live 2026-10-14** (logged in as buyer **Lauren Bailey**,
`lauren@example.demo`): Carrier branding renders in the SPA, the PLP shows all
12 categories and Carrier products with real SKUs, a PDP opens, and add-to-cart
round-trips through the v67 Commerce API against the 68.0 org (cart badge → 1).

> Note: products currently show **"Request quote"** rather than a price —
> Lauren's **Cirrus Silver** buyer group maps to a no-price entitlement in this
> SDO. That is store-side pricing data, not a storefront issue; the quote /
> add-to-cart flow works regardless.

## Key Org IDs & Config (verified 2026-10-14)

The headless app points at the **same** B2B webstore as the existing LWR store —
it reuses that store's catalog, price books, entitlement policy, and buyer
groups. It does **not** create its own commerce data.

| Purpose | Name | ID |
|---|---|---|
| B2B WebStore (shared with LWR store) | SDO - B2B Commerce Enhanced | `0ZEfj0000020cH3GAI` |
| Registration buyer group | North America | `0ZIfj000000CaMHGA0` |
| New Experience Cloud site/network | commerceb2bheadless | — |

**Config touchpoints** (where the reference app's placeholders were filled in):

- `force-app/main/default/uiBundles/commerceb2bheadless/src/config/commerce.ts`
  — `WEBSTORE_ID = "0ZEfj0000020cH3GAI"`, `API_VERSION = "v67.0"` (reference-app
  default; works against the 68.0 org).
- `force-app/main/default/classes/UIBundleRegistration.cls`
  — `DEFAULT_BUYER_GROUP_ID = '0ZIfj000000CaMHGA0'` (North America),
  `BUYER_PERMISSION_SET_GROUP = 'SDO_B2BCommerce_Base_Buyer'` (the PSG all SDO
  Cirrus buyers already hold; self-registered buyers are added to the group and
  assigned the PSG).
- `force-app/main/default/networks/commerceb2bheadless.network-meta.xml`
  — member-group profiles `admin`, `B2B Buyer Profile`, and
  `sdo-customer community plus`. The last was added so existing SDO B2B buyers
  (e.g. Lauren) can authenticate — it mirrors the proven SDO - B2B Commerce
  Enhanced network's buyer-access profile.

**Branding** (Carrier Comfort360):

- Logo + hero: `src/assets/carrier-logo.png`, `src/assets/carrier-hero.png`
  (the two verified-real Carrier images, reused from `../carrier v2`).
- Theme: `src/styles/global.css` tokens recolored to Carrier blue
  (`--primary: oklch(0.42 0.15 258)` ≈ `#003DA5`; dark accent
  `oklch(0.31 0.13 262)` ≈ `#002A6E`); body font **Inter** (loaded in
  `index.html`).
- Copy: header wordmark → Carrier logo; hero → "48FE WeatherMaker Parts" /
  "Comfort360 Dealer Parts" (`src/pages/commerce/Storefront.tsx`); page titles →
  "… | Carrier Comfort360" (`src/config/auth.ts`); `index.html` title.

## Build & Deploy

```bash
# 1. Build the React bundle (writes dist/, which the DX deploy picks up)
cd force-app/main/default/uiBundles/commerceb2bheadless
npm install
npm run build                         # tsc -b && vite build

# 2. Deploy the configured source into the org
cd -                                  # repo root
sf project deploy start --target-org carrier

# 3. Publish the Experience Cloud site
sf community publish --name commerceb2bheadless --target-org carrier
```

- `dist/`, `build/`, and `node_modules/` are build artifacts — gitignored,
  never committed.
- To redeploy only the network after a member-group change:
  `sf project deploy start --target-org carrier --metadata "Network:commerceb2bheadless"`
  then republish.

## Coexistence & Reversibility

- **Additive only.** This project added a new site/network, the UI bundle, the
  `UIBundleRegistration` Apex + guest permset, and one profile line on the new
  network. It did **not** modify the webstore, catalog, price books, entitlement
  policy, product data, or the existing LWR store.
- The LWR B2B store (`b2benhancedvforcesite`, Carrier-rebranded in `../carrier
  v2`) continues to run independently — verified still loading after this
  deploy.
- **Rollback:** destructively delete only the newly deployed site/network/
  bundle/classes/permset, and remove the `sdo-customer community plus` line from
  the new network. Never touch the webstore or product data.

## Relationship to `../carrier v2`

`../carrier v2` is the **LWR** (Experience Builder) Carrier storefront on the
same webstore — the catalog load + rebrand record. This repo is the **headless
React** storefront on that same store. The two share the webstore, catalog,
price books, and buyer groups; they differ only in the UI framework and the
Experience Cloud site that serves it.
