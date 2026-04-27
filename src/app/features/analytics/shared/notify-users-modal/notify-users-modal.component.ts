import {
  Component, ChangeDetectionStrategy, ChangeDetectorRef, inject,
  Input, Output, EventEmitter, ViewChild, ElementRef, HostListener,
} from '@angular/core';

export type NotifyTab = 'age' | 'scores' | 'critical';

interface PerformanceGroup { id: string; label: string; }
interface TeamMember      { id: string; name: string; }

const PERFORMANCE_GROUPS: PerformanceGroup[] = [
  { id: 'slow-closing',  label: 'Users with slow closing time' },
  { id: 'fast-closing',  label: 'Users with fast closing time' },
  { id: 'past-due',      label: 'Users with past due tickets' },
  { id: 'open-tickets',  label: 'Users with open tickets' },
];

const ALL_USERS: TeamMember[] = [
  { id: 'u1', name: 'Bernadine Futrell' },
  { id: 'u2', name: 'Chris McKay' },
  { id: 'u3', name: 'Dan Carter' },
  { id: 'u4', name: 'Elena Vasquez' },
  { id: 'u5', name: 'Frank Morrison' },
  { id: 'u6', name: 'Grace Huang' },
  { id: 'u7', name: 'Henry Collins' },
  { id: 'u8', name: 'Isabel Torres' },
];

@Component({
  selector: 'app-notify-users-modal',
  standalone: true,
  imports: [],
  templateUrl: './notify-users-modal.component.html',
  styleUrls: ['./notify-users-modal.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class NotifyUsersModalComponent {
  private readonly cdr = inject(ChangeDetectorRef);

  @Input() open = false;
  @Output() openChange = new EventEmitter<boolean>();

  @ViewChild('selectTrigger') private selectTrigger!: ElementRef<HTMLButtonElement>;

  activeTab: NotifyTab = 'age';
  menuOpen = false;
  groupsOpen = false;
  searchQuery = '';

  menuTop = 0;
  menuLeft = 0;
  menuWidth = 0;
  groupsMenuTop = 0;
  groupsMenuLeft = 0;

  private groupsCloseTimer: ReturnType<typeof setTimeout> | null = null;

  selectedGroups = new Set<string>();
  selectedUsers  = new Set<string>();
  subject  = '';
  message  = '';
  sendMeCopy = false;

  readonly performanceGroups = PERFORMANCE_GROUPS;

  get filteredUsers(): TeamMember[] {
    const q = this.searchQuery.trim().toLowerCase();
    return q ? ALL_USERS.filter(u => u.name.toLowerCase().includes(q)) : ALL_USERS;
  }

  get selectedLabel(): string {
    const count = this.selectedGroups.size + this.selectedUsers.size;
    if (count === 0) return '';
    return count === 1 ? '1 team member selected' : `${count} team members selected`;
  }

  get selectPlaceholder(): string {
    return this.selectedLabel || 'Select team members';
  }

  get hasSelection(): boolean {
    return this.selectedGroups.size > 0 || this.selectedUsers.size > 0;
  }

  toggleMenu(event: MouseEvent) {
    event.stopPropagation();
    if (this.menuOpen) {
      this.closeMenus();
    } else {
      const rect = this.selectTrigger.nativeElement.getBoundingClientRect();
      this.menuTop   = rect.bottom + 4;
      this.menuLeft  = rect.left;
      this.menuWidth = rect.width;
      this.menuOpen  = true;
    }
    this.cdr.markForCheck();
  }

  openGroupsMenu(event: MouseEvent) {
    if (this.groupsCloseTimer) {
      clearTimeout(this.groupsCloseTimer);
      this.groupsCloseTimer = null;
    }
    const rect = (event.currentTarget as HTMLElement).getBoundingClientRect();
    this.groupsMenuTop  = rect.top;
    this.groupsMenuLeft = rect.right + 4;
    this.groupsOpen = true;
    this.cdr.markForCheck();
  }

  scheduleGroupsClose() {
    this.groupsCloseTimer = setTimeout(() => {
      this.groupsOpen = false;
      this.cdr.markForCheck();
    }, 150);
  }

  cancelGroupsClose() {
    if (this.groupsCloseTimer) {
      clearTimeout(this.groupsCloseTimer);
      this.groupsCloseTimer = null;
    }
  }

  closeMenus() {
    this.menuOpen = false;
    this.groupsOpen = false;
  }

  onSearchChange(value: string) {
    this.searchQuery = value;
    this.cdr.markForCheck();
  }

  toggleGroup(id: string) {
    this.selectedGroups.has(id) ? this.selectedGroups.delete(id) : this.selectedGroups.add(id);
    this.cdr.markForCheck();
  }

  toggleUser(id: string) {
    this.selectedUsers.has(id) ? this.selectedUsers.delete(id) : this.selectedUsers.add(id);
    this.cdr.markForCheck();
  }

  isGroupSelected(id: string)  { return this.selectedGroups.has(id); }
  isUserSelected(id: string)   { return this.selectedUsers.has(id); }

  setTab(tab: NotifyTab) {
    this.activeTab = tab;
    this.cdr.markForCheck();
  }

  @HostListener('document:keydown.escape')
  onEscape() {
    if (this.menuOpen || this.groupsOpen) {
      this.closeMenus();
      this.cdr.markForCheck();
    }
  }

  close() {
    this.closeMenus();
    this.open = false;
    this.openChange.emit(false);
  }

  send() {
    // TODO: wire to notification service
    this.close();
  }

  onBackdropClick(e: MouseEvent) {
    if (e.target === e.currentTarget) this.close();
  }
}
