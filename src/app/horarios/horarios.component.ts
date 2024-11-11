import { Component } from '@angular/core';
import Swal from 'sweetalert2';
import * as XLSX from 'xlsx';
import { ConflictoService } from '../tablero-conflictos/services/conflicto.service';

@Component({
  selector: 'app-horarios',
  templateUrl: './horarios.component.html',
  styleUrl: './horarios.component.css'
})
export class HorariosComponent {
  conflictosPendientes: any[] = [];
  conflictosEnProceso: any[] = [];
  conflictosAprobados: any[] = [];
  conflictosRechazados: any[] = [];

  // Variables para información del usuario
  cedula: string = '';
  usuarioNombre: string = '';
  usuarioProvincia: string = '';
  usuarioRegion: string = '';
  usuarioRol: string = '';
  usuarioTeam: string = '';
  usuarioId: number = 0;

  constructor(private conflictoService: ConflictoService) {}

  ngOnInit(): void {
    this.obtenerInformacionUsuario();
    this.cargarConflictos();
  }

  obtenerInformacionUsuario(): void {
    this.cedula = localStorage.getItem('cedula') || '';
    this.usuarioNombre = localStorage.getItem('nombre') || '';
    this.usuarioProvincia = localStorage.getItem('provincia') || '';
    this.usuarioRegion = localStorage.getItem('region') || '';
    this.usuarioRol = localStorage.getItem('role') || '';
    this.usuarioTeam = localStorage.getItem('teamName') || '';
    this.usuarioId = parseInt(localStorage.getItem('usuarioId') || '0', 10);
  }

  cargarConflictos(): void {
    if (this.usuarioId === 0) {
      Swal.fire('Error', 'Usuario no encontrado en el sistema.', 'error');
      return;
    }

    this.conflictoService.obtenerConflictosUsuario(this.usuarioId).subscribe(
      (data) => {
        if (data && typeof data === 'object' && 'Message' in data) {
          Swal.fire('Información', data.Message, 'info');
        } else if (Array.isArray(data)) {
          // Procesar cada conflicto y agrupar según el estatus
          this.conflictosPendientes = data.filter((c: any) => c.estatus === 'Pendiente');
          this.conflictosEnProceso = data.filter((c: any) => c.estatus === 'En Proceso');
          this.conflictosAprobados = data.filter((c: any) => c.estatus === 'Aprobado');
          this.conflictosRechazados = data.filter((c: any) => c.estatus === 'Rechazado');
        } else {
          Swal.fire('Advertencia', 'La respuesta del servidor no tiene el formato esperado.', 'warning');
        }
      },
      (error) => {
        console.error('Error al cargar conflictos:', error);
        Swal.fire('Error', 'Ocurrió un error al cargar los conflictos.', 'error');
      }
    );
  }


}
