import { Component, ChangeDetectionStrategy } from '@angular/core';

@Component({
  selector: 'app-service-overview',
  standalone: true,
  imports: [],
  templateUrl: './service-overview.component.html',
  styleUrls: ['./service-overview.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ServiceOverviewComponent {}
