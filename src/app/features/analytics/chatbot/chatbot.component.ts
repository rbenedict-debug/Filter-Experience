import { Component, ChangeDetectionStrategy, ChangeDetectorRef, inject, signal, computed, OnDestroy } from '@angular/core';
import { DatePipe } from '@angular/common';
import { DsTableToolbarComponent } from '@onflo/design-system';
import { ChatbotFilterShellComponent } from './filter-shell/chatbot-filter-shell.component';
import { ShareDashboardModalComponent } from '../shared/share-dashboard-modal/share-dashboard-modal.component';

type ChatbotTab = 'overview' | 'optimization' | 'chat-logs';

@Component({
  selector: 'app-chatbot',
  standalone: true,
  imports: [DatePipe, DsTableToolbarComponent, ChatbotFilterShellComponent, ShareDashboardModalComponent],
  templateUrl: './chatbot.component.html',
  styleUrls: ['./chatbot.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ChatbotComponent implements OnDestroy {
  private readonly cdr = inject(ChangeDetectorRef);

  activeTab = signal<ChatbotTab>('overview');

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

  toggleDateMenu():      void { this.dateMenuOpen      = !this.dateMenuOpen; }
  toggleTableDateMenu(): void { this.tableDateMenuOpen = !this.tableDateMenuOpen; }
  toggleProfileMenu():   void { this.profileMenuOpen   = !this.profileMenuOpen;  this.languageMenuOpen = false; }
  toggleLanguageMenu():  void { this.languageMenuOpen  = !this.languageMenuOpen; this.profileMenuOpen  = false; }

  selectTableDate(label: string): void {
    this.tableDateLabel   = label;
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
    if (count === 0) this.filterBarCollapsed.set(false);
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
  }

  onDownload(): void {}
  onShare():    void { this.shareOpen = true; }
  onSave():     void {}

}
