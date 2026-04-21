import { Component, ChangeDetectionStrategy } from '@angular/core';

@Component({
  selector: 'app-statuses',
  standalone: true,
  imports: [],
  templateUrl: './statuses.component.html',
  styleUrls: ['./statuses.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class StatusesComponent {}
