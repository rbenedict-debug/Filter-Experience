import { Component, ChangeDetectionStrategy, signal } from '@angular/core';
import { DsTableToolbarComponent } from '@onflo/design-system';
import { FilterShellComponent } from './filter-shell/filter-shell.component';

@Component({
  selector: 'app-inbox',
  standalone: true,
  templateUrl: './inbox.component.html',
  styleUrls: ['./inbox.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    DsTableToolbarComponent,
    FilterShellComponent,
  ],
})
export class InboxComponent {
  settingsActive      = false;
  filterOpen          = false;
  filterCount         = 0;
  filterBarCollapsed  = signal(false);
  viewDirty           = signal(false);

  activeTab = signal<'my-tickets' | 'team' | 'all' | 'closed'>('my-tickets');
  setTab(tab: 'my-tickets' | 'team' | 'all' | 'closed'): void { this.activeTab.set(tab); }

  onSettingsToggle(active: boolean): void {
    this.settingsActive = active;
  }

  onFilterToggle(active: boolean): void {
    this.filterOpen = active;
  }

  onFilterCountChange(count: number): void {
    this.filterCount = count;
    this.viewDirty.set(count > 0);
    if (count === 0) this.filterBarCollapsed.set(false);
  }

  toggleFilterBar(): void {
    this.filterBarCollapsed.update(v => !v);
  }

  onSaveView(): void {
    // TODO: open save-view dialog
  }

  onAdvancedSearch(): void {
    // TODO: open advanced search
  }
}
