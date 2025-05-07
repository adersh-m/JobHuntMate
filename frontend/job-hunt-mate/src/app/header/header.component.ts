import { Component, OnDestroy, ElementRef, HostListener } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '../services/auth.service';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './header.component.html',
  styleUrl: './header.component.scss'
})
export class HeaderComponent implements OnDestroy {
  logoUrl: string | null = null; // Will be set when logo is available
  showUserMenu = false;

  @HostListener('document:click', ['$event'])
  onDocumentClick(event: MouseEvent) {
    if (!this.elementRef.nativeElement.contains(event.target)) {
      this.showUserMenu = false;
    }
  }

  constructor(
    public authService: AuthService, 
    private router: Router,
    private elementRef: ElementRef
  ) {}

  ngOnDestroy() {
    // Cleanup any subscriptions if needed
  }

  toggleUserMenu() {
    this.showUserMenu = !this.showUserMenu;
  }

  onLogout() {
    this.showUserMenu = false;
    this.authService.logout();
    this.router.navigate(['/login']);
  }
}
