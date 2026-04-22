import { Component, ChangeDetectionStrategy, signal, computed } from '@angular/core';
import { DsTableToolbarComponent } from '@onflo/design-system';
import { ChatbotFilterShellComponent } from './filter-shell/chatbot-filter-shell.component';

type ChatbotTab = 'overview' | 'optimization' | 'chat-logs';

@Component({
  selector: 'app-chatbot',
  standalone: true,
  imports: [DsTableToolbarComponent, ChatbotFilterShellComponent],
  templateUrl: './chatbot.component.html',
  styleUrls: ['./chatbot.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ChatbotComponent {
  activeTab = signal<ChatbotTab>('overview');

  filterOpen     = false;
  filterCount    = 0;
  settingsActive = false;

  dateMenuOpen = false;
  dateLabel    = 'Last 90 Days';

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

  filterContext = computed(() => {
    const tab = this.activeTab();
    if (tab === 'overview')     return 'chatbot-overview';
    if (tab === 'optimization') return 'chatbot-optimization';
    return 'chatbot-chat-logs';
  });

  isTableTab = computed(() => this.activeTab() === 'chat-logs');

  setTab(tab: ChatbotTab): void {
    if (this.activeTab() === tab) return;
    this.filterOpen  = false;
    this.filterCount = 0;
    this.activeTab.set(tab);
  }

  toggleDateMenu(): void  { this.dateMenuOpen = !this.dateMenuOpen; }

  selectDate(label: string): void {
    this.dateLabel    = label;
    this.dateMenuOpen = false;
  }

  onFilterCountChange(count: number): void {
    this.filterCount = count;
    this.filterOpen  = false;
  }

}
