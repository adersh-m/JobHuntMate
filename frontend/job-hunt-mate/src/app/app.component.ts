import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterOutlet, Router, NavigationEnd } from '@angular/router';
import { HeaderComponent } from './header/header.component';
import { SidebarComponent } from './sidebar/sidebar.component';
import { AuthService } from './core/services/auth.service';
import { NotificationComponent } from './shared/components/notification/notification.component';
import { LoaderComponent } from './shared/components/loader/loader.component';
import { DarkModeToggleComponent } from './shared/components/dark-mode-toggle/dark-mode-toggle.component';
import { filter } from 'rxjs/operators';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [
    CommonModule,
    RouterOutlet,
    HeaderComponent,
    SidebarComponent,
    NotificationComponent,
    LoaderComponent
  ],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss'
})
export class AppComponent {
  public isAuthPage = false;

  constructor(public authService: AuthService, private router: Router) {
    this.router.events.pipe(filter(e => e instanceof NavigationEnd)).subscribe((event: any) => {
      const url = event.urlAfterRedirects || event.url;
      this.isAuthPage = [
        '/login',
        '/register',
        '/forgot-password',
        '/reset-password',
        '/email-sent',
        '/tnc',
        '/privacy'
      ].some(path => url.startsWith(path));
    });
  }
}
