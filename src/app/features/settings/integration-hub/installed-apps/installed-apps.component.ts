import { Component, ChangeDetectionStrategy } from '@angular/core';

@Component({
  selector: 'app-installed-apps',
  standalone: true,
  imports: [],
  templateUrl: './installed-apps.component.html',
  styleUrls: ['./installed-apps.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class InstalledAppsComponent {}
