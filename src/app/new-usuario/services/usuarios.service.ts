import { Injectable } from '@angular/core';
import {apiURL} from '../../../ENV/env-variable'
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class UsuariosModuleService {

  constructor(private http: HttpClient) {}
// Nuevo
// Obtener usuarios con filtros y paginación
obtenerUsuarios(regionId?: number, provinciaId?: number, pageNumber = 1, pageSize = 10): Observable<any> {
  const params: any = {};
  if (regionId) params.regionId = regionId;
  if (provinciaId) params.provinciaId = provinciaId;
  params.pageNumber = pageNumber;
  params.pageSize = pageSize;

  return this.http.get<any>(`${apiURL}/User/usuarios`, { params });
}

// Obtener usuario por ID
obtenerUsuarioPorId(id: number): Observable<any> {
  return this.http.get<any>(`${apiURL}/User/usuariosById/${id}`);
}

 // Editar usuario
 editarUsuario(id: number, usuario: any): Observable<any> {
  return this.http.put<any>(`${apiURL}/User/editar-usuarioById/${id}`, usuario);
}

//
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
