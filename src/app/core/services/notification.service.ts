import { Injectable } from '@angular/core';
import { ToastrService } from 'ngx-toastr';

@Injectable({
  providedIn: 'root'
})
export class NotificationService {

  // Inyectamos el servicio ToastrService en el constructor
  constructor(private toastr: ToastrService) { }

  /**
   * Muestra una notificación de éxito (toast verde).
   * @param message El mensaje principal a mostrar.
   * @param title El título opcional de la notificación.
   */
  showSuccess(message: string, title?: string): void {
    this.toastr.success(message, title);
  }

  /**
   * Muestra una notificación de error (toast rojo).
   * @param message El mensaje principal a mostrar.
   * @param title El título opcional de la notificación.
   */
  showError(message: string, title?: string): void {
    this.toastr.error(message, title);
  }

  /**
   * Muestra una notificación de advertencia (toast amarillo).
   * @param message El mensaje principal a mostrar.
   * @param title El título opcional de la notificación.
   */
  showWarning(message: string, title?: string): void {
    this.toastr.warning(message, title);
  }

  /**
   * Muestra una notificación de información (toast azul).
   * @param message El mensaje principal a mostrar.
   * @param title El título opcional de la notificación.
   */
  showInfo(message: string, title?: string): void {
    this.toastr.info(message, title);
  }
}