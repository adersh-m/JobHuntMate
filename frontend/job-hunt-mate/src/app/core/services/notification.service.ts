import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';

export interface NotificationMessage {
  message: string;
  type: 'success' | 'error' | 'warning' | 'info';
  duration?: number;
  id?: string;
}

@Injectable({
  providedIn: 'root'
})
export class NotificationService {  private notificationSubject = new Subject<NotificationMessage>();
  private defaultDuration = 5000; // 5 seconds
  notifications$ = this.notificationSubject.asObservable();

  showSuccess(message: string, duration?: number): void {
    this.show({
      type: 'success',
      message,
      duration: duration || this.defaultDuration,
      id: this.generateId()
    });
  }

  showError(message: string, duration?: number) {
    this.show({
      type: 'error',
      message,
      duration: duration || this.defaultDuration,
      id: this.generateId()
    });
  }

  showWarning(message: string, duration?: number) {
    this.show({
      type: 'warning',
      message,
      duration: duration || this.defaultDuration,
      id: this.generateId()
    });
  }

  showInfo(message: string, duration?: number) {
    this.show({
      type: 'info',
      message,
      duration: duration || this.defaultDuration,
      id: this.generateId()
    });
  }

  private show(notification: NotificationMessage): void {
    this.notificationSubject.next(notification);
    if (notification.duration) {
      setTimeout(() => {
        this.clear(notification.id);
      }, notification.duration);
    }
  }

  clear(id?: string) {
    // If no id is provided, clear all notifications
    if (!id) {
      this.notificationSubject.next(null as any);
    }
    // Otherwise, clear specific notification (to be handled by component)
  }

  private generateId(): string {
    return Math.random().toString(36).substring(2, 15);
  }
}