import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Observable } from 'rxjs';
import { Router, RouterLink } from '@angular/router'; // 1. Importa el Router

import { Project } from '../core/models/project.model';
import { ProjectService } from '../core/services/project.service';
import { AuthService } from '../core/services/auth.service'; // 2. Importa el AuthService

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss']
})
export class DashboardComponent implements OnInit {

  projects$!: Observable<Project[]>;

  // 3. Inyecta AuthService y Router
  constructor(
    private projectService: ProjectService,
    private authService: AuthService,
    private router: Router
  ) { }

  ngOnInit(): void {
    this.projects$ = this.projectService.getAllProjects();
  }

  // 4. Añade el método logout
  logout(): void {
    this.authService.logout();
    this.router.navigate(['/login']);
  }

  goToCreateProject(): void {
    this.router.navigate(['/projects/new']);
  }
}