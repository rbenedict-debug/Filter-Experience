import { Component, ChangeDetectionStrategy } from '@angular/core';

@Component({
  selector: 'app-greetings',
  standalone: true,
  imports: [],
  templateUrl: './greetings.component.html',
  styleUrls: ['./greetings.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class GreetingsComponent {}
