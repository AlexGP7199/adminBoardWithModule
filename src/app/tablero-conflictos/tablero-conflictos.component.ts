import { Component, OnInit } from '@angular/core';
import { ConflictoService } from './services/conflicto.service';
import { Conflicto } from './interfaces/conflictosInterfaces';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-tablero-conflictos',
  templateUrl: './tablero-conflictos.component.html',
  styleUrl: './tablero-conflictos.component.css'
})
export class TableroConflictosComponent implements OnInit {
  conflictos: Conflicto[] = [];
  detalleUsuario: any = null;
  mostrarDetalle = false;
  startDate: string;
  endDate: string;
  estatus = 'Aprobado';
  estatusList = ['Pendiente', 'En Proceso', 'Aprobado', 'Rechazado'];
  primeraCarga = true;

  constructor(private conflictosService: ConflictoService) {
    const today = new Date();
    this.startDate = this.formatDate(today);
    this.endDate = this.formatDate(new Date(today.setDate(today.getDate() + 14)));
  }

  ngOnInit(): void {
    this.obtenerConflictos();
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

    this.conflictosService
      .filtrarConflictos(this.startDate, this.endDate, this.estatus)
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

    this.conflictosService.actualizarEstatus(conflictoId, nuevoEstatus).subscribe(
      (response: any) => {
        Swal.fire('Éxito', response.Message, 'success');
        this.obtenerConflictos(); // Actualizar lista de conflictos después de cambiar el estatus
      },
      (error) => {
        Swal.fire('Error', 'No se pudo actualizar el estatus.', 'error');
      }
    );
  }

  private formatDate(date: Date): string {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  }
}
