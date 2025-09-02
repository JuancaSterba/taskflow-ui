import { Task } from './task.model';

// Representa un objeto Project tal como lo recibimos de la API.
export interface Project {
  id: number;
  name: string;
  description: string;
  tasks: Task[];
}

// Representa los datos necesarios para crear o actualizar un proyecto.
export interface CreateProjectRequest {
  name: string;
  description?: string;
}