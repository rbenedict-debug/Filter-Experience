import { Component, ChangeDetectionStrategy } from '@angular/core';

@Component({
  selector: 'app-success-messages',
  standalone: true,
  imports: [],
  templateUrl: './success-messages.component.html',
  styleUrls: ['./success-messages.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SuccessMessagesComponent {}
