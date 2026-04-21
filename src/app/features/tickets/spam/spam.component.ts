import { Component, ChangeDetectionStrategy } from '@angular/core';

@Component({
  selector: 'app-spam',
  standalone: true,
  imports: [],
  templateUrl: './spam.component.html',
  styleUrls: ['./spam.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SpamComponent {}
