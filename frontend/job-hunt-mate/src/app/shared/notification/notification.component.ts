import { Component, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NotificationService, Notification } from '../../services/notification.service';
import { Subject, Observable } from 'rxjs';

@Component({
  selector: 'app-notification',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './notification.component.html',
  styleUrl: './notification.component.scss'
})
export class NotificationComponent implements OnDestroy {
  notifications$: Observable<Notification | null>;
  private destroy$ = new Subject<void>();

  constructor(private notificationService: NotificationService) {
    this.notifications$ = this.notificationService.notifications$;
  }

  close() {
    this.notificationService.clear();
  }

  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
  }
}