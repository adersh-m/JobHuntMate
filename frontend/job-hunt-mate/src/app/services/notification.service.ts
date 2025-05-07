import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';

export interface Notification {
  message: string;
  type: 'success' | 'error';
}

@Injectable({
  providedIn: 'root'
})
export class NotificationService {
  private notificationSubject = new Subject<Notification | null>();
  notifications$ = this.notificationSubject.asObservable();

  showSuccess(message: string) {
    this.notificationSubject.next({ message, type: 'success' });
  }

  showError(message: string) {
    this.notificationSubject.next({ message, type: 'error' });
  }

  clear() {
    this.notificationSubject.next(null);
  }
}