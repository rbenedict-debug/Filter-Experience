import { Component, ChangeDetectionStrategy, signal } from '@angular/core';
import { DsTableToolbarComponent, DsSkeletonComponent } from '@onflo/design-system';
import { AssetFilterShellComponent } from './filter-shell/asset-filter-shell.component';

@Component({
  selector: 'app-asset-views',
  standalone: true,
  templateUrl: './asset-views.component.html',
  styleUrls: ['./asset-views.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    DsTableToolbarComponent,
    DsSkeletonComponent,
    AssetFilterShellComponent,
  ],
})
export class AssetViewsComponent {
  settingsActive = false;
  filterOpen     = false;
  filterCount    = 0;

  activeTab = signal<'assets' | 'parts'>('assets');
  setTab(tab: 'assets' | 'parts'): void { this.activeTab.set(tab); }

  readonly skeletonRows = Array(12).fill(0);

  onSettingsToggle(active: boolean): void {
    this.settingsActive = active;
  }

  onFilterToggle(active: boolean): void {
    this.filterOpen = active;
  }
}
