import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink, RouterLinkActive } from '@angular/router';

@Component({
  selector: 'app-sidebar',
  standalone: true,
  imports: [
    CommonModule,
    RouterLink,
    RouterLinkActive
  ],
  templateUrl: './sidebar.component.html',
  styleUrl: './sidebar.component.scss'
})
export class SidebarComponent {
  menuItems = [
    { icon: 'tachometer-alt', label: 'Dashboard', route: '/dashboard' },
    { icon: 'briefcase', label: 'Jobs', route: '/jobs' },
    { icon: 'cog', label: 'Settings', route: '/settings' }
  ];

  sidebarCollapsed = false;

  toggleSidebarCollapse() {
    this.sidebarCollapsed = !this.sidebarCollapsed;
  }
}
