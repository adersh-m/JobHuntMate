import { Component } from '@angular/core';
import { SidebarComponent } from "../sidebar/sidebar.component";
import { JobListComponent } from "../job-list/job-list.component";
import { HeaderComponent } from '../header/header.component';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [SidebarComponent, JobListComponent, HeaderComponent],
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.scss'
})
export class DashboardComponent {

}
