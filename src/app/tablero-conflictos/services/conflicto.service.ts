import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import {apiURL} from '../../../ENV/env-variable'

@Injectable({
  providedIn: 'root'
})
export class ConflictoService {

  constructor(private http: HttpClient) {}

  filtrarConflictos(startDate: string, endDate: string, estatus: string): Observable<any> {
    let params = new HttpParams()
      .set('startDate', startDate)
      .set('endDate', endDate);

    if (estatus) {
      params = params.set('estatus', estatus);
    }

    return this.http.get(`${apiURL}/User/filtrar-conflictos`, { params });
  }

  obtenerConflictosUsuario(usuarioId: number): Observable<any> {
    return this.http.get<any>(`${apiURL}/User/ver-conflictos-usuario?usuarioId=${usuarioId}`);
  }

  actualizarEstatus(conflictoId: number, nuevoEstatus: string) {
    return this.http.patch(`${apiURL}/User/actualizar-estatus/${conflictoId}`, { nuevoEstatus });
  }

}
