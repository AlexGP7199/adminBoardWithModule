import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import {apiURL} from '../../../ENV/env-variable'

@Injectable({
  providedIn: 'root'
})
export class ConflictoService {

  constructor(private http: HttpClient) {}

  filtrarConflictos(
    startDate: string,
    endDate: string,
    estatus: string,
    nivel: number,
    teamId?: number,
    provinciaId?: number,
    regionId?: number,
   ): Observable<any> {
    let params = new HttpParams()
      .set('startDate', startDate)
      .set('endDate', endDate)

    if (estatus) {
      params = params.set('estatus', estatus);
    }
    if (teamId !== undefined) {
      params = params.set('teamId', teamId.toString());
    }
    if (provinciaId !== undefined) {
      params = params.set('provinciaId', provinciaId.toString());
    }
    if (regionId !== undefined) {
      params = params.set('regionId', regionId.toString());
    }

    params = params.set('nivel', nivel.toString());

    return this.http.get(`${apiURL}/User/filtrar-conflictos`, { params });
  }


  obtenerConflictosUsuario(usuarioId: number): Observable<any> {
    return this.http.get<any>(`${apiURL}/User/ver-conflictos-usuario?usuarioId=${usuarioId}`);
  }

  actualizarEstatus(conflictoId: number, nuevoEstatus: string) {
    console.log(nuevoEstatus);
    return this.http.patch<any>(`${apiURL}/User/actualizar-estatus/${conflictoId}`, nuevoEstatus, {
      headers: { 'Content-Type': 'application/json' }
    });
  }

}
