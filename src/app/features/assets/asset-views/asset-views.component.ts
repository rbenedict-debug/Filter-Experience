import { Component, ChangeDetectionStrategy, signal } from '@angular/core';
import { DsTableToolbarComponent } from '@onflo/design-system';
import { AssetFilterShellComponent } from './filter-shell/asset-filter-shell.component';

@Component({
  selector: 'app-asset-views',
  standalone: true,
  templateUrl: './asset-views.component.html',
  styleUrls: ['./asset-views.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    DsTableToolbarComponent,
    AssetFilterShellComponent,
  ],
})
export class AssetViewsComponent {
  settingsActive      = false;
  filterOpen          = false;
  filterCount         = 0;
  filterBarCollapsed  = signal(false);

  activeTab = signal<'assets' | 'parts'>('assets');
  setTab(tab: 'assets' | 'parts'): void { this.activeTab.set(tab); }

  onSettingsToggle(active: boolean): void {
    this.settingsActive = active;
  }

  onFilterToggle(active: boolean): void {
    this.filterOpen = active;
  }

  onFilterCountChange(count: number): void {
    this.filterCount = count;
    if (count === 0) this.filterBarCollapsed.set(false);
  }

  toggleFilterBar(): void {
    this.filterBarCollapsed.update(v => !v);
  }
}
