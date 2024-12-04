import { Component, OnInit } from '@angular/core';
import Swal from 'sweetalert2';
import { ConflictoService } from '../tablero-conflictos/services/conflicto.service';
import { AuthService } from '../services/auth.service';

@Component({
  selector: 'app-solicitud-permiso',
  templateUrl: './solicitud-permiso.component.html',
  styleUrls: ['./solicitud-permiso.component.css']
})
export class SolicitudPermisoComponent implements OnInit {

  detallesSeleccionados: { fechaConflicto: string; seleccionado: boolean }[] = [];



  usuarioId: number = 0; // Se obtiene del localStorage
  solicitudesActivas: any[] = [];
  tieneSolicitudesActivas: boolean = false;
  mostrarFormulario: boolean = false;
  mostrarDetalle: boolean = false; // Controlar la vista de detalles
  conflictoId: number | null = null; // Para almacenar el conflicto aprobado
  detalleSolicitud: any = null; // Almacenar los datos del detalle de la solicitud
  solicitudId : any = 0;
  mostrarRetirar: boolean = false;

  //

  diasHabilitados: { nombre: string; valor: string }[] = []; // Lista de días habilitados
  diaSeleccionado: string = ''; // Día seleccionado por el usuario para deshabilitar


  nuevaSolicitud = {
    usuarioId: 0,
    conflictoId: 0,
    fechaInicio: '',
    fechaFin: '',
    descripcionPersonal: '',
  };

  constructor(private conflictoService: ConflictoService, private authService: AuthService) {}

  ngOnInit(): void {
    this.usuarioId = this.obtenerUsuarioId();
    if (this.usuarioId) {
      this.nuevaSolicitud.usuarioId = this.usuarioId; // Asignar usuarioId al modelo
      this.verificarConflictosAprobados();
      this.obtenerSolicitudesActivasConValidacion(); // Validar y obtener solicitudes activas
    } else {
      Swal.fire('Error', 'No se pudo obtener el usuario.', 'error');
    }
  }

  obtenerSolicitudesActivasConValidacion(): void {
    console.log('entre aqui 1');
    this.conflictoService.verificarSolicitudesActivas(this.usuarioId).subscribe(
      (response: any) => {
        this.tieneSolicitudesActivas = response.tieneSolicitudesActivas;
        this.solicitudesActivas = response.solicitudes || [];

        // Validar cada solicitud activa
        this.solicitudesActivas.forEach((solicitud) => {
          const fechaFin = new Date(solicitud.fechaFin);
          const hoy = new Date();

          // Obtener el detalle de la solicitud antes de validar
          this.conflictoService.obtenerDetalleSolicitud(solicitud.id).subscribe(
            (detalle: any) => {
              if (detalle && detalle.conflictoDetalles) {
                console.log('entre aqui en el If detalle 2');
                console.log(detalle);

                // Si no hay detalles habilitados, conflictoDetalles estará vacío
                const tieneDetallesHabilitados = detalle.conflictoDetalles.length > 0;
                console.log('Detalles habilitados:', tieneDetallesHabilitados);

                // Verificar condiciones
                if (!tieneDetallesHabilitados || fechaFin < hoy) {
                  console.log('entre aqui 3');
                  this.finalizarSolicitud(
                    solicitud.id,
                    'Finalizada',
                    'Solicitud finalizada automáticamente por el sistema.'
                  );
                }
              } else {
                console.warn(`No se encontraron conflictoDetalles para la solicitud ${solicitud.id}`);
              }
            },
            (error) => {
              console.error('Error al obtener el detalle de la solicitud:', error);
            }
          );
        });
      },
      (error) => {
        Swal.fire('Error', 'No se pudieron obtener las solicitudes activas.', 'error');
      }
    );
  }


  finalizarSolicitud(solicitudId: number, estado: string, descripcion: string): void {
    const request = {
      Estado: estado,
      DescripcionSupervisor: descripcion,
    };

    this.conflictoService.actualizarEstadoSolicitud(solicitudId, request).subscribe(
      (response: any) => {
        console.log(`Solicitud ${solicitudId} finalizada automáticamente:`, response.Message);
        Swal.fire('Éxito', `La solicitud ${solicitudId} se finalizó automáticamente.`, 'success');
        this.obtenerSolicitudesActivas(); // Refrescar la lista de solicitudes activas
      },
      (error) => {
        console.error(`Error al finalizar la solicitud ${solicitudId}:`, error);
      }
    );
  }


