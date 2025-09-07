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
    // 3. Mostramos una ventana de confirmación nativa del navegador
    const confirmation = window.confirm('¿Estás seguro de que quieres eliminar este proyecto? Esta acción no se puede deshacer.');

    if (confirmation) {
      // 4. Si el usuario confirma, llamamos al servicio
      this.projectService.archiveProject(this.projectId).subscribe({
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

  onTaskSubmit(): void {
    if (this.taskForm.invalid) {
      return;
    }
    const taskData: CreateTaskRequest = this.taskForm.value;
    this.taskService.createTaskForProject(this.projectId, taskData).subscribe({
      next: (newTask) => {
        console.log('Tarea creada!', newTask);
        // Recargar los datos del proyecto para mostrar la nueva tarea
        this.project$ = this.projectService.getProjectById(this.projectId);
        this.isCreatingTask = false; // Ocultar el formulario
        this.taskForm.reset(); // Limpiar el formulario
      },
      error: (err) => console.error('Error al crear la tarea', err)
    });
  }

  /**
   * Cambia el estado de completado de una tarea.
   * @param task La tarea que se va a modificar.
   */
  onToggleTaskStatus(task: import('../../core/models/task.model').Task): void {
    // Creamos el objeto con los datos actualizados
    const updatedTask: import('../../core/models/task.model').CreateTaskRequest = {
      title: task.title,
      description: task.description,
      completed: !task.completed // Invertimos el estado actual
    };

    // Llamamos al servicio para actualizar la tarea
    this.taskService.updateTask(task.id, updatedTask).subscribe({
      next: () => {
        console.log('Estado de la tarea actualizado.');
        // Recargamos los datos del proyecto para refrescar la lista de tareas
        this.project$ = this.projectService.getProjectById(this.projectId);
      },
      error: (err) => console.error('Error al actualizar la tarea', err)
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
          console.log('Tarea eliminada exitosamente.');
          // Recargamos los datos del proyecto para refrescar la lista
          this.project$ = this.projectService.getProjectById(this.projectId);
        },
        error: (err) => console.error('Error al eliminar la tarea', err)
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
      completed: this.editingTask.completed // Mantenemos el estado 'completed' original
    };

    this.taskService.updateTask(this.editingTask.id, updatedData).subscribe({
      next: () => {
        console.log('Tarea actualizada.');
        this.editingTask = null; // Salimos del modo edición
        // Refrescamos la lista de tareas
        this.project$ = this.projectService.getProjectById(this.projectId);
      },
      error: (err) => console.error('Error al actualizar la tarea', err)
    });
  }

}