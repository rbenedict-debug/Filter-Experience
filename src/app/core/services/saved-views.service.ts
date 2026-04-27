import { Injectable, signal } from '@angular/core';

export interface SavedFilterState {
  selected: string[];
  excludedBuckets: string[];
  fieldDateDrafts: Record<string, unknown>;
  costRangeDraft: { min: number | null; max: number | null };
  numericRangeDrafts: Record<string, unknown>;
  timeRangeDrafts: Record<string, unknown>;
  textMatchDrafts: Record<string, unknown>;
  dateRangeDraft: { start: string | null; end: string | null };
  datePickerMode: string;
  context: string;
}

export interface SavedView {
  id: string;
  name: string;
  sourcePage: string;
  filterState: SavedFilterState;
  filterCount: number;
  dateLabel: string;
  createdAt: string;
}

const STORAGE_KEY = 'onflo-saved-views';

@Injectable({ providedIn: 'root' })
export class SavedViewsService {
  private readonly _views = signal<SavedView[]>(this._load());
  readonly savedViews = this._views.asReadonly();

  private _load(): SavedView[] {
    try {
      return JSON.parse(localStorage.getItem(STORAGE_KEY) ?? '[]');
    } catch {
      return [];
    }
  }

  private _persist(views: SavedView[]): void {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(views));
    this._views.set(views);
  }

  save(view: Omit<SavedView, 'id' | 'createdAt'>): SavedView {
    const newView: SavedView = {
      ...view,
      id: 'sv-' + Date.now().toString(36),
      createdAt: new Date().toISOString(),
    };
    this._persist([...this._views(), newView]);
    return newView;
  }

  update(id: string, updates: Partial<Pick<SavedView, 'name' | 'filterState' | 'filterCount' | 'dateLabel'>>): void {
    this._persist(this._views().map(v => v.id === id ? { ...v, ...updates } : v));
  }

  delete(id: string): void {
    this._persist(this._views().filter(v => v.id !== id));
  }

  getById(id: string): SavedView | undefined {
    return this._views().find(v => v.id === id);
  }
}
