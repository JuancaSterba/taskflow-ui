import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AuthService } from '../services/auth.service';

export const authGuard: CanActivateFn = (route, state) => {
  const authService = inject(AuthService);
  const router = inject(Router);

  if (authService.isLoggedIn()) {
    // Si el usuario está logueado, permite el acceso a la ruta.
    return true;
  }

  // Si no está logueado, redirige a la página de login y bloquea el acceso.
  router.navigate(['/login']);
  return false;
};