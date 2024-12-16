import { Injectable } from '@angular/core';
import {apiURL} from '../../../ENV/env-variable'
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class UsuariosModuleService {

  constructor(private http: HttpClient) {}

  crearUsuario(usuario: any): Observable<any> {
    return this.http.post(`${apiURL}/User/crear-usuario`, usuario);
  }

  obtenerRegiones(): Observable<any[]> {
    return this.http.get<any[]>(`${apiURL}/User/regiones`);
  }

  obtenerProvinciasPorRegion(regionId: number): Observable<any[]> {
    return this.http.get<any[]>(`${apiURL}/User/provincias/${regionId}`);
  }

  obtenerAmbulancias(regionId: number, provinciaId: number): Observable<any[]> {
    return this.http.get<any[]>(`${apiURL}/User/ambulancias/${regionId}/${provinciaId}`);
  }

  obtenerEquiposRolesCargos(): Observable<any> {
    return this.http.get<any>(`${apiURL}/User/equipos-roles-cargos`);
  }


}
