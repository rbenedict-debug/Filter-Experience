# By Purchase Order — assets integration

## Scope of this spec

The By Purchase Order page (`/assets/by-purchase-order`) is already in production.
The handoff adds the new filter modal integration with an updated toolbar and the
applied filters bar.

The Save View button hooks into the existing custom-views feature, which is already
on production and not part of this handoff.

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

## Filter integration

Same as By Locations — engineering creates a filter shell for this page. The purchase
order filter group should include the same kinds of fields as `FILTER_GROUPS_FEES`
(cost-range, text-match for PO numbers, date-range for issue/delivery dates) — see
`specs-filter-engine.md` for field types.

```html
<app-by-purchase-order-filter-shell
  [(open)]="filterOpen"
  (filterCountChange)="onFilterCountChange($event)"
/>
```

## Applied filters bar

Standard markup — already present.

## Required reading

1. `.claude/specs/shared/specs-filter-engine.md` — pay attention to `cost-range`,
   `text-match`, and `date-range` field types
2. `.claude/specs/assets/specs-asset-views.md` — same-pattern reference page
