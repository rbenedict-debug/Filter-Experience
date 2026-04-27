import {
  Component,
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Input,
  Output,
  EventEmitter,
  OnChanges,
  SimpleChanges,
  inject,
} from '@angular/core';

@Component({
  selector: 'app-save-view-modal',
  standalone: true,
  imports: [],
  templateUrl: './save-view-modal.component.html',
  styleUrls: ['./save-view-modal.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SaveViewModalComponent implements OnChanges {
  private readonly cdr = inject(ChangeDetectorRef);

  @Input() open = false;
  @Output() openChange = new EventEmitter<boolean>();

  @Input() mode: 'save' | 'edit' = 'save';
  @Input() initialName = '';
  @Input() filterCount = 0;

  @Output() confirmed = new EventEmitter<string>();
  @Output() deleted   = new EventEmitter<void>();

  viewName = '';

  get title(): string {
    return this.mode === 'save' ? 'Save View' : 'Edit Saved View';
  }

  get confirmLabel(): string {
    return this.mode === 'save' ? 'Save View' : 'Save Changes';
  }

  ngOnChanges(changes: SimpleChanges): void {
    if ('open' in changes && changes['open'].currentValue) {
      this.viewName = this.initialName;
      this.cdr.markForCheck();
    }
  }

  confirm(): void {
    const name = this.viewName.trim();
    if (!name) return;
    this.confirmed.emit(name);
    this.close();
  }

  confirmDelete(): void {
    this.deleted.emit();
    this.close();
  }

  close(): void {
    this.open = false;
    this.openChange.emit(false);
  }

  onBackdropClick(e: MouseEvent): void {
    if (e.target === e.currentTarget) this.close();
  }
}
