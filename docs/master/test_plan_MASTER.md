## Project-wide Test Strategy
(Written by AA-1 Stage 2 — never modified again)
- Auth: storageState reused from AA-1 across all epics
- Data: faker timestamps, API seeding, unique per test
- CI: smoke on every PR, regression nightly, critical-path pre-release
- Workers: 2 (shared demo store)

## Project-wide Risk Register
(Written by AA-1 Stage 2 — never modified again)
| Risk | Likelihood | Impact | Mitigation |
|---|---|---|---|
| Shared demo store — no data reset | High | High | Unique data per test |
| Cloudflare bot-challenge on practicesoftwaretesting.com | Medium | High | Run headed/real-browser contexts; avoid pure API-only login where challenge intercepts |
| Network flakiness on demo store | Medium | Medium | retries: 2 in CI |
| Test data collision across epics | Low | High | worker namespacing |

## Test Plan Status by Epic
| Epic | Title | Status | Stories | Approved By | Timestamp |
|---|---|---|---|---|---|
| AA-1 | User Authentication & Account Management | ✅ Approved | 5 | Varun Oberoi | 2026-08-07 |
| AA-2 | Product Catalog Browsing & Search | ⏳ Pending | — | — | — |
| AA-3 | Shopping Cart Management | ⏳ Pending | — | — | — |
| AA-4 | Checkout & Order Placement | ⏳ Pending | — | — | — |
| AA-5 | Order History & Invoices | ⏳ Pending | — | — | — |
| AA-6 | Favorites / Wishlist | ⏳ Pending | — | — | — |
| AA-7 | Contact & Customer Support | ⏳ Pending | — | — | — |
| AA-8 | Admin — Product & Catalog Management | ⏳ Pending | — | — | — |
| AA-9 | Admin — Order & User Management | ⏳ Pending | — | — | — |
