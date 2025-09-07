import { Component } from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

import { AuthService } from '../../core/services/auth.service';
import { LoginRequest } from '../../core/models/auth.model';
import { NotificationService } from '../../core/services/notification.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule],
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent {

  loginData: LoginRequest = {
    username: '',
    password: ''
  };

  constructor(
    private authService: AuthService,
    private router: Router,
    private notificationService: NotificationService,
  ) { }

  onSubmit(): void {
    this.authService.login(this.loginData).subscribe({
      next: (response) => {
        this.notificationService.showSuccess('Has iniciado sesión correctamente.', '¡Bienvenido!');
        this.router.navigate(['/dashboard']); 
      },
      error: (err) => {
        this.notificationService.showError('Las credenciales son incorrectas. Por favor, inténtalo de nuevo.', 'Error de Autenticación');
        console.error('Error en el login:', err);
      }
    });
  }
}