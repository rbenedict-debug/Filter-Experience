import { Component, ChangeDetectionStrategy, signal } from '@angular/core';
import { DsTableToolbarComponent, DsSkeletonComponent } from '@onflo/design-system';
import { FilterShellComponent } from './filter-shell/filter-shell.component';

@Component({
  selector: 'app-inbox',
  standalone: true,
  templateUrl: './inbox.component.html',
  styleUrls: ['./inbox.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    DsTableToolbarComponent,
    DsSkeletonComponent,
    FilterShellComponent,
  ],
})
export class InboxComponent {
  settingsActive = false;
  filterOpen     = false;
  filterCount    = 0;
  viewDirty      = signal(false);

  activeTab = signal<'my-tickets' | 'team' | 'all' | 'closed'>('my-tickets');
  setTab(tab: 'my-tickets' | 'team' | 'all' | 'closed'): void { this.activeTab.set(tab); }

  readonly skeletonRows = Array(12).fill(0);

  onSettingsToggle(active: boolean): void {
    this.settingsActive = active;
  }

  onFilterToggle(active: boolean): void {
    this.filterOpen = active;
  }

  onFilterCountChange(count: number): void {
    this.filterCount = count;
    this.viewDirty.set(count > 0);
  }

  onSaveView(): void {
    // TODO: open save-view dialog
  }

  onAdvancedSearch(): void {
    // TODO: open advanced search
  }
}
