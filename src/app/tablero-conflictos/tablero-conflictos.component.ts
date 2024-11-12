import { Component, OnInit } from '@angular/core';
import { ConflictoService } from './services/conflicto.service';
import { Conflicto } from './interfaces/conflictosInterfaces';
import Swal from 'sweetalert2';
import { UsuarioService } from '../tablero-usuarios/services/usuario.service';

@Component({
  selector: 'app-tablero-conflictos',
  templateUrl: './tablero-conflictos.component.html',
  styleUrl: './tablero-conflictos.component.css'
})
export class TableroConflictosComponent implements OnInit {
  searchNombre: string = '';
  searchFecha: string = '';
  conflictos: Conflicto[] = [];
  detalleUsuario: any = null;
  mostrarDetalle = false;
  startDate: string;
  endDate: string;
  estatus = 'Aprobado';
  estatusList = ['Pendiente', 'En Proceso', 'Aprobado', 'Rechazado'];
  primeraCarga = true;

  // Nuevas propiedades
  nivelUsuario: number = 0;
  regiones: any[] = [];
  provinciasFiltradas: any[] = [];
  equipos: any[] = [];
  selectedRegion: number | null = null;
  selectedProvincia: number | null = null;
  selectedTeam: number | null = null;
  userData: any = {};

  constructor(private conflictosService: ConflictoService, private  usuarioService: UsuarioService) {
    const today = new Date();
    this.startDate = this.formatDate(today);
    this.endDate = this.formatDate(new Date(today.setDate(today.getDate() + 14)));
  }

  onTeamChange(): void {
    // Llamar a obtenerConflictos() para filtrar la tabla según el equipo seleccionado
    this.obtenerConflictos();
  }


  ngOnInit(): void {
    this.userData = this.obtenerDatosLocalStorage();
    this.nivelUsuario = parseInt(this.userData.nivel, 10) || 0;

    if (this.nivelUsuario === 1) {
        // Nivel 1: Cargar conflictos solo de la región, provincia y equipo asignados
        this.selectedRegion = this.userData.regionId;
        this.selectedProvincia = this.userData.provinciaId;
        this.selectedTeam = this.userData.teamId;
        this.obtenerConflictos();
    } else if (this.nivelUsuario === 2) {
        // Nivel 2: Permitir cambio de provincia y cargar provincias para la región inicial
        this.selectedRegion = this.userData.regionId;
        this.cargarProvincias(this.selectedRegion!); // Cargar provincias con la región inicial
        this.selectedProvincia = this.userData.provinciaId;
        this.obtenerConflictos();
    } else if (this.nivelUsuario === 3) {
        // Nivel 3: Cargar todas las opciones de región, provincia y equipo
        this.cargarRegiones();
        this.cargarEquipos();
        this.selectedRegion = this.userData.regionId;

        // Cargar provincias si la región está definida
        if (this.selectedRegion) {
            this.cargarProvincias(this.selectedRegion);
        }

        this.selectedProvincia = this.userData.provinciaId;
        this.selectedTeam = this.userData.teamId;
        this.obtenerConflictos();
    }
}


  obtenerDatosLocalStorage(): any {
    const userData: any = {};
    for (let i = 0; i < localStorage.length; i++) {
      const key = localStorage.key(i);
      if (key) {
        userData[key] = localStorage.getItem(key);
      }
    }
    return userData;
  }

  validarFechas(): boolean {
    const start = new Date(this.startDate);
    const end = new Date(this.endDate);

    if (start > end) {
      Swal.fire({
        title: 'Error en las fechas',
        text: 'La fecha final no puede ser menor que la fecha de inicio.',
        icon: 'error',
        confirmButtonText: 'Aceptar'
      });
      return false;
    }
    return true;
  }

