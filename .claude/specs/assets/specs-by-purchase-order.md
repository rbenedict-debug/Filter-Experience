# By Purchase Order — assets integration

## Scope of this spec

Same scope as Asset Views and the other By-X pages: integrate the new filter modal,
updated toolbar, applied filters bar, and Save View → custom view wiring on the
existing production page.

## Where things live

| Concern | File |
|---|---|
| Component | `src/app/features/assets/by-purchase-order/by-purchase-order.component.ts` |
| Template | `src/app/features/assets/by-purchase-order/by-purchase-order.component.html` |
| Filter shell | **Not yet created** — engineering builds this |

## Page identity

| | |
|---|---|
| Filter context key | `assets-purchase-orders` (engineering creates) |
| Filter groups | `FILTER_GROUPS_PURCHASE_ORDERS` (engineering defines) |
| Base route | `/assets/by-purchase-order` |

## Tabs

No tabs — single view of assets grouped by purchase order.

## Toolbar

Same `<ds-table-toolbar>` shape as Asset Views. Differences:

- `[showActions]="false"` — no Add/Import/Export
- `searchPlaceholder="Search purchase orders"`
- `toolbar-trailing` slot has the **Save View** text button

## Filter integration

Same as the other By-X pages — engineering creates a filter shell for this page
following the filter-shell pattern. The purchase-order filter group should include
the same kinds of fields as `FILTER_GROUPS_FEES` (cost-range, text-match for PO numbers,
date-range for issue/delivery dates) — see `specs-filter-engine.md` for field types.

## Applied filters bar

Standard markup — already present.

## Save View → custom view

Same pattern as Asset Views.

## Required reading

1. `.claude/specs/shared/specs-filter-engine.md` — pay attention to `cost-range`,
   `text-match`, and `date-range` field types since this page's filter group will use them
2. `.claude/specs/assets/specs-asset-views.md` — the canonical Save View → custom view flow