  // Obtener usuarioId del localStorage
  obtenerUsuarioId(): number {
    const decodedToken = this.authService.getDecodedToken();
    return decodedToken && decodedToken.usuarioId ? parseInt(decodedToken.usuarioId, 10) : 0;
  }

  // Verificar conflictos aprobados
  verificarConflictosAprobados(): void {
    this.conflictoService.verificarConflictosAprobados(this.usuarioId).subscribe(
      (response: any) => {
        //.log('lo que traigo del server aprobados')
        //console.log(response);
        if (response.tieneConflictoAprobado) {
          this.conflictoId = response.conflictoId;
         // console.log('ConflictoAprobado');
          //console.log(response)
          this.nuevaSolicitud.conflictoId = this.conflictoId || 0; // Asignar conflictoId al modelo
        } else {
          Swal.fire('Sin Solicitudes Activas', response.Message, 'info');
          this.conflictoId = response.conflictoId || null;
        }
      },
      (error) => {
        Swal.fire('Error', 'No se pudo verificar conflictos aprobados.', 'error');
      }
    );
  }

  // Obtener solicitudes activas
  obtenerSolicitudesActivas(): void {
    this.conflictoService.verificarSolicitudesActivas(this.usuarioId).subscribe(
      (response: any) => {
        this.tieneSolicitudesActivas = response.tieneSolicitudesActivas;
        this.solicitudesActivas = response.solicitudes || [];
      },
      (error) => {
        Swal.fire('Error', 'No se pudieron obtener las solicitudes activas.', 'error');
      }
    );
  }

  // Mostrar formulario para nueva solicitud
  mostrarFormularioNuevaSolicitud(): void {
    if (this.conflictoId) {
      this.mostrarFormulario = true;
      this.mostrarDetalle = false; // Oculta el detalle en caso de estar visible
    } else {
      Swal.fire('Error', 'Debe tener un conflicto aprobado para crear una solicitud.', 'error');
    }
  }


  // Crear nueva solicitud
  crearSolicitudPermiso(): void {
    if (!this.nuevaSolicitud.fechaInicio || !this.nuevaSolicitud.fechaFin || !this.nuevaSolicitud.descripcionPersonal) {
      Swal.fire('Error', 'Todos los campos son obligatorios.', 'error');
      return;
    }

    // Validar el rango de fechas (máximo 14 días)
    const fechaInicio = new Date(this.nuevaSolicitud.fechaInicio);
    const fechaFin = new Date(this.nuevaSolicitud.fechaFin);
    const diferenciaDias = (fechaFin.getTime() - fechaInicio.getTime()) / (1000 * 60 * 60 * 24);

    if (diferenciaDias > 14) {
      Swal.fire('Error', 'El rango máximo permitido es de 14 días.', 'error');
      return;
    }

    if (!this.nuevaSolicitud.conflictoId) {
      Swal.fire('Error', 'No se encontró un conflicto aprobado.', 'error');
      return;
    }

    this.conflictoService.crearSolicitudPermiso(this.nuevaSolicitud).subscribe(
      (response: any) => {
        Swal.fire('Éxito', 'Solicitud creada exitosamente.', 'success');
        this.mostrarFormulario = false;
        this.obtenerSolicitudesActivas(); // Actualizar solicitudes activas
      },
      (error) => {
        Swal.fire('Error', error.error || 'No se pudo crear la solicitud.', 'error');
      }
    );
  }


  // Ver detalle de solicitud
  verDetalleSolicitud(solicitudId: number): void {
    this.solicitudId = solicitudId;
    this.conflictoService.obtenerDetalleSolicitud(solicitudId).subscribe(
      (response: any) => {
        this.detalleSolicitud = response; // Guardar detalle de la solicitud
        this.detallesSeleccionados = response.conflictoDetalles.map((detalle: any) => ({
          fechaConflicto: detalle.fechaConflicto,
          seleccionado: false
        }));
        this.mostrarDetalle = true; // Mostrar la vista de detalle
        this.mostrarFormulario = false; // Ocultar el formulario de nueva solicitud
        this.obtenerDiasHabilitados(); // Obtener los días habilitados para deshabilitar
      },
      (error) => {
        Swal.fire('Error', 'No se pudo obtener el detalle de la solicitud.', 'error');
      }
    );
  }

