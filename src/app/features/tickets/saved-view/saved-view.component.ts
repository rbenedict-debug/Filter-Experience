import {
  Component,
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  OnInit,
  AfterViewInit,
  inject,
  signal,
} from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { DsTableToolbarComponent } from '@onflo/design-system';
import { TicketsSavedViewsService, TicketSavedView } from '../../../core/services/tickets-saved-views.service';
import { FilterShellComponent } from '../inbox/filter-shell/filter-shell.component';
import { SaveViewModalComponent } from '../../analytics/shared/save-view-modal/save-view-modal.component';

@Component({
  selector: 'app-saved-view',
  standalone: true,
  templateUrl: './saved-view.component.html',
  styleUrls: ['./saved-view.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    DsTableToolbarComponent,
    FilterShellComponent,
    SaveViewModalComponent,
  ],
})
export class SavedViewComponent implements OnInit, AfterViewInit {
  private readonly route           = inject(ActivatedRoute);
  private readonly router          = inject(Router);
  private readonly savedViewsService = inject(TicketsSavedViewsService);
  private readonly cdr             = inject(ChangeDetectorRef);

  view             = signal<TicketSavedView | null>(null);
  settingsActive   = false;
  filterOpen       = false;
  filterCount      = 0;
  filterBarCollapsed = signal(true);
  editViewOpen     = false;

  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('id') ?? '';
    const view = this.savedViewsService.getById(id) ?? null;
    this.view.set(view);
    this.filterCount = view?.filterCount ?? 0;
  }

  // Re-run CD after filter shell's ngAfterViewInit so Angular re-asserts
  // [hidden]="filterCount === 0" after filterModalInit removes the attribute.
  ngAfterViewInit(): void {
    this.cdr.detectChanges();
  }

  onSettingsToggle(active: boolean): void { this.settingsActive = active; }
  onFilterToggle(active: boolean): void   { this.filterOpen = active; }

  onFilterCountChange(count: number): void {
    this.filterCount = count;
    if (count === 0) this.filterBarCollapsed.set(true);
    this.cdr.markForCheck();
  }

  toggleFilterBar(): void { this.filterBarCollapsed.update(v => !v); }

  onEditView(): void { this.editViewOpen = true; }

  onEditViewConfirmed(name: string): void {
    const v = this.view();
    if (!v) return;
    this.savedViewsService.update(v.id, { name });
    this.view.set({ ...v, name });
  }

  onDeleteView(): void {
    const v = this.view();
    if (!v) return;
    this.savedViewsService.delete(v.id);
    this.router.navigateByUrl('/tickets/inbox');
  }

  onAdvancedSearch(): void {
    // TODO: open advanced search
  }
}
