import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators'; // 1. Importa el operador 'map'

import { environment } from '../../../environments/environment';
import { Project } from '../models/project.model';
import { Page } from '../models/page.model'; // 2. Importa nuestro nuevo modelo Page

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

}