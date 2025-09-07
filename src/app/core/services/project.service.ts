import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

import { environment } from '../../../environments/environment';
import { Project, CreateProjectRequest } from '../models/project.model';
import { Page } from '../models/page.model';

@Injectable({
  providedIn: 'root'
})
export class ProjectService {

  private apiUrl = `${environment.apiUrl}/api/v1/projects`;

  constructor(private http: HttpClient) { }

  /**
   * Obtiene la lista paginada de proyectos desde la API.
   * La petición es interceptada para añadir el token de autenticación.
   * @returns Un Observable que emite un array de Proyectos (el contenido de la página).
   */
  getAllProjects(): Observable<Project[]> {
    // 3. Le decimos a http.get que esperamos un Page<Project>
    return this.http.get<Page<Project>>(this.apiUrl)
      .pipe(
        // 4. Usamos 'map' para transformar la respuesta y devolver solo el array 'content'
        map(response => response.content)
      );
  }

  /**
   * Obtiene un único proyecto por su ID.
   * @param id El ID del proyecto a obtener
   * @returns Un Observable con los datos del proyecto
   */
  getProjectById(id: number): Observable<Project>{
    const url = `${this.apiUrl}/${id}`;
    return this.http.get<Project>(url);
  }

  /**
   * Crea un nuevo proyecto.
   * @param projectData Los datos del proyecto a crear.
   * @returns Un Observable con los datos del proyecto recién creado.
   */
  createProject(projectData: CreateProjectRequest): Observable<Project> {
    return this.http.post<Project>(this.apiUrl, projectData);
  }

  /**
   * Actualiza un proyecto existente.
   * @param id El ID del proyecto a actualizar.
   * @param projectData Los nuevos datos del proyecto.
   * @returns Un Observable con los datos del proyecto actualizado.
   */
  updateProject(id: number, projectData: CreateProjectRequest): Observable<Project> {
    const url = `${this.apiUrl}/${id}`;
    return this.http.put<Project>(url, projectData);
  }

  /**
   * Archiva un proyecto por su ID (Borrado Lógico).
   * @param id El ID del proyecto a archivar.
   * @returns Un Observable<void> que se completa al finalizar la operación.
   */
  archiveProject(id: number): Observable<void> {
    const url = `${this.apiUrl}/${id}`;
    return this.http.delete<void>(url);
  }

}