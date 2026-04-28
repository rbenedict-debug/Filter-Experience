import { Component, OnInit, inject, ChangeDetectionStrategy } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { SavedViewsService } from '../../../core/services/saved-views.service';

const SOURCE_PAGE_ROUTES: Record<string, string> = {
  'service-overview':      '/analytics/service-overview',
  'chatbot':               '/analytics/chatbot',
  'call-center':           '/analytics/call-center',
  'fees':                  '/analytics/fees',
  'custom-reports':        '/analytics/custom-reports',
  'comparison-users':      '/analytics/comparison/users',
  'comparison-categories': '/analytics/comparison/categories',
  'comparison-topics':     '/analytics/comparison/topics',
};

@Component({
  selector: 'app-saved-view-loader',
  standalone: true,
  template: '',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SavedViewLoaderComponent implements OnInit {
  private readonly route             = inject(ActivatedRoute);
  private readonly router            = inject(Router);
  private readonly savedViewsService = inject(SavedViewsService);

  ngOnInit(): void {
    const id   = this.route.snapshot.paramMap.get('id');
    const view = id ? this.savedViewsService.getById(id) : null;

    if (view) {
      const basePath = SOURCE_PAGE_ROUTES[view.sourcePage];
      if (basePath) {
        this.router.navigate([`${basePath}/saved-views`, id], { replaceUrl: true });
        return;
      }
    }
    this.router.navigate(['/analytics'], { replaceUrl: true });
  }
}
