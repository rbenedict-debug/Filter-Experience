# Dashboard — Filters & Saved Views (How It Works)

A plain-language reference for the **Dashboard team** explaining how the **filter modal**
and **saved views** behave on the analytics dashboards. This is a *how it works* document —
there's no code and no backend detail here. You're implementing it yourselves; this is so
everyone shares the same mental model of the behavior, including the edge and error states.

**Pages this applies to:** Service Overview, Custom Reports, and Comparison
(Users / Categories / Topics).

**Not covered:** the page shell, the toolbar/header buttons, and anything about how it's
wired or stored.

---

## 1. The mental model

There is **one** filter modal, reused across the whole app. Each page opens it pre-loaded
with the filters relevant to that page, and each page keeps **its own** active selection.

That single idea explains most of the behavior:

- Filters you set on one page **do not** carry over to another page.
- The modal is where you *build* a selection. The dashboard is where you *see the result*.
- Nothing on the dashboard changes until you **Apply**.

---

## 2. Each page has its own filters

| Page | Filters shown |
|---|---|
| Service Overview | The standard service filter set |
| Comparison · Users | Same set as Service Overview |
| Comparison · Categories | Same set as Service Overview |
| Comparison · Topics | Same set as Service Overview |
| Custom Reports | Its own, different filter set |

The four service-style pages offer the same filter options but track their selections
separately — opening the modal on Comparison · Users shows only what *that* page has active,
not what Service Overview has active.

---

## 3. Building and applying a filter

Working with the modal happens in a clear sequence:

1. **Open** the modal — you're now editing a **draft**. The dashboard behind it is untouched.
2. **Select** options, ranges, or text rules. Still just a draft; still no change to the page.
3. **Apply** — the draft becomes live. The dashboard updates and the filter count reflects
   what you applied.

What happens if you **don't** apply:

- **Closing the modal** (the close control, pressing Escape, or clicking outside it) **cancels**
  your edits. The draft is discarded and the dashboard stays exactly as it was. This is a safe,
  expected action — not an error.
- **Clear All** empties your current selections, but it's still just a draft change. The
  dashboard doesn't change until you Apply. Applying an empty selection returns the page to its
  unfiltered state.

The takeaway: only **Apply** changes the dashboard. Everything else is reversible.

---

## 4. Kinds of filters

Filters come in a few shapes. The team doesn't build these individually — the modal already
provides them — but it helps to know what a user can set:

- **Option lists** — pick one or many values (statuses, categories, owners, and so on). Any
  list filter can be flipped to **Exclude**, meaning "show everything *except* what I picked."
- **Date** — either quick presets (Last 30 days, This month…) or a specific date range.
- **Number ranges** — a low/high band for things like cost, counts, or durations.
- **Time-of-day ranges** — a band across the clock (e.g. 9:00 AM – 5:00 PM).
- **Text match** — a rule like *contains*, *equals*, *begins with*, etc.

**What the count badge means:** it counts each active selection — every option you tick, plus
each range or text rule you set, each counting as one. Switching a filter to **Exclude** does
**not** add to the count; it's still one filter, just inverted.

**How ranges behave at the edges:** setting only one side of a range means "open-ended" (e.g.
"$1,000 and up"). Leaving both sides blank means that range isn't active at all.

---

## 5. States & error handling

This is the part to get right. Here is every state the filter experience can be in, and what
the user should see.

| Situation | What happens |
|---|---|
| **No filters applied** (default) | The dashboard shows all data for the current date range. The applied-filters bar is hidden. The count badge is empty. |
| **Filters applied, results found** | The dashboard narrows to the matching data. The applied-filters bar lists the active filters, and the count badge shows how many are active. |
| **Filters applied, nothing matches** | The dashboard shows its **empty / no-results** state. The filter itself hasn't failed — it simply returned nothing. The user can loosen or clear filters directly from the applied-filters bar. The team owns presenting a clear "no results for these filters" message rather than a blank dashboard. |
| **Editing, then cancelling** | Closing without Apply restores the previous state. No change, no error message needed. |
| **Clear All** | Empties the draft selections. Nothing changes on the page until Apply. Applying empty returns to the no-filters state. |
| **Date set in the filter *and* in the toolbar** | The filter's date takes precedence; the toolbar date control shows as overridden so the user knows which one is winning. Choosing a date from the toolbar clears the filter's date and hands control back to the toolbar. |
| **A range entered backwards or blank** | A one-sided range is treated as open-ended. A fully blank range is treated as "not set." The range should never apply an impossible "minimum above maximum" band — guard against it so the user always gets a sensible result. |

