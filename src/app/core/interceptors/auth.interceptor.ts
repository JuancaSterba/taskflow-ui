import { HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { Router } from '@angular/router';
import { catchError, throwError } from 'rxjs';
import { AuthService } from '../services/auth.service';
import { NotificationService } from '../services/notification.service';

export const authInterceptor: HttpInterceptorFn = (req, next) => {
  
  // Inyectamos los servicios que necesitaremos
  const authService = inject(AuthService);
  const router = inject(Router);
  const notificationService = inject(NotificationService);

  const token = authService.getToken();

  if (token) {
    const clonedRequest = req.clone({
      headers: req.headers.set('Authorization', `Bearer ${token}`)
    });
    
    // Pasamos la petición clonada al siguiente manejador
    return next(clonedRequest).pipe(
      // 1. Añadimos el operador catchError
      catchError(error => {
        // 2. Verificamos si el error es un 401 (No Autorizado)
        if (error.status === 401) {
          notificationService.showWarning('Tu sesión ha expirado. Por favor, inicia sesión de nuevo.', 'Sesión Expirada');
          authService.logout();
          router.navigate(['/login']);
        }
        // 3. Propagamos el error para que otros puedan manejarlo si es necesario
        return throwError(() => error);
      })
    );
  }

  return next(req);
};