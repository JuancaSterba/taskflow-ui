// Representa un objeto Task tal como lo recibimos de la API.
export interface Task {
  id: number;
  title: string;
  description: string;
  completed: boolean;
}

// Representa los datos necesarios para crear o actualizar una tarea.
// Hacemos `description` y `completed` opcionales con `?` porque no son obligatorios en la petición.
export interface CreateTaskRequest {
  title: string;
  description?: string;
  completed?: boolean;
}