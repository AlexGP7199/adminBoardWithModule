import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Router } from '@angular/router';
import { BehaviorSubject, Observable } from 'rxjs';
import { tap } from 'rxjs/operators';
import {apiURL} from '../../ENV/env-variable'
import { LoginResponse } from './interface/loginInterfaces';
import { jwtDecode } from 'jwt-decode';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private tokenKey = 'token';

  constructor(private http: HttpClient, private router: Router) {}

  private conflictoAprobadoSubject = new BehaviorSubject<any>(null);

   // Getter para el estado del conflicto
   getConflictoAprobado$() {
    return this.conflictoAprobadoSubject.asObservable();
  }

  // Método para actualizar el conflicto aprobado
  setConflictoAprobado(data: any) {
    sessionStorage.setItem('conflictoAprobado', JSON.stringify(data));
    this.conflictoAprobadoSubject.next(data);
  }

  login(cedula: string, password: string): Observable<LoginResponse> {
    return this.http.post<LoginResponse>(`${apiURL}/User/login`, { cedula, password }).pipe(
      tap((response) => {
        if (response && response.token) {
          // Guarda el token y los demás datos en localStorage
          sessionStorage.setItem(this.tokenKey, response.token);
          //localStorage.setItem('usuarioId', response.usuarioId.toString());
          //localStorage.setItem('token', response.token);
          //localStorage.setItem('nombre', response.nombre);
          //localStorage.setItem('cedula', response.cedula);
          //localStorage.setItem('role', response.role);
          //localStorage.setItem('nivel', response.nivel.toString());
          //localStorage.setItem('provincia', response.provincia);
          //localStorage.setItem('provinciaId', response.provinciaId.toString());
          //localStorage.setItem('region', response.region);
          //localStorage.setItem('regionId', response.regionId.toString());
          //localStorage.setItem('teamId',response.teamId.toString());
          //localStorage.setItem('teamName', response.teamName);
        }
      })
    );
  }

  logout(): void {
    // Limpia los datos de localStorage
    sessionStorage.removeItem('token');
    //localStorage.removeItem('nombre');
    //localStorage.removeItem('cedula');
    //localStorage.removeItem('role');
    //localStorage.removeItem('nivel');
    //localStorage.removeItem('provincia');
    //localStorage.removeItem('provinciaId');
    //localStorage.removeItem('region');
    //localStorage.removeItem('regionId');
    //localStorage.removeItem('teamId');
    //localStorage.removeItem('teamName');
    //localStorage.removeItem('usuarioId');
    //localStorage.removeItem('conflictoAprobado');
    this.router.navigate(['/login']);
  }

  getToken(): string | null {
    return sessionStorage.getItem(this.tokenKey);
  }

   // Decodificar el token
   getDecodedToken(): any {
    const token = this.getToken();
    if (token) {
      return jwtDecode(token);
    }
    return null;
  }


  isLoggedIn(): boolean {
    const token = this.getToken();
    return !!token && !this.isTokenExpired(token);
  }

  // Métodos para obtener información desde el token decodificado
  getUserClaim(claim: string): string | null {
    const decodedToken = this.getDecodedToken();
    return decodedToken && decodedToken[claim] ? decodedToken[claim] : null;
  }

  // Métodos para obtener la información almacenada
  getNombre(): string | null {
    return this.getUserClaim('nombre');
  }

  getCedula(): string | null {
    return this.getUserClaim('cedula');
  }

  getRole(): string | null {
    return this.getUserClaim('role');
  }

  getNivel(): number {
    const nivel = this.getUserClaim('nivel');
    return nivel ? parseInt(nivel, 10) : 0;
  }

  getProvincia(): string | null {
    return this.getUserClaim('provincia');
  }

  getRegion(): string | null {
    return this.getUserClaim('region');
  }

  getTeam(): string | null {
    return this.getUserClaim('teamName');
  }

  getUsuarioId(): number {
    const usuarioId = this.getUserClaim('usuarioId');
    return usuarioId ? parseInt(usuarioId, 10) : 0;
  }

    // Obtener ID de la provincia
  getProvinciaId(): number {
    const provinciaId = this.getUserClaim('provinciaId');
    return provinciaId ? parseInt(provinciaId, 10) : 0;
  }

  // Obtener ID de la región
  getRegionId(): number {
    const regionId = this.getUserClaim('regionId');
    return regionId ? parseInt(regionId, 10) : 0;
  }

  // Obtener ID del equipo
  getTeamId(): number {
    const teamId = this.getUserClaim('teamId');
    return teamId ? parseInt(teamId, 10) : 0;
  }

  private isTokenExpired(token: string): boolean {
    try {
      const payload = JSON.parse(atob(token.split('.')[1]));
      const expirationDate = payload.exp * 1000;
      return Date.now() > expirationDate;
    } catch (e) {
      return true;
    }

  }
}
