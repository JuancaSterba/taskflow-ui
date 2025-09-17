import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';

import { environment } from '../../../environments/environment';
import { Task, CreateTaskRequest } from '../models/task.model';
import { PagedModel } from '../models/project.model';
import { AuthService } from './auth.service';

@Injectable({
  providedIn: 'root'
})
export class TaskService {

  private projectApiUrl = `${environment.apiUrl}/projects`;
  private taskApiUrl = `${environment.apiUrl}/tasks`;
  private adminApiUrl = `${environment.apiUrl}/admin/tasks`;

  constructor(private http: HttpClient, private authService: AuthService) { }

  /**
   * [ADMIN] Obtiene la lista paginada de TODAS las tareas del sistema.
   * @returns Un Observable que emite un objeto PagedModel<Task>.
   */
  getAllTasksForAdmin(page: number = 0, size: number = 10): Observable<PagedModel<Task>> {
    if (!this.authService.isAdmin()) {
      // Opcional: podrías devolver un error o un observable vacío si un no-admin intenta llamar a esto.
      return new Observable(observer => observer.error('User is not an admin'));
    }
    const params = new HttpParams()
      .set('page', page.toString())
      .set('size', size.toString());
    return this.http.get<PagedModel<Task>>(this.adminApiUrl, { params });
  }

  /**
   * Crea una nueva tarea para un proyecto específico.
   * @param projectId El ID del proyecto al que pertenecerá la tarea.
   * @param taskData Los datos de la tarea a crear.
   * @returns Un Observable con los datos de la tarea recién creada.
   */
  createTaskForProject(projectId: number, taskData: CreateTaskRequest): Observable<Task> {
    const url = `${this.projectApiUrl}/${projectId}/tasks`;
    return this.http.post<Task>(url, taskData);
  }

  /**
   * Actualiza una tarea existente.
   * @param taskId El ID de la tarea a actualizar.
   * @param taskData Los nuevos datos para la tarea.
   * @returns Un Observable con los datos de la tarea actualizada.
   */
  updateTask(taskId: number, taskData: CreateTaskRequest): Observable<Task> {
    const url = `${this.taskApiUrl}/${taskId}`;
    return this.http.put<Task>(url, taskData);
  }

  /**
   * Archiva una tarea por su ID (Borrado Lógico).
   * @param taskId El ID de la tarea a eliminar.
   * @returns Un Observable<void> que se completa al finalizar la operación.
   */
  archiveTask(taskId: number): Observable<void> {
    const url = `${this.taskApiUrl}/${taskId}`;
    return this.http.delete<void>(url);
  }

  /**
   * [ADMIN] Elimina permanentemente una tarea por su ID.
   * @param taskId El ID de la tarea a eliminar.
   * @returns Un Observable<void> que se completa al finalizar la operación.
   */
  hardDeleteTask(taskId: number): Observable<void> {
    const url = `${this.adminApiUrl}/${taskId}/hard-delete`;
    return this.http.delete<void>(url);
  }
}