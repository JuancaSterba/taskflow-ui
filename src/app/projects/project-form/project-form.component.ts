import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { ProjectService } from '../../core/services/project.service';
import { CreateProjectRequest } from '../../core/models/project.model';
import { NotificationService } from '../../core/services/notification.service';

@Component({
  selector: 'app-project-form',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterModule],
  templateUrl: './project-form.component.html',
  styleUrls: ['./project-form.component.scss']
})
export class ProjectFormComponent implements OnInit {
  projectForm: FormGroup;
  isEditMode = false;
  private projectId: number | null = null;

  constructor(
    private fb: FormBuilder,
    private projectService: ProjectService,
    public router: Router,
    private route: ActivatedRoute,
    private notificationService: NotificationService,
  ) {
    this.projectForm = this.fb.group({
      name: ['', [Validators.required, Validators.maxLength(100)]],
      description: ['', [Validators.maxLength(500)]]
    });
  }

  ngOnInit(): void {
    const idParam = this.route.snapshot.paramMap.get('id');
    if (idParam) {
      this.isEditMode = true;
      this.projectId = +idParam; // El '+' convierte el string a número
      this.projectService.getProjectById(this.projectId).subscribe(project => {
        this.projectForm.patchValue(project);
      });
    }
  }

  onSubmit(): void {
    if (this.projectForm.invalid) {
      return;
    }

    const projectData: CreateProjectRequest = this.projectForm.value;

    if (this.isEditMode && this.projectId) {
      this.projectService.updateProject(this.projectId, projectData).subscribe({
        next: () => {
          this.notificationService.showSuccess('Proyecto actualizado correctamente.');
          this.router.navigate(['/dashboard']);
        },
        error: (err) => this.notificationService.showError('Error al actualizar el proyecto.')
      });
    } else {
      this.projectService.createProject(projectData).subscribe({
        next: () => {
          this.notificationService.showSuccess('Proyecto creado exitosamente.');
          this.router.navigate(['/dashboard']);
        },
        error: (err) => this.notificationService.showError('Error al crear el proyecto.')
      });
    }
  }
}