import { Injectable } from '@angular/core';
import {apiURL} from '../../../ENV/env-variable'
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AmbulanciasService {

  constructor(private http: HttpClient) {}

  crearAmbulancia(ambulancia: any): Observable<any> {
    return this.http.post(`${apiURL}/ambulancias/crear-ambulancia`, ambulancia);
  }

  obtenerTiposAmbulancia(): Observable<any[]> {
    return this.http.get<any[]>(`${apiURL}/ambulancias/tipos-ambulancias`);
  }

  obtenerAmbulancias(regionId?: number, provinciaId?: number): Observable<any[]> {
    const params: any = {};
    if (regionId) params.regionId = regionId;
    if (provinciaId) params.provinciaId = provinciaId;

    return this.http.get<any[]>(`${apiURL}/Ambulancias/ambulancias`, { params });
  }

    // Obtener ambulancia por ID
    obtenerAmbulanciaPorId(id: number): Observable<any> {
      return this.http.get<any>(`${apiURL}/Ambulancias/ambulancias/${id}`);
    }

    // Editar una ambulancia por ID
    editarAmbulancia(id: number, ambulanciaActualizada: any): Observable<any> {
      return this.http.put<any>(`${apiURL}/Ambulancias/editar-ambulancia/${id}`, ambulanciaActualizada);
    }


}
