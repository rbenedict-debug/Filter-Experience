import {
  Component,
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  ViewChild,
  inject,
  signal,
  OnInit,
  AfterViewInit,
  OnDestroy,
} from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { DsTableToolbarComponent } from '@onflo/design-system';
import { CustomReportsFilterShellComponent } from './filter-shell/custom-reports-filter-shell.component';
import { SaveViewModalComponent } from '../shared/save-view-modal/save-view-modal.component';
import { SavedViewsService, SavedView } from '../../../core/services/saved-views.service';

@Component({
  selector: 'app-custom-reports',
  standalone: true,
  imports: [DsTableToolbarComponent, CustomReportsFilterShellComponent, SaveViewModalComponent],
  templateUrl: './custom-reports.component.html',
  styleUrls: ['./custom-reports.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CustomReportsComponent implements OnInit, AfterViewInit, OnDestroy {
  private readonly cdr               = inject(ChangeDetectorRef);
  private readonly route             = inject(ActivatedRoute);
  private readonly router            = inject(Router);
  private readonly savedViewsService = inject(SavedViewsService);

  @ViewChild(CustomReportsFilterShellComponent) private filterShell!: CustomReportsFilterShellComponent;

  isSavedView       = false;
  currentSavedView: SavedView | null = null;
  saveViewModalOpen = false;
  saveViewModalMode: 'save' | 'edit' = 'save';

  filterOpen         = false;
  filterCount        = 0;
  settingsActive     = false;
  selectedCount      = signal(0);
  filterBarCollapsed = signal(false);

  private _viewReady = false;
  private _paramSub?: Subscription;

  ngOnInit(): void {
    this._paramSub = this.route.paramMap.subscribe(params => {
      const id   = params.get('id');
      const view = id ? this.savedViewsService.getById(id) : null;

      if (view) {
        this.isSavedView      = true;
        this.currentSavedView = view;
        this.filterCount      = view.filterCount;
        this.filterBarCollapsed.set(true);
      } else {
        this.isSavedView      = false;
        this.currentSavedView = null;
        this.filterBarCollapsed.set(false);
        this.filterCount      = 0;
      }
      this.cdr.markForCheck();

      if (this._viewReady) {
        if (view) {
          this.filterShell.setState(view.filterState as unknown as Record<string, unknown>);
          this.filterShell.applySilent();
        } else {
          this.filterShell.resetState();
        }
      }
    });
  }

  ngAfterViewInit(): void {
    this._viewReady = true;
    if (this.isSavedView && this.currentSavedView) {
      this.filterShell.setState(this.currentSavedView.filterState as unknown as Record<string, unknown>);
      this.filterShell.applySilent();
    } else {
      this.filterShell.resetState();
    }
  }

  onSave(): void {
    this.saveViewModalMode = 'save';
    this.saveViewModalOpen = true;
  }

  onEditView(): void {
    this.saveViewModalMode = 'edit';
    this.saveViewModalOpen = true;
  }

  onSaveViewConfirmed(name: string): void {
    const filterState = this.filterShell.getState();
    if (!filterState) return;

    if (this.isSavedView && this.currentSavedView) {
      this.savedViewsService.update(this.currentSavedView.id, {
        name,
        filterState: filterState as unknown as SavedView['filterState'],
        filterCount: this.filterCount,
        dateLabel:   '',
      });
      this.currentSavedView = { ...this.currentSavedView, name, filterCount: this.filterCount };
      this.cdr.markForCheck();
    } else {
      const newView = this.savedViewsService.save({
        name,
        sourcePage:  'custom-reports',
        filterState: filterState as unknown as SavedView['filterState'],
        filterCount: this.filterCount,
        dateLabel:   '',
      });
      this.router.navigate(['/analytics/custom-reports/saved-views', newView.id]);
    }
  }

  onSaveViewDeleted(): void {
    if (this.currentSavedView) {
      this.savedViewsService.delete(this.currentSavedView.id);
    }
    this.router.navigate(['/analytics/custom-reports']);
  }

  onAddReport(): void {}

  onDeleteSelected(): void {}

  onFilterCountChange(count: number): void {
    this.filterCount = count;
    this.filterOpen  = false;
    if (count === 0 && !this.isSavedView) this.filterBarCollapsed.set(false);
    this.cdr.markForCheck();
  }

  toggleFilterBar(): void {
    this.filterBarCollapsed.update(v => !v);
  }

  ngOnDestroy(): void {
    this._paramSub?.unsubscribe();
  }
}
