import {
  Component,
  Input,
  Output,
  EventEmitter,
  OnChanges,
  SimpleChanges,
  AfterViewInit,
  OnDestroy,
  ChangeDetectionStrategy,
} from '@angular/core';

@Component({
  selector: 'app-asset-filter-shell',
  standalone: true,
  templateUrl: './asset-filter-shell.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AssetFilterShellComponent implements OnChanges, AfterViewInit, OnDestroy {
  @Input()  open = false;
  @Output() openChange        = new EventEmitter<boolean>();
  @Output() filterCountChange = new EventEmitter<number>();

  private _initialized = false;

  private _onClose   = () => { this.openChange.emit(false); };
  private _onApplied = (e: Event) => {
    const count = (e as CustomEvent<{ count: number }>).detail?.count ?? 0;
    this.filterCountChange.emit(count);
    this.openChange.emit(false);
  };

  ngAfterViewInit(): void {
    if (typeof window.filterModalInit === 'function') {
      window.filterModalInit('assets');
      this._initialized = true;
    }
    window.addEventListener('filterModalClose', this._onClose);
    window.addEventListener('filterApplied',    this._onApplied);

    if (this.open) window.filterModalOpen?.();
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (!this._initialized) return;
    if ('open' in changes) {
      changes['open'].currentValue
        ? window.filterModalOpen?.()
        : window.filterModalClose?.();
    }
  }

  ngOnDestroy(): void {
    window.removeEventListener('filterModalClose', this._onClose);
    window.removeEventListener('filterApplied',    this._onApplied);
  }
}