The guiding principle for error states: **the filter narrows a query — it should never break
the page.** Worst case is "no results," and that must be communicated clearly, with an easy way
back (clear filters).

---

## 6. How filters persist

- Within a working session, applied filters are meant to **survive a page refresh** — a user
  who reloads should land back on the same filtered view.
- Filters do **not** survive a **logout**. Logging out and back in returns the user to a clean,
  unfiltered page.
- If a user wants a filter combination to last beyond the session, the durable path is to
  **save a view** (next section).

---

## 7. Saved views — what they are

A **saved view** is a named snapshot of a page's current filter selection (including its date
range). It lets a user return to exactly that filtered view later without rebuilding it.

- A saved view belongs to **one specific page**.
- It remembers the selection *and* the count and date label, so everything looks the same when
  the user comes back to it.
- Saved views appear in the Analytics saved-views list so users can find and return to them.

---

## 8. How saving works

1. The user applies the filters they want.
2. They choose to save the view and give it a **name** (a name is required — a view can't be
   saved nameless).
3. Once saved, the view becomes its **own destination**: it shows up in the saved-views list
   and can be opened directly.

From then on, opening that view restores the same filters automatically.

**Editing an existing view's filters:** open the view, adjust the filters, and save the change
back onto the same view. The view updates in place — the user stays on it; a new view is not
created.

**Renaming:** a saved view can be renamed without changing its filters.

---

## 9. Returning to a saved view

When a user opens a saved view:

- The page restores the saved filters **silently** — the dashboard updates, and the count badge
  and date label come back to match the saved state.
- The filter modal does **not** pop open. It stays closed; the user can open it themselves if
  they want to see or tweak the restored filters.

Leaving a saved view (navigating back to the plain page) clears the restored filters and
returns the page to its unfiltered default.

---

## 10. Saved-view error states

| Situation | What happens |
|---|---|
| **Opening a saved view that no longer exists** (it was deleted, or the link doesn't resolve) | The app does **not** error out. It falls back to the base page with no filters applied. |
| **Deleting the view you're currently looking at** | The user is returned to the base page with filters cleared. |
| **Trying to save without a name** | The save can't complete until a name is provided. |
| **A saved view whose filter options have since changed** | Saved views store the selection itself. If options are later renamed or removed, parts of an old view may no longer match — plan for a **best-effort restore** (apply what still exists, ignore what doesn't) rather than failing the whole load. |

---

## 11. Two different "saves" — don't confuse them

There are two save features in the product, and they are **not** the same thing:

| | **Saved view** *(the dashboard feature)* | **Saved filter set** |
|---|---|---|
| What it saves | The whole page's filter state, plus its count and date | Just a reusable bundle of selections |
| Where it lives | At the page level — it's its own destination and shows in the saved-views list | Inside the filter modal, as a shortcut for re-applying common selections |
| Who returns to it | Anyone opening that saved view's page | A user re-opening the modal who wants a quick starting point |

The dashboard integration is about **saved views**. "Saved filter sets" are a convenience inside
the modal for quickly re-selecting a familiar combination. If a requirement says "save these
filters," confirm which of the two is meant.

---

## 12. Quick reference — the rules that don't change

- Nothing on the dashboard changes until **Apply**; closing the modal cancels.
- Each page keeps its own filters; they don't cross between pages.
- The count badge counts each active selection; Exclude doesn't add to it.
- A filter that matches nothing shows a **no-results** state — never a broken page.
- Applied filters survive a refresh, not a logout; **saved views** are the durable option.
- A saved view restores silently and is forgiving of a missing or outdated reference.

Service Overview is the reference page — the others behave the same way, with their own
page-specific extras.
