import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, tap } from 'rxjs';
import { jwtDecode } from 'jwt-decode';

import { environment } from '../../../environments/environment';
import { LoginRequest, LoginResponse, RegisterRequest, RegisterResponse } from '../models/auth.model';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  private apiUrl = `${environment.apiUrl}/api/v1/auth`;
  private readonly TOKEN_KEY = 'auth_token';
  private userRole: string | null = null;
  private username: string | null = null;

  constructor(private http: HttpClient) {
    this.loadUserDataFromToken()
  }

  login(request: LoginRequest): Observable<LoginResponse> {
    return this.http.post<LoginResponse>(`${this.apiUrl}/login`, request)
      .pipe(
        tap(response => this.saveTokenAndDecode(response.token))
      );
  }

  register(request: RegisterRequest): Observable<RegisterResponse> {
    return this.http.post<RegisterResponse>(`${this.apiUrl}/register`, request);
  }

  logout(): void {
    localStorage.removeItem(this.TOKEN_KEY);
    this.username = null;
    this.userRole = null;
  }

  private saveTokenAndDecode(token: string): void {
    localStorage.setItem(this.TOKEN_KEY, token);
    this.decodeToken(token);
  }

  private loadUserDataFromToken(): void {
    const token = this.getToken();
    if(token){
      this.decodeToken(token);
    }
  }

  private decodeToken(token: string): void{
    try {
      const decodedToken: {        sub: string, role:string      }=jwtDecode(token);
      this.username = decodedToken.sub;
      this.userRole = decodedToken.role;
      console.log(`Usuario: ${this.username}, Rol: ${this.userRole}`);
    } catch (error) {
      console.error('Error al decodificar el token', error);
      this.logout();
    }
  }

  getToken(): string | null {
    return localStorage.getItem(this.TOKEN_KEY);
  }

  getUsername(): string | null {
    return this.username;
  }

  getRole(): string | null {
    return this.userRole;
  }

  isAdmin(): boolean {
    return this.userRole === 'ROLE_ADMIN';
  }

  isLoggedIn(): boolean {
    return !!this.getToken();
  }

}