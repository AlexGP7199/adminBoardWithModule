import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Router } from '@angular/router';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';
import {apiURL} from '../../ENV/env-variable'
import { LoginResponse } from './interface/loginInterfaces';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  constructor(private http: HttpClient, private router: Router) {}

  login(cedula: string, password: string): Observable<LoginResponse> {
    return this.http.post<LoginResponse>(`${apiURL}/User/login`, { cedula, password }).pipe(
      tap((response) => {
        if (response && response.token) {
          // Guarda el token y los demás datos en localStorage
          localStorage.setItem('token', response.token);
          localStorage.setItem('nombre', response.nombre);
          localStorage.setItem('cedula', response.cedula);
          localStorage.setItem('role', response.role);
          localStorage.setItem('nivel', response.nivel.toString());
          localStorage.setItem('provincia', response.provincia);
          localStorage.setItem('region', response.region);
        }
      })
    );
  }

  logout(): void {
    // Limpia los datos de localStorage
    localStorage.removeItem('token');
    localStorage.removeItem('nombre');
    localStorage.removeItem('cedula');
    localStorage.removeItem('role');
    localStorage.removeItem('nivel');
    localStorage.removeItem('provincia');
    localStorage.removeItem('region');
    this.router.navigate(['/login']);
  }

  isLoggedIn(): boolean {
    const token = localStorage.getItem('token');
    return !!token && !this.isTokenExpired(token);
  }

  // Métodos para obtener la información almacenada
  getNombre(): string | null {
    return localStorage.getItem('nombre');
  }

  getCedula(): string | null {
    return localStorage.getItem('cedula');
  }

  getRole(): string | null {
    return localStorage.getItem('role');
  }

  getNivel(): number {
    return parseInt(localStorage.getItem('nivel') || '0', 10);
  }

  getProvincia(): string | null {
    return localStorage.getItem('provincia');
  }

  getRegion(): string | null {
    return localStorage.getItem('region');
  }

  private isTokenExpired(token: string): boolean {
    const payload = JSON.parse(atob(token.split('.')[1]));
    const expirationDate = payload.exp * 1000;
    return Date.now() > expirationDate;
  }
}
