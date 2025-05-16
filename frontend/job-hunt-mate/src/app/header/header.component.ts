import { Component, OnDestroy, ElementRef, HostListener } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '../core/services/auth.service';
import { Subscription } from 'rxjs';
import { DarkModeToggleComponent } from '../shared/components/dark-mode-toggle/dark-mode-toggle.component';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [CommonModule, RouterLink, DarkModeToggleComponent],
  templateUrl: './header.component.html',
  styleUrl: './header.component.scss'
})
export class HeaderComponent implements OnDestroy {
  logoUrl: string | null = null;
  showUserMenu = false;
  username = '';
  private userSubscription: Subscription;

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
  ) {
    this.userSubscription = this.authService.currentUser$.subscribe(user => {
      this.username = user?.name || 'User';
    });
  }

  ngOnDestroy(): void {
    if (this.userSubscription) {
      this.userSubscription.unsubscribe();
    }
  }

  toggleUserMenu(): void {
    this.showUserMenu = !this.showUserMenu;
  }

  logout(): void {
    this.authService.logout();
    this.router.navigate(['/login']);
  }
}
