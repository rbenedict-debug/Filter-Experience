import { Component, ChangeDetectionStrategy, signal, inject } from '@angular/core';
import { Router } from '@angular/router';
import { DsTableToolbarComponent } from '@onflo/design-system';
import { FilterShellComponent } from './filter-shell/filter-shell.component';
import { SaveViewModalComponent } from '../../analytics/shared/save-view-modal/save-view-modal.component';
import { TicketsSavedViewsService } from '../../../core/services/tickets-saved-views.service';

@Component({
  selector: 'app-inbox',
  standalone: true,
  templateUrl: './inbox.component.html',
  styleUrls: ['./inbox.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    DsTableToolbarComponent,
    FilterShellComponent,
    SaveViewModalComponent,
  ],
})
export class InboxComponent {
  private readonly router            = inject(Router);
  private readonly savedViewsService = inject(TicketsSavedViewsService);

  settingsActive      = false;
  filterOpen          = false;
  filterCount         = 0;
  filterBarCollapsed  = signal(false);
  viewDirty           = signal(false);
  saveViewOpen        = false;

  activeTab = signal<'my-tickets' | 'team' | 'all' | 'closed'>('my-tickets');
  setTab(tab: 'my-tickets' | 'team' | 'all' | 'closed'): void { this.activeTab.set(tab); }

  onSettingsToggle(active: boolean): void { this.settingsActive = active; }
  onFilterToggle(active: boolean): void   { this.filterOpen = active; }

  onFilterCountChange(count: number): void {
    this.filterCount = count;
    this.viewDirty.set(count > 0);
    if (count === 0) this.filterBarCollapsed.set(false);
  }

  toggleFilterBar(): void { this.filterBarCollapsed.update(v => !v); }

  onSaveView(): void { this.saveViewOpen = true; }

  onSaveViewConfirmed(name: string): void {
    const newView = this.savedViewsService.save({
      name,
      activeTab: this.activeTab(),
      filterCount: this.filterCount,
      ticketCount: 0,
    });
    this.router.navigateByUrl('/tickets/saved-views/' + newView.id);
  }

  onAdvancedSearch(): void {
    // TODO: open advanced search
  }
}