  deshabilitarDetallesConflicto(): void {
    const diasQuitar = this.detallesSeleccionados
      .filter((detalle) => detalle.seleccionado)
      .map((detalle) => detalle.fechaConflicto);

    if (diasQuitar.length === 0) {
      Swal.fire('Error', 'Debe seleccionar al menos un detalle.', 'error');
      return;
    }

    const request = { diasQuitar };

    this.conflictoService.deshabilitarDetallesConflicto(this.conflictoId!, request).subscribe(
      (response: any) => {
        Swal.fire('Éxito', response.Message, 'success');

        // Cerrar la vista de detalle
        this.cerrarDetalle();

        // Volver a ejecutar ngOnInit
        this.ngOnInit();
      },
      (error) => {
        Swal.fire('Error', error.error || 'No se pudieron deshabilitar los detalles.', 'error');
      }
    );
  }



  obtenerDiasHabilitados(): void {
    if (!this.conflictoId) {
      Swal.fire('Error', 'No se encontró un conflicto asociado.', 'error');
      return;
    }
    //console.log(' conflicto ');
    //console.log(this.conflictoId);
    this.conflictoService.obtenerDiasConflictoDetalle(this.conflictoId).subscribe(
      (response: any) => {
        //console.log(' lo que trae de data el server de dias');
        //console.log(response)
        if (response.diasSemana) {
          this.diasHabilitados = response.diasSemana.map((dia: any) => ({
            nombre: dia.nombre, // Nombre legible del día (e.g., "Monday")
            valor: dia.dia // Valor del día (e.g., "0" para Sunday)
          }));
        } else {
          this.diasHabilitados = [];
          Swal.fire('Sin Días Habilitados', response.Message, 'info');
        }
      },
      (error) => {
        Swal.fire('Error', 'No se pudieron obtener los días habilitados.', 'error');
      }
    );
  }

  mostrarRetirarDia(): void {
    this.obtenerDiasHabilitados(); // Obtener los días habilitados
    this.mostrarRetirar = true;
    this.mostrarFormulario = false;
    this.mostrarDetalle = false;
  }

  deshabilitarDiaSemana(): void {
    if (!this.diaSeleccionado) {
      Swal.fire('Error', 'Debe seleccionar un día de la semana.', 'error');
      return;
    }

    const request = { diaSemana: parseInt(this.diaSeleccionado, 10) };


    this.conflictoService.deshabilitarDiaSemana(this.detalleSolicitud.conflictoId, request).subscribe(
      (response: any) => {
        Swal.fire('Éxito', response.Message, 'success');
        this.obtenerDiasHabilitados(); // Actualiza la lista de días habilitados
      },
      (error) => {
        Swal.fire('Error', error.error || 'No se pudo deshabilitar el día.', 'error');
      }
    );
  }


  cerrarFormulario(): void {
    this.mostrarFormulario = false;
  }

  retirarDiaTrimestre(): void {
    if (!this.diaSeleccionado) {
      Swal.fire('Error', 'Debe seleccionar un día de la semana.', 'error');
      return;
    }

    const request = { diaSemana: parseInt(this.diaSeleccionado, 10) };

    this.conflictoService.deshabilitarDiaSemana(this.conflictoId!, request).subscribe(
      (response: any) => {
        Swal.fire('Éxito', response.Message, 'success');
          // Cerrar el formulario de retirar día y limpiar selección
      this.cerrarRetirar();

        this.obtenerDiasHabilitados(); // Actualiza la lista de días habilitados
      },
      (error) => {
        Swal.fire('Error', error.error || 'No se pudo retirar el día.', 'error');
      }
    );
  }

  // Cerrar formulario de retirar día
cerrarRetirar(): void {
  this.mostrarRetirar = false;
  this.diaSeleccionado = ''; // Resetear selección
}
  // Cerrar detalle de solicitud
  cerrarDetalle(): void {
    this.mostrarDetalle = false;
    this.detalleSolicitud = null;
  }

  cancelarFormulario(): void {
    this.mostrarFormulario = false;
    // Aquí podrías resetear el objeto `nuevaSolicitud` si es necesario
    this.nuevaSolicitud = {
      usuarioId: this.usuarioId,
      conflictoId: 0,
      fechaInicio: '',
      fechaFin: '',
      descripcionPersonal: '',
    };
  }

}
