import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

import { environment } from '../../../environments/environment';
import { Task, CreateTaskRequest } from '../models/task.model';

@Injectable({
  providedIn: 'root'
})
export class TaskService {

  // La URL base para los proyectos, ya que las tareas se crean a través de ellos
  private projectApiUrl = `${environment.apiUrl}/api/v1/projects`;
  private taskApiUrl = `${environment.apiUrl}/api/v1/tasks`;

  constructor(private http: HttpClient) { }

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
  
}