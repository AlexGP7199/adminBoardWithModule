import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import {apiURL} from '../../../ENV/env-variable'

@Injectable({
  providedIn: 'root'
})
export class UsuarioService {
  constructor(private http: HttpClient) {}

  obtenerRegiones(): Observable<any[]> {
    return this.http.get<any[]>(`${apiURL}/Region/all-regions`);
  }

  validarFechasEstudio(request: any): Observable<any> {
    return this.http.post(`${apiURL}/User/validarConflictos`, request);
  }

  obtenerProvincias(regionId: number): Observable<any[]> {
    const params = new HttpParams().set('regionId', regionId.toString());
    return this.http.get<any[]>(`${apiURL}/Province/provincias-by-region`, { params });
  }

  obtenerEquipos(): Observable<any[]> {
    return this.http.get<any[]>(`${apiURL}/Teams/all-teams`);
  }

  listarUsuariosFiltrados(regionId?: number, provinciaId?: number, teamId?: number): Observable<any[]> {
    let params = new HttpParams();
    if (regionId) params = params.set('regionId', regionId.toString());
    if (provinciaId) params = params.set('provinciaId', provinciaId.toString());
    if (teamId) params = params.set('teamId', teamId.toString());

    return this.http.get<any[]>(`${apiURL}/User/listar-usuarios-filtrados`, { params });
  }
}
