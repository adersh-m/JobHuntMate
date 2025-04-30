import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

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

  saveSettings() {
    // In a real application, this would save to a backend service
    console.log('Saving settings:', this.settings);
  }
}
