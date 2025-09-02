// Define la estructura para la petición de login
export interface LoginRequest {
  username: string;
  password: string;
}

// Define la estructura para la respuesta del login, que contiene el token
export interface LoginResponse {
  token: string;
}

// Define la estructura para la petición de registro de un nuevo usuario
export interface RegisterRequest {
  username: string;
  email: string;
  password: string;
}

// Define la estructura para la respuesta del registro
export interface RegisterResponse {
  id: number;
  username: string;
  email: string;
}
