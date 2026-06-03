# Tickets — How Filters & Saved Views Work

A behavioral reference for the two features the Tickets team owns: the **filter modal** and
**saved views**. This describes *what happens* — the states each feature moves through, what each
action does, and the edge and error cases — not how it's built.

For the full list of which filters exist, see [`inbox-filter-reference.md`](./inbox-filter-reference.md).
Both features behave the same on the **Inbox** and on a **saved view's page**.

---

## Filters

### The core idea: a draft you preview, then apply

Opening the filter modal puts you in an **editing** state. Every change you make there is a
**draft** — it does **not** affect the ticket list yet. Nothing is "live" until you press **Apply**.

The filter has two states:

| State | What it means |
|---|---|
| **Closed** | The modal is hidden. Whatever was last applied is currently in effect. |
| **Editing** | The modal is open. You're building a draft that previews, but isn't yet active. |

```
 CLOSED                                    EDITING
 (applied filters in effect)               (changes are a draft, not yet live)

      ── open filter ──────────────────────►
      ◄───────────────── Apply ──────────────   draft becomes active → badge + bar update
      ◄──────────── Cancel (X / Esc / outside) ─ draft discarded → nothing changes

 While EDITING, "Clear All" empties the draft but stays open — you still press Apply to commit it.
```

### What each way out of the modal does

- **Apply** — the draft becomes the active filter set. The modal closes, the count badge updates,
  and the applied-filters bar refreshes.
- **Cancel** — closing without applying (the X, the Esc key, or clicking outside the modal)
  **throws the draft away** and snaps back to whatever was applied before. Backing out is always
  safe; you can never half-apply something by accident.
- **Clear All** — empties every selection in the draft but keeps the modal open. The cleared state
  is still just a draft, so the user must Apply to actually return to "no filters."

### How filters combine — Basic vs. Advanced

- **Basic** — everything the user picks is combined with **AND**: a ticket has to match all of it.
- **Advanced** — the same filters, plus the ability to choose **Match all (AND)** or
  **Match any (OR)**, pick an **operator** per filter (is any of, contains, is between, and so on),
  and bundle filters into a **group** with its own all/any setting. Grouping goes one level deep.
- **Include vs. Exclude** — any filter where you pick from a list can be flipped to **Exclude**,
  meaning "show everything that does *not* match these."

### What the filter count means

- Each applied filter counts as **one** — a status pick, a date range, a text match each add 1.
- Flipping a filter to **Exclude** doesn't add to the count; it's a setting on an existing filter,
  not a separate one.
- The count is what drives the **badge** on the filter button and the **applied-filters bar**.

### The applied-filters bar

The strip beneath the toolbar that summarizes what's active.

- **Hidden** entirely when nothing is applied.
- Shows **one chip per active filter** once at least one is applied.
- Can be **collapsed and expanded** ("Show filters" / "Hide filters"). Collapsed, it shrinks to a
  single "N active filters" summary.
- **Resets to expanded automatically** whenever the count drops back to zero.

### Saved filter sets — reusable combinations *inside* the modal

Distinct from saved views (below). Inside the modal, a user can **name and save the current filter
combination** to reuse later:

- **Loading** a set drops its whole combination into the draft.
- If the user **changes** a loaded set, it's flagged as modified — they can **update** the set to
  overwrite it, or leave it as a one-off without touching the saved original.
- These are personal reuse shortcuts for the filter modal; they are **not** the same thing as a
  saved view in the subnav.

### Empty and edge states (filters)

- **No filters applied** — no badge, the applied bar is hidden, the full ticket list shows.
- **Cancelled mid-edit** — the ticket list and the previously applied filters are untouched.
- **Very long option lists** (people, locations, etc.) — the list shows a first batch with a
  **"Show more"** to reveal the rest, rather than dumping everything at once. Typing in the modal's
  search narrows long lists too.

---

## Saved Views

### What a saved view is

A **named entry in the Tickets subnav** that the user can return to. Each one shows a **count
badge** of how many tickets it matches.

### What a saved view remembers — and what it doesn't

When the user saves a view, it captures:

- the **name**,
- which **inbox tab** was active (My Tickets / Team / All / Closed), and
- **how many filters** were applied at the time.

> **Read this — it's the one surprising part.** Reopening a Tickets saved view restores the **tab**
> and the **filter count** (so the badge and the applied-filters bar look right), but it does **not**
> re-apply the *actual filter selections*. The user lands on the right tab with the right summary,
> but the live filter set isn't rebuilt from the saved view. Worth knowing so the behavior doesn't
> read as a bug. (The Analytics saved views *do* fully restore their selections — that's the
> reference behavior if Tickets ever needs the same.)

### The lifecycle

```
 Save View → name it → the view joins the subnav → you land on its page
                                                       │
                                            ┌──────────┴──────────┐
                                        Edit (rename)          Delete
                                                                 │
                                                          back to the Inbox
```

- **Save** — the user names the view; it appears in the subnav and they're taken straight to it.
- **Open** — picking it in the subnav opens its own page, titled with the view's name, with the
  badge and applied-filters bar reflecting the saved count.
- **Edit** — renames the view in place; the user stays on the same page.
- **Delete** — removes the view and returns the user to the Inbox.

### The built-in demo view

The subnav always shows one **example view** for reference. It isn't user-created and **can't be
renamed or deleted** — attempts to edit or remove it are ignored. Treat it as a fixture, not real
user data.

### Empty and edge states (saved views)

- **Opening a view that no longer exists** (it was deleted, or the link is stale) — the user lands
  on an **empty page simply titled "Saved View"** with no filters. It's a graceful empty state, not
  an error screen.
- **Editing or deleting the demo view** — silently does nothing.
- **Saving with no filters applied** — allowed; the view is created with a filter count of zero.

---

## How the three "saved" things differ

It's easy to conflate these — they're separate:

| Thing | What it is | Where the user finds it |
|---|---|---|
| **Applied filters** | The live, in-the-moment selection acting on the ticket list | The filter button + applied-filters bar |
| **Saved filter set** | A reusable filter combination saved *inside* the modal | The filter modal |
| **Saved view** | A named bookmark of a tab + filter summary | The Tickets subnav |
