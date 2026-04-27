import { Component, ChangeDetectionStrategy, Input, Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'app-share-dashboard-modal',
  standalone: true,
  imports: [],
  templateUrl: './share-dashboard-modal.component.html',
  styleUrls: ['./share-dashboard-modal.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ShareDashboardModalComponent {
  @Input() open = false;
  @Output() openChange = new EventEmitter<boolean>();

  @Input() dashboardTitle = 'Dashboard';

  sendTo = '';
  subject = '';
  message = '';
  sendMeCopy = false;

  close() {
    this.open = false;
    this.openChange.emit(false);
  }

  send() {
    // TODO: wire to email service
    this.close();
  }

  onBackdropClick(e: MouseEvent) {
    if (e.target === e.currentTarget) {
      this.close();
    }
  }
}
