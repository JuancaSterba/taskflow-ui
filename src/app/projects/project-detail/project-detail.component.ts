import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { Observable, switchMap } from 'rxjs';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';

import { Project } from '../../core/models/project.model';
import { ProjectService } from '../../core/services/project.service';
import { TaskService } from '../../core/services/task.service';
import { CreateTaskRequest, Task } from '../../core/models/task.model';
import { AuthService } from '../../core/services/auth.service';
import { NotificationService } from '../../core/services/notification.service';

@Component({
  selector: 'app-project-detail',
  standalone: true,
  imports: [CommonModule, RouterModule, ReactiveFormsModule],
  templateUrl: './project-detail.component.html',
  styleUrls: ['./project-detail.component.scss']
})
export class ProjectDetailComponent implements OnInit {

  project$!: Observable<Project>;
  private projectId!: number;

  isCreatingTask = false;
  taskForm: FormGroup;

  editingTask: Task | null = null;
  editTaskForm: FormGroup;

  constructor(
    private route: ActivatedRoute,
    private projectService: ProjectService,
    private router: Router,
    private fb: FormBuilder,
    private taskService: TaskService,
    public authService: AuthService,
    public notificationService: NotificationService,
  ) {
    this.taskForm = this.fb.group({
      title: ['', Validators.required],
      description: ['']
    });
    this.editTaskForm = this.fb.group({
      title: ['', Validators.required],
      description: ['']
    });
  }

  ngOnInit(): void {
    this.project$ = this.route.paramMap.pipe(
      switchMap(params => {
        const id = Number(params.get('id'));
        this.projectId = id;
        return this.projectService.getProjectById(id);
      })
    );
  }

  onArchive(): void {
    const confirmation = window.confirm('¿Estás seguro de que quieres archivar este proyecto?');
    if (confirmation) {
      this.projectService.archiveProject(this.projectId).subscribe({
        next: () => {
          this.notificationService.showSuccess('Proyecto archivado exitosamente.');
          this.router.navigate(['/dashboard']);
        },
        error: (err) => this.notificationService.showError('Error al archivar el proyecto.')
      });
    }
  }

  onTaskSubmit(): void {
    if (this.taskForm.invalid) {
      return;
    }
    const taskData: CreateTaskRequest = this.taskForm.value;
    this.taskService.createTaskForProject(this.projectId, taskData).subscribe({
      next: (newTask) => {
        this.notificationService.showSuccess(`Tarea "${newTask.title}" creada.`);
        this.project$ = this.projectService.getProjectById(this.projectId);
        this.isCreatingTask = false; // Ocultar el formulario
        this.taskForm.reset(); // Limpiar el formulario
      },
      error: (err) => this.notificationService.showError('Error al crear la tarea.')
    });
  }

  /**
   * Cambia el estado de completado de una tarea.
   * @param task La tarea que se va a modificar.
   */
  onToggleTaskStatus(task: import('../../core/models/task.model').Task): void {
    const updatedTask: import('../../core/models/task.model').CreateTaskRequest = {
      title: task.title,
      description: task.description,
      completed: !task.completed // Invertimos el estado actual
    };

    this.taskService.updateTask(task.id, updatedTask).subscribe({
      next: () => {
        this.notificationService.showInfo(`Estado de la tarea "${task.title}" actualizado.`);
        this.project$ = this.projectService.getProjectById(this.projectId);
      },
      error: (err) => this.notificationService.showError('Error al actualizar la tarea.')
    });
  }

  /**
   * Elimina una tarea después de pedir confirmación.
   * @param task La tarea que se va a eliminar.
   */
  onDeleteTask(task: import('../../core/models/task.model').Task): void {
    const confirmation = window.confirm(`¿Estás seguro de que quieres eliminar la tarea "${task.title}"?`);

    if (confirmation) {
      this.taskService.deleteTask(task.id).subscribe({
        next: () => {
          this.notificationService.showSuccess(`Tarea "${task.title}" eliminada.`);
          this.project$ = this.projectService.getProjectById(this.projectId);
        },
        error: (err) => this.notificationService.showError('Error al eliminar la tarea.')
      });
    }
  }

  /**
   * Activa el modo de edición para una tarea específica.
   * @param task La tarea a editar.
   */
  setEditingTask(task: Task): void {
    this.editingTask = task;
    // Rellena el formulario de edición con los datos de la tarea
    this.editTaskForm.setValue({
      title: task.title,
      description: task.description || ''
    });
  }

  /**
   * Cancela el modo de edición.
   */
  cancelEditing(): void {
    this.editingTask = null;
  }

  /**
   * Guarda los cambios de una tarea editada.
   */
  onUpdateTask(): void {
    if (!this.editingTask || this.editTaskForm.invalid) {
      return;
    }

    const updatedData: CreateTaskRequest = {
      ...this.editTaskForm.value,
      completed: this.editingTask.completed
    };

    this.taskService.updateTask(this.editingTask.id, updatedData).subscribe({
      next: () => {
        this.notificationService.showSuccess('Tarea actualizada.');
        this.editingTask = null;
        this.project$ = this.projectService.getProjectById(this.projectId);
      },
      error: (err) => this.notificationService.showError('Error al actualizar la tarea.')
    });
  }

  /**
   * [ADMIN] Elimina permanentemente un proyecto.
   */
  onHardDelete(): void {
    const confirm1 = window.confirm('¿Estás SEGURO de que quieres eliminar este proyecto PERMANENTEMENTE? Esta acción es irreversible.');
    if (confirm1) {
      const confirm2 = window.confirm('CONFIRMACIÓN FINAL: Todos los datos, incluyendo las tareas asociadas, se borrarán para siempre. ¿Continuar?');
      if (confirm2) {
        this.projectService.hardDeleteProject(this.projectId).subscribe({
          next: () => {
            this.notificationService.showSuccess('El proyecto ha sido eliminado permanentemente.', 'Eliminación Completa');
            this.router.navigate(['/dashboard']);
          },
          error: (err) => this.notificationService.showError('Error en el borrado permanente.', 'Error de Administrador')
        });
      }
    }
  }

}