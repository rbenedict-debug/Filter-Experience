import { Component, ChangeDetectionStrategy, inject } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-standard-views',
  standalone: true,
  imports: [],
  templateUrl: './standard-views.component.html',
  styleUrls: ['./standard-views.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class StandardViewsComponent {
  private router = inject(Router);

  navigate(path: string): void {
    this.router.navigate(['/assets', path]);
  }
}
