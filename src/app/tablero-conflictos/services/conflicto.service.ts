import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import {apiURL} from '../../../ENV/env-variable'
import { ConflictosAgrupadosResponse, TipoAmbulancia } from '../interfaces/conflictosInterfaces';

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

  verificarSolicitudesActivas(usuarioId: number): Observable<any> {
    return this.http.get(`${apiURL}/User/verificar-solicitudes-activas`, {
      params: { usuarioId: usuarioId.toString() },
    });
  }

   // Actualizar estatus de la solicitud
  // Actualizar estatus de la solicitud con comentario del supervisor
  actualizarEstatusSolicitud(
    id: number,
    payload: { Estatus: string; DescripcionSupervisor: string }
  ): Observable<any> {
    const url = `${apiURL}/User/actualizar-estatus-solicitud/${id}`;
    return this.http.patch(url, payload);
  }


  // Nueva solicitud Permiso
  obtenerDiasDisponibles(usuarioId: number, conflictoId: number, fechaInicio: string, fechaFin: string): Observable<any> {
    return this.http.get(`${apiURL}/User/obtener-dias-disponibles`, {
      params: {
        usuarioId: usuarioId.toString(),
        conflictoId: conflictoId.toString(),
        fechaInicio,
        fechaFin
      }
    });
  }

  crearSolicitudPermisoV2(formData: FormData): Observable<any> {
    return this.http.post(`${apiURL}/User/crear-solicitud-permisoV2`, formData);
  }

  //
  crearSolicitudPermiso(solicitud: any): Observable<any> {
    return this.http.post(`${apiURL}/User/crear-solicitud-permiso`, solicitud);
  }

  actualizarImagenSolicitud(solicitudId: number, formData: FormData): Observable<any> {
    const url = `${apiURL}/User/actualizar-imagen-solicitud/${solicitudId}`;
    return this.http.patch(url, formData);
  }

  verificarConflictosAprobados(usuarioId: number): Observable<any> {
    return this.http.get(`${apiURL}/User/verificar-conflictos-aprobados`, {
      params: { usuarioId: usuarioId.toString() },
    });
  }

  obtenerDetalleSolicitud(solicitudId: any): Observable<any>{
    return this.http.get(`${apiURL}/User/detalles-solicitud/` + solicitudId);
  }

  obtenerDetalleSolicitudInforme(solicitudId: any): Observable<any>{
    return this.http.get(`${apiURL}/User/detalles-solicitudInforme/` + solicitudId);
  }

  filtrarConflictosAgrupados(params: any): Observable<TipoAmbulancia[]> {
    let httpParams = new HttpParams();

    if (params.regionId) httpParams = httpParams.set('regionId', params.regionId);
    if (params.provinciaId) httpParams = httpParams.set('provinciaId', params.provinciaId);
    if (params.estatus) httpParams = httpParams.set('estatus', params.estatus);
    if (params.startDate) httpParams = httpParams.set('startDate', params.startDate);
    if (params.endDate) httpParams = httpParams.set('endDate', params.endDate);
    if (params.nivel) httpParams = httpParams.set('nivel', params.nivel);

    return this.http.get<TipoAmbulancia[]>(`${apiURL}/User/filtrar-conflictos-agrupados`, { params: httpParams });
  }

  obtenerConflictosUsuario(usuarioId: number): Observable<any> {
    return this.http.get<any>(`${apiURL}/User/ver-conflictos-usuario?usuarioId=${usuarioId}`);
  }

  actualizarEstatus(conflictoId: number, nuevoEstatus: string) {
    //console.log(nuevoEstatus);
    return this.http.patch<any>(`${apiURL}/User/actualizar-estatus/${conflictoId}`, nuevoEstatus, {
      headers: { 'Content-Type': 'application/json' }
    });
  }

  obtenerDetalleConflictoAsociado(conflictoId: number): Observable<any> {
    return this.http.get(`${apiURL}/User/detalle-conflicto-asociado/${conflictoId}`);
  }


  obtenerImagenUrl(conflictId: number, cedula: string): Observable<any> {
    return this.http.get<any>(`${apiURL}/User/conflicts/${conflictId}/user/${cedula}/image-url`);
  }

  obtenerImagenUrlPermission(permissionId: number, cedula: string): Observable<any> {
    const url = `${apiURL}/User/permissions/${permissionId}/user/${cedula}/image-url`;
    return this.http.get<any>(url);
  }


  // Obtener días habilitados de un conflicto
  obtenerDiasConflictoDetalle(conflictoId: number): Observable<any> {
    return this.http.get(`${apiURL}/User/dias-conflicto-detalle/${conflictoId}`);
  }

  // Deshabilitar un día de la semana en un conflicto
  deshabilitarDiaSemana(conflictoId: number, request: { diaSemana: number }): Observable<any> {
    return this.http.put(`${apiURL}/User/deshabilitar-dia-semana/${conflictoId}`, request);
  }

  deshabilitarDetallesConflicto(conflictoId: number, request: any): Observable<any> {
    return this.http.put(`${apiURL}/User/deshabilitar-detalles-conflicto/${conflictoId}`, request);
  }

  actualizarEstadoSolicitud(id: number, request: any): Observable<any> {
    return this.http.put(`${apiURL}/User/actualizar-estado-solicitud/${id}`, request);
  }





}
