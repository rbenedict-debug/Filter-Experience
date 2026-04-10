import { Component, ChangeDetectionStrategy } from '@angular/core';

@Component({
  selector: 'app-tickets',
  standalone: true,
  templateUrl: './tickets.component.html',
  styleUrls: ['./tickets.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TicketsComponent {}
