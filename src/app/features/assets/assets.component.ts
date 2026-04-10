import { Component, ChangeDetectionStrategy } from '@angular/core';

@Component({
  selector: 'app-assets',
  standalone: true,
  templateUrl: './assets.component.html',
  styleUrls: ['./assets.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AssetsComponent {}
