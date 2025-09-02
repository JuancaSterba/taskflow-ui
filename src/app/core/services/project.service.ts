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

  getAllProjects(): Observable<Project[]> {
    // 3. Le decimos a http.get que esperamos un Page<Project>
    return this.http.get<Page<Project>>(this.apiUrl)
      .pipe(
        // 4. Usamos 'map' para transformar la respuesta y devolver solo el array 'content'
        map(response => response.content)
      );
  }
}