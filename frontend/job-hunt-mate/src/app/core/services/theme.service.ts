import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ThemeService {
  private darkMode = new BehaviorSubject<boolean>(this.getInitialTheme());
  darkMode$ = this.darkMode.asObservable();

  private getInitialTheme(): boolean {
    const saved = localStorage.getItem('theme');
    return saved === 'dark' || (!saved && window.matchMedia('(prefers-color-scheme: dark)').matches);
  }

  constructor() {
    this.applyTheme(this.darkMode.value);
  }

  toggleTheme(): void {
    const isDark = !this.darkMode.value;
    this.darkMode.next(isDark);
    this.applyTheme(isDark);
  }

  setTheme(isDark: boolean): void {
    this.darkMode.next(isDark);
    this.applyTheme(isDark);
  }

  private applyTheme(isDark: boolean): void {
    const body = document.body;
    body.classList.toggle('dark', isDark);
    localStorage.setItem('theme', isDark ? 'dark' : 'light');
  }
}
