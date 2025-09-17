import { HttpErrorResponse, HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { Router } from '@angular/router';
import { catchError, throwError } from 'rxjs';
import { AuthService } from '../services/auth.service';

export const authInterceptor: HttpInterceptorFn = (req, next) => {
  const authService = inject(AuthService);
  const router = inject(Router);
  const token = authService.getToken();

  // Si no hay token, simplemente dejamos pasar la petición.
  // Esto es importante para las peticiones de login y registro.
  if (!token) {
    return next(req);
  }

  // Clonamos la petición para añadir el encabezado de autorización.
  const authReq = req.clone({
    headers: req.headers.set('Authorization', `Bearer ${token}`),
  });

  // Pasamos la petición clonada al siguiente manejador en la cadena.
  return next(authReq).pipe(
    catchError((error: HttpErrorResponse) => {
      // Si recibimos un error 401 (Unauthorized), cerramos la sesión.
      if (error.status === 401) {
        authService.logout();
        router.navigate(['/login']);
      }
      // Re-lanzamos el error para que otros manejadores (como en el servicio) puedan procesarlo.
      return throwError(() => error);
    })
  );
};
