import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Router } from '@angular/router';
import { BehaviorSubject, Observable } from 'rxjs';
import { tap } from 'rxjs/operators';
import {apiURL} from '../../ENV/env-variable'
import { LoginResponse } from './interface/loginInterfaces';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  constructor(private http: HttpClient, private router: Router) {}

  private conflictoAprobadoSubject = new BehaviorSubject<any>(null);

   // Getter para el estado del conflicto
   getConflictoAprobado$() {
    return this.conflictoAprobadoSubject.asObservable();
  }

  // Método para actualizar el conflicto aprobado
  setConflictoAprobado(data: any) {
    localStorage.setItem('conflictoAprobado', JSON.stringify(data));
    this.conflictoAprobadoSubject.next(data);
  }

  login(cedula: string, password: string): Observable<LoginResponse> {
    return this.http.post<LoginResponse>(`${apiURL}/User/login`, { cedula, password }).pipe(
      tap((response) => {
        if (response && response.token) {
          // Guarda el token y los demás datos en localStorage
          localStorage.setItem('usuarioId', response.usuarioId.toString());
          localStorage.setItem('token', response.token);
          localStorage.setItem('nombre', response.nombre);
          localStorage.setItem('cedula', response.cedula);
          localStorage.setItem('role', response.role);
          localStorage.setItem('nivel', response.nivel.toString());
          localStorage.setItem('provincia', response.provincia);
          localStorage.setItem('provinciaId', response.provinciaId.toString());
          localStorage.setItem('region', response.region);
          localStorage.setItem('regionId', response.regionId.toString());
          localStorage.setItem('teamId',response.teamId.toString());
          localStorage.setItem('teamName', response.teamName);
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
    localStorage.removeItem('provinciaId');
    localStorage.removeItem('region');
    localStorage.removeItem('regionId');
    localStorage.removeItem('teamId');
    localStorage.removeItem('teamName');
    localStorage.removeItem('usuarioId');
    localStorage.removeItem('conflictoAprobado');
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

  getTeam(): string | null {
    return localStorage.getItem('teamName');
  }

  getUsuarioId(): number {
    return parseInt(localStorage.getItem('usuarioId')|| '0');
  }

  private isTokenExpired(token: string): boolean {
    const payload = JSON.parse(atob(token.split('.')[1]));
    const expirationDate = payload.exp * 1000;
    return Date.now() > expirationDate;
  }
}
