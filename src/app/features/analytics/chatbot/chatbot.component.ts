import {
  Component,
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  ViewChild,
  inject,
  signal,
  computed,
  OnInit,
  AfterViewInit,
  OnDestroy,
} from '@angular/core';
import { DatePipe } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { DsTableToolbarComponent } from '@onflo/design-system';
import { ChatbotFilterShellComponent } from './filter-shell/chatbot-filter-shell.component';
import { ShareDashboardModalComponent } from '../shared/share-dashboard-modal/share-dashboard-modal.component';
import { SaveViewModalComponent } from '../shared/save-view-modal/save-view-modal.component';
import { SavedViewsService, SavedView } from '../../../core/services/saved-views.service';

type ChatbotTab = 'overview' | 'optimization' | 'chat-logs';

@Component({
  selector: 'app-chatbot',
  standalone: true,
  imports: [DatePipe, DsTableToolbarComponent, ChatbotFilterShellComponent, ShareDashboardModalComponent, SaveViewModalComponent],
  templateUrl: './chatbot.component.html',
  styleUrls: ['./chatbot.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ChatbotComponent implements OnInit, AfterViewInit, OnDestroy {
  private readonly cdr               = inject(ChangeDetectorRef);
  private readonly route             = inject(ActivatedRoute);
  private readonly router            = inject(Router);
  private readonly savedViewsService = inject(SavedViewsService);

  @ViewChild(ChatbotFilterShellComponent) private filterShell!: ChatbotFilterShellComponent;

  activeTab = signal<ChatbotTab>('overview');

  isSavedView       = false;
  currentSavedView: SavedView | null = null;
  saveViewModalOpen = false;
  saveViewModalMode: 'save' | 'edit' = 'save';

  filterOpen          = false;
  filterCount         = 0;
  filterDateActive    = false;
  filterBarCollapsed  = signal(false);
  shareOpen           = false;
  settingsActive      = false;

  lastUpdated = new Date();

  dateMenuOpen      = false;
  tableDateMenuOpen = false;
  profileMenuOpen   = false;
  languageMenuOpen  = false;
  dateLabel      = 'Last 90 Days';
  tableDateLabel = 'Last 30 Days';

  private _viewReady = false;
  private _paramSub?: Subscription;

  private readonly onDateRangeSelected = (e: Event) => {
    const { label } = (e as CustomEvent<{ label: string }>).detail;
    this.dateLabel = label;
    this.cdr.markForCheck();
  };

  readonly dateOptions = [
    'All Time',
    'Current School Year',
    'Last School Year',
    'Last 90 Days',
    'Last 30 Days',
    'This Month',
    'Last 7 Days',
    'This Week',
  ];

  readonly profileOptions = [
    { id: 'prof-default',    label: 'Default Profile' },
    { id: 'prof-elementary', label: 'Elementary School' },
    { id: 'prof-middle',     label: 'Middle School' },
    { id: 'prof-high',       label: 'High School' },
    { id: 'prof-district',   label: 'District Office' },
  ];

  readonly languageOptions = [
    { id: 'lang-en', label: 'English' },
    { id: 'lang-ar', label: 'Arabic' },
    { id: 'lang-zh', label: 'Chinese (Simplified)' },
    { id: 'lang-fr', label: 'French' },
    { id: 'lang-es', label: 'Spanish' },
    { id: 'lang-ru', label: 'Russian' },
    { id: 'lang-ur', label: 'Urdu' },
    { id: 'lang-pl', label: 'Polish' },
    { id: 'lang-hi', label: 'Hindi' },
    { id: 'lang-uk', label: 'Ukrainian' },
  ];

  selectedProfile   = signal<string>('prof-default');
  selectedLanguages = signal<string[]>([]);

  profileLabel = computed(() =>
    this.profileOptions.find(o => o.id === this.selectedProfile())?.label ?? 'Default Profile'
  );

  languageLabel = computed(() => {
    const s = this.selectedLanguages();
    if (s.length === 0) return 'All Languages';
    if (s.length === 1) return this.languageOptions.find(o => o.id === s[0])?.label ?? 'Language';
    return `Languages (${s.length})`;
  });

  filterContext = computed(() => {
    const tab = this.activeTab();
    if (tab === 'overview') return 'chatbot-overview';
    return 'chatbot-chat-logs';
  });

  isTableTab        = computed(() => this.activeTab() === 'chat-logs');
  isOptimizationTab = computed(() => this.activeTab() === 'optimization');

  setTab(tab: ChatbotTab): void {
    if (this.activeTab() === tab) return;
    this.filterOpen        = false;
    this.filterCount       = 0;
    this.filterBarCollapsed.set(false);
    this.profileMenuOpen   = false;
    this.languageMenuOpen  = false;
    this.tableDateMenuOpen = false;
    this.activeTab.set(tab);
  }

  ngOnInit(): void {
    this._paramSub = this.route.paramMap.subscribe(params => {
      const id   = params.get('id');
      const view = id ? this.savedViewsService.getById(id) : null;

      if (view) {
        this.isSavedView      = true;
        this.currentSavedView = view;
        this.dateLabel        = view.dateLabel || 'Last 90 Days';
        this.filterCount      = view.filterCount;
        this.filterBarCollapsed.set(true);
      } else {
        this.isSavedView      = false;
        this.currentSavedView = null;
        this.dateLabel        = 'Last 90 Days';
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
        dateLabel:   this.dateLabel,
      });
      this.currentSavedView = { ...this.currentSavedView, name, filterCount: this.filterCount, dateLabel: this.dateLabel };
      this.cdr.markForCheck();
    } else {
      const newView = this.savedViewsService.save({
        name,
        sourcePage:  'chatbot',
        filterState: filterState as unknown as SavedView['filterState'],
        filterCount: this.filterCount,
        dateLabel:   this.dateLabel,
      });
      this.router.navigate(['/analytics/chatbot/saved-views', newView.id]);
    }
  }

  onSaveViewDeleted(): void {
    if (this.currentSavedView) {
      this.savedViewsService.delete(this.currentSavedView.id);
    }
    this.router.navigate(['/analytics/chatbot']);
  }

  toggleDateMenu():      void { this.dateMenuOpen      = !this.dateMenuOpen; }
  toggleTableDateMenu(): void { this.tableDateMenuOpen = !this.tableDateMenuOpen; }
  toggleProfileMenu():   void { this.profileMenuOpen   = !this.profileMenuOpen;  this.languageMenuOpen = false; }
  toggleLanguageMenu():  void { this.languageMenuOpen  = !this.languageMenuOpen; this.profileMenuOpen  = false; }

  selectTableDate(label: string): void {
    this.tableDateLabel    = label;
    this.tableDateMenuOpen = false;
  }

  selectProfile(id: string): void {
    this.selectedProfile.set(id);
    this.profileMenuOpen = false;
  }

  toggleLanguage(id: string): void {
    const current = this.selectedLanguages();
    this.selectedLanguages.set(
      current.includes(id) ? current.filter(x => x !== id) : [...current, id]
    );
  }

  isProfileSelected(id: string):  boolean { return this.selectedProfile()      === id; }
  isLanguageSelected(id: string): boolean { return this.selectedLanguages().includes(id); }

  clearLanguages(): void {
    this.selectedLanguages.set([]);
    this.languageMenuOpen = false;
  }

  selectDate(label: string): void {
    this.dateMenuOpen = false;
    if (this.filterDateActive) {
      window.filterModalClearDates?.();
    }
    if (label === 'Custom Date Range') {
      window.addEventListener('dateRangeSelected', this.onDateRangeSelected, { once: true });
      window.openDateRangePicker?.();
    } else {
      this.dateLabel = label;
    }
  }

  onFilterCountChange(count: number): void {
    this.filterCount = count;
    this.filterOpen  = false;
    if (count === 0 && !this.isSavedView) this.filterBarCollapsed.set(false);
    this.cdr.markForCheck();
  }

  toggleFilterBar(): void {
    this.filterBarCollapsed.update(v => !v);
  }

  onFilterDateActiveChange(active: boolean): void {
    this.filterDateActive = active;
    this.cdr.markForCheck();
  }

  ngOnDestroy(): void {
    window.removeEventListener('dateRangeSelected', this.onDateRangeSelected);
    this._paramSub?.unsubscribe();
  }

  onDownload(): void {}
  onShare():    void { this.shareOpen = true; }
}
