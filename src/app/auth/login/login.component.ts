import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

import { AuthService } from '../../core/services/auth.service';
import { LoginRequest } from '../../core/models/auth.model';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, FormsModule], // Importamos FormsModule aquí
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent {

  // Modelo para almacenar los datos del formulario
  loginData: LoginRequest = {
    username: '',
    password: ''
  };

  // Inyectamos nuestro AuthService y el Router de Angular
  constructor(
    private authService: AuthService,
    private router: Router
  ) { }

  onSubmit(): void {
    this.authService.login(this.loginData).subscribe({
      next: (response) => {
        // En un futuro, aquí guardaremos el token
        console.log('Login exitoso!', response);
        // Y redirigiremos al usuario al dashboard
        // this.router.navigate(['/dashboard']);
      },
      error: (err) => {
        // Aquí manejaremos los errores de login
        console.error('Error en el login:', err);
      }
    });
  }
}