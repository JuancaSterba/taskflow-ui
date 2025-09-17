import { Task } from './task.model';

// Representa los metadatos de paginación de la API.
export interface PageMetadata {
  size: number;
  number: number;
  totalElements: number;
  totalPages: number;
}

// Modelo genérico para respuestas paginadas de la API.
export interface PagedModel<T> {
  content: T[];
  page: PageMetadata;
}

// Representa un objeto Project tal como lo recibimos de la API.
export interface Project {
  id: number;
  name: string;
  description: string;
  ownerUsername: string;
  status: 'ACTIVE' | 'ARCHIVED';
  tasks: Task[];
}

// Representa los datos necesarios para crear o actualizar un proyecto.
export interface CreateProjectRequest {
  name: string;
  description?: string;
}