  obtenerConflictos(): void {
    if (!this.validarFechas()) return;

    const teamId = this.selectedTeam !== null ? this.selectedTeam : undefined;
    const provinciaId = this.selectedProvincia !== null ? this.selectedProvincia : undefined;
    const regionId = this.selectedRegion !== null ? this.selectedRegion : undefined;

    this.conflictosService
      .filtrarConflictos(this.startDate, this.endDate, this.estatus,this.nivelUsuario , teamId, provinciaId, regionId)
      .subscribe(
        (data) => {
          if (Array.isArray(data) && data.length > 0) {
            this.conflictos = data.map(conflicto => ({
              ...conflicto,
              nuevoEstatus: conflicto.estatus // Añadir propiedad para nuevo estatus
            }));
            this.primeraCarga = false;
          } else {
            this.conflictos = [];
            this.mostrarMensajeSinResultados();
          }
        },
        (error) => console.error('Error al obtener conflictos:', error)
      );
  }


  mostrarMensajeSinResultados(): void {
    const mensaje = this.primeraCarga
      ? 'No se encontraron conflictos en las próximas dos semanas con el estatus seleccionado.'
      : 'No se encontraron peticiones de conflictos.';
    Swal.fire({
      title: 'Sin resultados',
      text: mensaje,
      icon: 'info',
      confirmButtonText: 'Aceptar'
    });
    this.primeraCarga = false;
  }

  verDetalle(usuarioId: number): void {
    this.conflictosService.obtenerConflictosUsuario(usuarioId).subscribe(
      (data) => {
        if (Array.isArray(data) && data.length > 0) {
          this.detalleUsuario = data[0];
          this.mostrarDetalle = true;
        } else if (data && data.Message) {
          Swal.fire({
            title: 'Sin conflictos actuales o futuros',
            text: data.Message,
            icon: 'info',
            confirmButtonText: 'Aceptar'
          });
        }
      },
      (error) => console.error('Error al obtener detalle del usuario:', error)
    );
  }

  volverATabla(): void {
    this.mostrarDetalle = false;
    this.detalleUsuario = null;
  }

  onEstatusChange(event: any): void {
    this.estatus = event.target.value;
    this.obtenerConflictos();
  }

  onFechaChange(): void {
    this.obtenerConflictos();
  }

  cambiarEstatus(conflictoId: number, nuevoEstatus: string): void {
    if (!this.estatusList.includes(nuevoEstatus)) {
      Swal.fire('Error', 'Estatus inválido. Selecciona un estatus permitido.', 'error');
      return;
    }

    this.conflictosService.actualizarEstatus(conflictoId, JSON.stringify(nuevoEstatus)).subscribe(
      (response: any) => {
        Swal.fire({
          title: 'Éxito',
          text: 'El estatus ha sido actualizado correctamente.',
          icon: 'success',
          confirmButtonText: 'Aceptar'
        }).then(() => {
          this.mostrarDetalle = false;
          this.detalleUsuario = null;
          this.obtenerConflictos();
        });
      },
      (error) => {
        Swal.fire({
          title: 'Error',
          text: 'No se pudo actualizar el estatus. Inténtelo de nuevo más tarde.',
          icon: 'error',
          confirmButtonText: 'Aceptar'
        });
      }
    );
  }

  onRegionChange(): void {
    if (this.selectedRegion) {
      this.cargarProvincias(this.selectedRegion);
    } else {
      this.provinciasFiltradas = [];
    }
    this.selectedProvincia = null;
    this.obtenerConflictos();
  }

  onProvinciaChange(): void {
    this.obtenerConflictos();
  }

  cargarRegiones(): void {
    this.usuarioService.obtenerRegiones().subscribe(
      (regiones) => (this.regiones = regiones),
      (error) => console.error('Error al cargar regiones:', error)
    );
  }

  cargarProvincias(regionId: number): void {
    this.usuarioService.obtenerProvincias(regionId).subscribe(
      (provincias) => (this.provinciasFiltradas = provincias),
      (error) => console.error('Error al cargar provincias:', error)
    );
  }

  cargarEquipos(): void {
    this.usuarioService.obtenerEquipos().subscribe(
      (equipos) => (this.equipos = equipos),
      (error) => console.error('Error al cargar equipos:', error)
    );
  }

  private formatDate(date: Date): string {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  }
}
