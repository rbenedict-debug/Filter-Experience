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

declare global {
  interface Window {
    filterModalInit: (context?: string) => void;
    filterModalOpen: () => void;
    filterModalClose: () => void;
    filterModalClearDates: () => void;
    openDateRangePicker: () => void;
    filterModalGetState: () => Record<string, unknown>;
    filterModalSetState: (state: Record<string, unknown>) => void;
    filterModalApplySilent: () => void;
    filterModalReset: () => void;
  }
}

@Component({
  selector: 'app-comparison-users-filter-shell',
  standalone: true,
  templateUrl: './comparison-users-filter-shell.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ComparisonUsersFilterShellComponent implements OnChanges, AfterViewInit, OnDestroy {
  @Input()  open    = false;
  @Input()  context = 'comparison-users';
  @Output() openChange             = new EventEmitter<boolean>();
  @Output() filterCountChange      = new EventEmitter<number>();
  @Output() filterDateActiveChange = new EventEmitter<boolean>();

  private _initialized = false;

  private _onClose   = () => { this.openChange.emit(false); };
  private _onApplied = (e: Event) => {
    const detail = (e as CustomEvent<{ count: number; hasDateFilter: boolean }>).detail;
    this.filterCountChange.emit(detail?.count ?? 0);
    this.filterDateActiveChange.emit(detail?.hasDateFilter ?? false);
    this.openChange.emit(false);
  };

  ngAfterViewInit(): void {
    if (typeof window.filterModalInit === 'function') {
      window.filterModalInit(this.context);
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

  getState(): Record<string, unknown> | null {
    return typeof window.filterModalGetState === 'function'
      ? window.filterModalGetState()
      : null;
  }

  setState(savedState: Record<string, unknown>): void {
    if (typeof window.filterModalSetState === 'function') {
      window.filterModalSetState(savedState);
    }
  }

  applySilent(): void {
    if (typeof window.filterModalApplySilent === 'function') {
      window.filterModalApplySilent();
    }
  }

  resetState(): void {
    if (typeof window.filterModalReset === 'function') {
      window.filterModalReset();
    }
  }

  ngOnDestroy(): void {
    window.removeEventListener('filterModalClose', this._onClose);
    window.removeEventListener('filterApplied',    this._onApplied);
  }
}
