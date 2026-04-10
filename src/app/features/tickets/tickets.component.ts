import { Component, ChangeDetectionStrategy, signal } from '@angular/core';

type TicketTab = 'my-tickets' | 'team' | 'all' | 'closed';

@Component({
  selector: 'app-tickets',
  standalone: true,
  templateUrl: './tickets.component.html',
  styleUrls: ['./tickets.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TicketsComponent {
  activeTab = signal<TicketTab>('my-tickets');

  setTab(tab: TicketTab): void {
    this.activeTab.set(tab);
  }
}
