# Thula Platform Handoff

## Local Run

From `thula-platform`:

```powershell
npm run dev
```

Open:

```text
http://localhost:3000
```

## Verification Commands

```powershell
npm run lint
npm run build
```

## Local Data

The app is local-only and stores data in:

- `data/thula-local.db`

No live SkyTradr site or database is used by this rewrite.

## Demo Accounts

- Buyer: `buyer@thula.local` / `demo1234`
- Seller: `seller@thula.local` / `demo1234`
- Admin: `admin@thula.local` / `demo1234`
- Operations: `ops@thula.local` / `demo1234`

## Main Areas

- Public: `/`, `/fleet`, `/contact`
- Buyer: `/account/offers`, `/account/transactions`, `/account/profile`, `/account/wallet`
- Seller: `/seller/listings`, `/seller/offers`, `/seller/transactions`, `/seller/profile`
- Admin: `/admin`, `/admin/listings`, `/admin/offers`, `/admin/transactions`, `/admin/users`, `/admin/cms`, `/admin/enquiries`, `/admin/leads`, `/admin/partners`, `/admin/reports`, `/admin/settings`, `/admin/staff`, `/admin/wallet`
- Operations: `/operations/transfers/pending`, `/operations/transfers/completed`

## Important Notes

- all payment, wallet, upload, and document behavior is local and simulated
- no live gateway or live DB integration exists
- the rewrite preserves workflow structure, but some deep Laravel behaviors are represented in simplified local form
- the current parity state is documented in `docs/parity-audit.md`
