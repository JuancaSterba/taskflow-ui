import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, tap } from 'rxjs';

import { environment } from '../../../environments/environment';
import { LoginRequest, LoginResponse, RegisterRequest, RegisterResponse } from '../models/auth.model';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  private apiUrl = `${environment.apiUrl}/api/v1/auth`;
  private readonly TOKEN_KEY = 'auth_token';

  constructor(private http: HttpClient) { }

  login(request: LoginRequest): Observable<LoginResponse> {
    return this.http.post<LoginResponse>(`${this.apiUrl}/login`, request)
      .pipe(
        tap(response => this.saveToken(response.token))
      );
  }

  register(request: RegisterRequest): Observable<RegisterResponse> {
    return this.http.post<RegisterResponse>(`${this.apiUrl}/register`, request);
  }

  private saveToken(token: string): void {
    localStorage.setItem(this.TOKEN_KEY, token);
  }

  logout(): void {
    localStorage.removeItem(this.TOKEN_KEY);
  }

}