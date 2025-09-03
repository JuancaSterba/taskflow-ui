import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { Observable, switchMap } from 'rxjs';

import { Project } from '../../core/models/project.model';
import { ProjectService } from '../../core/services/project.service';

@Component({
  selector: 'app-project-detail',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './project-detail.component.html',
  styleUrls: ['./project-detail.component.scss']
})
export class ProjectDetailComponent implements OnInit {

  project$!: Observable<Project>;
  private projectId!: number;

  constructor(
    private route: ActivatedRoute,
    private projectService: ProjectService,
    private router: Router
  ) { }

  ngOnInit(): void {
    this.project$ = this.route.paramMap.pipe(
      switchMap(params => {
        const id = Number(params.get('id'));
        this.projectId = id;
        return this.projectService.getProjectById(id);
      })
    );
  }

  onDelete(): void {
    // 3. Mostramos una ventana de confirmación nativa del navegador
    const confirmation = window.confirm('¿Estás seguro de que quieres eliminar este proyecto? Esta acción no se puede deshacer.');

    if (confirmation) {
      // 4. Si el usuario confirma, llamamos al servicio
      this.projectService.deleteProject(this.projectId).subscribe({
        next: () => {
          console.log('Proyecto eliminado exitosamente');
          // 5. Redirigimos al dashboard
          this.router.navigate(['/dashboard']);
        },
        error: (err) => {
          console.error('Error al eliminar el proyecto:', err);
          // En el futuro, aquí mostraremos una notificación de error
        }
      });
    }
  }
  
}