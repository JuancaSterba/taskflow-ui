import { HttpInterceptorFn } from '@angular/common/http';

export const authInterceptor: HttpInterceptorFn = (req, next) => {
  
  // La misma clave que usamos en el AuthService
  const TOKEN_KEY = 'auth_token';
  const token = localStorage.getItem(TOKEN_KEY);

  // Si el token existe, clonamos la petición y añadimos la cabecera de autorización
  if (token) {
    const clonedRequest = req.clone({
      headers: req.headers.set('Authorization', `Bearer ${token}`)
    });
    // Pasamos la petición clonada al siguiente manejador
    return next(clonedRequest);
  }

  // Si no hay token, dejamos pasar la petición original sin modificarla
  return next(req);
};