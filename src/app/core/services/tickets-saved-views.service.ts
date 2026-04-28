import { Injectable, computed, signal } from '@angular/core';

export interface TicketSavedView {
  id: string;
  name: string;
  activeTab: 'my-tickets' | 'team' | 'all' | 'closed';
  filterCount: number;
  /**
   * Ticket count stub — always 0 on the frontend.
   * Backend must populate via: GET /api/tickets/saved-views/:id/count → { count: number }
   * The app shell should call this for each saved view on load and refresh on a cadence
   * (suggested: every 60s while the tickets section is active). The response is written
   * back to this field and the subnav badge updates reactively.
   */
  ticketCount: number;
  createdAt: string;
}

const STORAGE_KEY = 'onflo-ticket-saved-views';

// Fixture view — always present in the subnav for visual reference.
// Never persisted to localStorage; guarded from delete/update.
const DEMO_VIEW: TicketSavedView = {
  id: 'demo-badge-view',
  name: 'Open Escalations',
  activeTab: 'all',
  filterCount: 2,
  ticketCount: 247,
  createdAt: '2025-01-01T00:00:00.000Z',
};

@Injectable({ providedIn: 'root' })
export class TicketsSavedViewsService {
  private readonly _views = signal<TicketSavedView[]>(this._load());
  readonly savedViews = computed(() => [DEMO_VIEW, ...this._views()]);

  private _load(): TicketSavedView[] {
    try {
      return JSON.parse(localStorage.getItem(STORAGE_KEY) ?? '[]');
    } catch {
      return [];
    }
  }

  private _persist(views: TicketSavedView[]): void {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(views));
    this._views.set(views);
  }

  save(view: Omit<TicketSavedView, 'id' | 'createdAt'>): TicketSavedView {
    const newView: TicketSavedView = {
      ...view,
      id: 'tsv-' + Date.now().toString(36),
      createdAt: new Date().toISOString(),
    };
    this._persist([...this._views(), newView]);
    return newView;
  }

  update(id: string, updates: Partial<Pick<TicketSavedView, 'name' | 'filterCount' | 'ticketCount' | 'activeTab'>>): void {
    if (id === DEMO_VIEW.id) return;
    this._persist(this._views().map(v => v.id === id ? { ...v, ...updates } : v));
  }

  delete(id: string): void {
    if (id === DEMO_VIEW.id) return;
    this._persist(this._views().filter(v => v.id !== id));
  }

  getById(id: string): TicketSavedView | undefined {
    if (id === DEMO_VIEW.id) return DEMO_VIEW;
    return this._views().find(v => v.id === id);
  }
}
