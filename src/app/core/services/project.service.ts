import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';

import { environment } from '../../../environments/environment';
import { Project, CreateProjectRequest, PagedModel } from '../models/project.model'; // Asumiendo que los modelos están en archivos separados
import { AuthService } from './auth.service';

@Injectable({
  providedIn: 'root'
})
export class ProjectService {

  private apiUrl = `${environment.apiUrl}/projects`;
  private adminApiUrl = `${environment.apiUrl}/admin/projects`;

  constructor(private http: HttpClient, private authService: AuthService) { }

  /**
   * Obtiene la lista paginada de proyectos desde la API.
   * La petición es interceptada para añadir el token de autenticación.
   * Si el usuario es ADMIN, obtiene todos los proyectos del sistema.
   * @returns Un Observable que emite un objeto PagedModel<Project>.
   */
  getAllProjects(page: number = 0, size: number = 10): Observable<PagedModel<Project>> {
    const url = this.authService.isAdmin() ? this.adminApiUrl : this.apiUrl;

    const params = new HttpParams()
      .set('page', page.toString())
      .set('size', size.toString());

    return this.http.get<PagedModel<Project>>(url, { params });
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

  /**
   * [ADMIN] Elimina permanentemente un proyecto por su ID.
   * @param id El ID del proyecto a eliminar.
   * @returns Un Observable<void> que se completa al finalizar la operación.
   */
  hardDeleteProject(id: number): Observable<void> {
    const url = `${this.adminApiUrl}/${id}/hard-delete`;
    return this.http.delete<void>(url);
  }

}