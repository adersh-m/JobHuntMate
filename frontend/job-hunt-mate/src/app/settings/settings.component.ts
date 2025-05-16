import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { NotificationService } from '@app/core/services/notification.service';
import { ThemeService } from '@app/core/services/theme.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-settings',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './settings.component.html',
  styleUrl: './settings.component.scss'
})
export class SettingsComponent {
  settings = {
    emailNotifications: false,
    darkMode: false,
    email: '',
    timeZone: 'utc'
  };
  private themeSub?: Subscription;
  private updatingFromTheme = false;

  constructor(private notificationService: NotificationService, private themeService: ThemeService) {
    const saved = localStorage.getItem('jh_settings');
    if (saved) {
      this.settings = { ...this.settings, ...JSON.parse(saved) };
    }
    // Subscribe to theme changes
    this.themeSub = this.themeService.darkMode$.subscribe(isDark => {
      if (this.settings.darkMode !== isDark) {
        this.updatingFromTheme = true;
        this.settings.darkMode = isDark;
        this.saveSettings(false, false); // persist to localStorage but don't trigger themeService again
        this.updatingFromTheme = false;
      }
    });
  }

  saveSettings(triggerTheme = true, showNotification = true): void {
    localStorage.setItem('jh_settings', JSON.stringify(this.settings));
    if (triggerTheme && !this.updatingFromTheme) {
      this.themeService.setTheme(this.settings.darkMode);
    }
    //show notification for email and time zone changes only
    if (showNotification) {
      this.notificationService.showSuccess('Settings saved successfully!');
    }
  }

  ngOnDestroy(): void {
    this.themeSub?.unsubscribe();
  }
}
