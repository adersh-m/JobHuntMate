// dark-mode-toggle.component.ts
import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ThemeService } from '../../services/theme.service';
import { FaIconLibrary } from '@fortawesome/angular-fontawesome';
import { faMoon, faSun } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';

@Component({
  selector: 'app-dark-mode-toggle',
  standalone: true,
  imports: [CommonModule, FontAwesomeModule],
  template: `
    <button (click)="toggle()" [attr.aria-label]="(isDark ? 'Switch to Light Mode' : 'Switch to Dark Mode')">
      <fa-icon [icon]="isDark ? 'sun' : 'moon'"></fa-icon>
    </button>
  `,
  styles: [`
    button {
      background: transparent;
      border: none;
      font-size: 1.5rem;
      cursor: pointer;
      color: inherit;
    }
  `]
})
export class DarkModeToggleComponent {
  isDark = false;

  constructor(private themeService: ThemeService, library: FaIconLibrary) {
    library.addIcons(faSun, faMoon);
    this.themeService.darkMode$.subscribe(mode => this.isDark = mode);
  }

  toggle() {
    this.themeService.toggleTheme();
  }
}
