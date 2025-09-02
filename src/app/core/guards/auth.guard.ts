import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';

// Esta es la nueva forma de escribir Guards en Angular, como una simple función.
export const authGuard: CanActivateFn = (route, state) => {
  
  // Inyectamos el Router para poder redirigir
  const router = inject(Router);

  // Definimos la clave del token (debe ser la misma que en AuthService)
  const TOKEN_KEY = 'auth_token';

  // Verificamos si el token existe en localStorage
  const token = localStorage.getItem(TOKEN_KEY);

  if (token) {
    // Si el token existe, el usuario puede acceder a la ruta.
    return true;
  } else {
    // Si no hay token, redirigimos al login y bloqueamos el acceso.
    router.navigate(['/login']);
    return false;
  }
};