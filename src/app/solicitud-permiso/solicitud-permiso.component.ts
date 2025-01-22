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
  selectedImage: File | null = null;

  previewUrl: string | null = null; // Variable para almacenar la URL de la imagen
  usuarioId: number = 0; // Se obtiene del localStorage
  solicitudesActivas: any[] = [];
  tieneSolicitudesActivas: boolean = false;
  mostrarFormulario: boolean = false;
  mostrarDetalle: boolean = false; // Controlar la vista de detalles
  conflictoId: number | null = null; // Para almacenar el conflicto aprobado
  detalleSolicitud: any = null; // Almacenar los datos del detalle de la solicitud
  solicitudId : any = 0;
  mostrarRetirar: boolean = false;
  fechaInicioFormateada: string = '';
  fechaFinFormateada: string = '';

  //

  diasHabilitados: { nombre: string; valor: string }[] = []; // Lista de días habilitados
  diaSeleccionado: string = ''; // Día seleccionado por el usuario para deshabilitar

  pasoActual: number = 1; // Control de pasos del formulario
  mostrarDescripcionYImagen: boolean = false;
  nuevaSolicitud = {
    usuarioId: 1,  // Simulación de usuario
    conflictoId: 2, // Simulación de conflicto aprobado
    fechaInicio: '',
    fechaFin: '',
    descripcionPersonal: '',
    file: null as File | null, // Nuevo campo para el archivo
    diasSeleccionados: [] as Date[]
  };

  diasDisponibles: any[] = [];
  //
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


  // Buscar días disponibles
  buscarDiasDisponibles(): void {
    if (!this.nuevaSolicitud.fechaInicio || !this.nuevaSolicitud.fechaFin) {
      Swal.fire('Error', 'Debe seleccionar un rango de fechas.', 'error');
      return;
    }

    const fechaInicio = new Date(this.nuevaSolicitud.fechaInicio);
    const fechaFin = new Date(this.nuevaSolicitud.fechaFin);
    const diferenciaDias = (fechaFin.getTime() - fechaInicio.getTime()) / (1000 * 60 * 60 * 24);

    if (diferenciaDias > 14) {
      Swal.fire('Error', 'El rango máximo permitido es de 14 días.', 'error');
      return;
    }

    this.conflictoService.obtenerDiasDisponibles(
      this.nuevaSolicitud.usuarioId,
      this.nuevaSolicitud.conflictoId,
      this.nuevaSolicitud.fechaInicio,
      this.nuevaSolicitud.fechaFin
    ).subscribe((response: any) => {
      if (response.diasDisponibles) {
        this.diasDisponibles = response.diasDisponibles.map((d: any) => ({ ...d, seleccionado: false }));
        this.pasoActual = 2; // Avanzar al siguiente paso después de la búsqueda
      } else {
        Swal.fire('Info', response.Message || 'No hay días disponibles.', 'info');
      }
    }, (error) => {
      Swal.fire('Error', 'No se pudieron obtener los días disponibles.', 'error');
    });
  }

// Actualizar la lista de días seleccionados cuando se cambia un checkbox
actualizarDiasSeleccionados(): void {
  this.nuevaSolicitud.diasSeleccionados = this.diasDisponibles
    .filter(d => d.seleccionado)
    .map(d => new Date(d.fechaConflicto)); // Convertir a objeto Date
}

 // Guardar días y continuar al siguiente paso
 guardarDiasYContinuar(): void {
  if (this.nuevaSolicitud.diasSeleccionados.length === 0) {
    Swal.fire('Error', 'Debe seleccionar al menos un día.', 'error');
    return;
  }
  this.pasoActual = 3; // Avanzar al paso de descripción e imagen
}


// Guardar los días seleccionados y mostrar los apartados adicionales
salvarDiasSeleccionados(): void {
  if (this.nuevaSolicitud.diasSeleccionados.length > 0) {
    Swal.fire('Éxito', 'Días seleccionados guardados correctamente.', 'success');
    this.mostrarDescripcionYImagen = true;
  } else {
    Swal.fire('Error', 'Debe seleccionar al menos un día.', 'error');
  }
}


// Crear nueva solicitud
crearSolicitudPermisoV2(): void {
  const seleccionados = this.diasDisponibles.filter(d => d.seleccionado).map(d => d.fechaConflicto);

  if (!this.nuevaSolicitud.fechaInicio || !this.nuevaSolicitud.fechaFin || !this.nuevaSolicitud.descripcionPersonal || !this.nuevaSolicitud.file || seleccionados.length === 0) {
    Swal.fire('Error', 'Todos los campos son obligatorios, incluidos los días seleccionados y la imagen.', 'error');
    return;
  }

  const formData = new FormData();
  formData.append('usuarioId', this.nuevaSolicitud.usuarioId.toString());
  formData.append('conflictoId', this.nuevaSolicitud.conflictoId.toString());
  formData.append('fechaInicio', this.nuevaSolicitud.fechaInicio);
  formData.append('fechaFin', this.nuevaSolicitud.fechaFin);
  formData.append('descripcionPersonal', this.nuevaSolicitud.descripcionPersonal);
  formData.append('file', this.nuevaSolicitud.file);
  seleccionados.forEach(d => formData.append('diasSeleccionados', d));
  console.log('Contenido de formData:');
  const formDataObject: any = {};
  formData.forEach((value, key) => {
    formDataObject[key] = value;
  });
  console.log('FormData como objeto JSON:', formDataObject);

  this.conflictoService.crearSolicitudPermisoV2(formData).subscribe(
    (response: any) => {
      Swal.fire('Éxito', 'Solicitud creada exitosamente.', 'success');
      this.cancelarFormulario()
      this.obtenerSolicitudesActivas();
      //this.mostrarFormulario = false;

    },
    (error) => {
      Swal.fire('Error', error.error || 'No se pudo crear la solicitud.', 'error');
    }
  );
}

// Función para retroceder un paso, asegurando que no vaya más atrás del paso 1
volverPaso(): void {
  if (this.pasoActual > 1) {
    this.pasoActual -= 1;
  }
}


  abrirImagenEnNuevaPestana(url: string): void {
    if (url) {
      window.open(url, '_blank');
    } else {
      console.error('No se pudo abrir la imagen porque la URL es inválida.');
    }
  }


  onFileSelected(event: any): void {
    const file: File = event.target.files[0];

    if (file) {
      // Validar que el archivo sea una imagen
      const validImageTypes = ['image/jpeg', 'image/png', 'image/gif'];
      if (!validImageTypes.includes(file.type)) {
        Swal.fire('Error', 'Solo se permiten imágenes en formato JPG, PNG o GIF.', 'error');
        this.nuevaSolicitud.file = null; // Reiniciar el archivo
        this.previewUrl = null; // Eliminar la previsualización
        return;
      }

      // Generar la URL para previsualizar la imagen
      const reader = new FileReader();
      reader.onload = () => {
        this.previewUrl = reader.result as string;
      };
      reader.readAsDataURL(file);

      this.nuevaSolicitud.file = file;
    }
  }



  obtenerSolicitudesActivasConValidacion(): void {
    //console.log('entre aqui 1');
    this.conflictoService.verificarSolicitudesActivas(this.usuarioId).subscribe(
      (response: any) => {

        //console.log('solicitudActiva');
        //console.log(response);
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
                //console.log('entre aqui en el If detalle 2');
                //console.log(detalle);

                // Si no hay detalles habilitados, conflictoDetalles estará vacío
                const tieneDetallesHabilitados = detalle.conflictoDetalles.length > 0;
                //console.log('Detalles habilitados:', tieneDetallesHabilitados);

                // Verificar condiciones
                if (!tieneDetallesHabilitados || fechaFin < hoy) {
                  //console.log('entre aqui 3');
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
        //console.log(`Solicitud ${solicitudId} finalizada automáticamente:`, response.Message);
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
      this.mostrarRetirar = false;
      this.mostrarFormulario = true;
      this.mostrarDetalle = false; // Oculta el detalle en caso de estar visible
    } else {
      Swal.fire('Error', 'Debe tener un conflicto aprobado para crear una solicitud.', 'error');
    }
  }


  // Crear nueva solicitud
  crearSolicitudPermiso(): void {
    if (!this.nuevaSolicitud.fechaInicio || !this.nuevaSolicitud.fechaFin || !this.nuevaSolicitud.descripcionPersonal || !this.nuevaSolicitud.file) {
      Swal.fire('Error', 'Todos los campos son obligatorios, incluido el archivo.', 'error');
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

    // Crear un FormData para enviar la solicitud con el archivo
    const formData = new FormData();
    formData.append('usuarioId', this.nuevaSolicitud.usuarioId.toString());
    formData.append('conflictoId', this.nuevaSolicitud.conflictoId.toString());
    formData.append('fechaInicio', this.nuevaSolicitud.fechaInicio);
    formData.append('fechaFin', this.nuevaSolicitud.fechaFin);
    formData.append('descripcionPersonal', this.nuevaSolicitud.descripcionPersonal);
    formData.append('file', this.nuevaSolicitud.file!); // El archivo es obligatorio

    this.conflictoService.crearSolicitudPermiso(formData).subscribe(
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

// Manejar el archivo seleccionado
onImageSelected(event: Event): void {
  const input = event.target as HTMLInputElement;
  if (input.files && input.files.length > 0) {
    this.selectedImage = input.files[0];
  } else {
    this.selectedImage = null;
  }
}

// Actualizar la imagen de la solicitud
actualizarImagenSolicitud(): void {
  if (!this.selectedImage || !this.detalleSolicitud) {
    Swal.fire('Error', 'Debes seleccionar una imagen antes de proceder.', 'error');
    return;
  }

  const formData = new FormData();
  formData.append('File', this.selectedImage);

  this.conflictoService.actualizarImagenSolicitud(this.detalleSolicitud.id, formData).subscribe({
    next: (response: any) => {
      Swal.fire('Éxito', response.Message, 'success');
      this.detalleSolicitud.imagenUrl = response.NuevaImagenRuta;
      this.detalleSolicitud.estatus = response.NuevoEstatus;
      window.location.reload();
    },
    error: (error) => {
      Swal.fire('Error', error.error?.message || 'No se pudo actualizar la imagen.', 'error');
    },
  });
}
  // Ver detalle de solicitud
  verDetalleSolicitud(solicitudId: number): void {
    this.solicitudId = solicitudId;
    this.conflictoService.obtenerDetalleSolicitud(solicitudId).subscribe(
      (response: any) => {
        this.detalleSolicitud = response; // Guardar detalle de la solicitud
        this.detallesSeleccionados = response.conflictoDetalles.map((detalle: any) => ({
          fechaConflicto: detalle.fechaConflicto,
          seleccionado: false,
        }));

        // Llamar al endpoint para obtener la URL de la imagen
        this.obtenerImagenUrl(solicitudId, response.cedula);

        this.mostrarDetalle = true; // Mostrar la vista de detalle
        this.mostrarFormulario = false; // Ocultar el formulario de nueva solicitud
        this.obtenerDiasHabilitados(); // Obtener los días habilitados para deshabilitar
      },
      (error) => {
        Swal.fire('Error', 'No se pudo obtener el detalle de la solicitud.', 'error');
      }
    );
  }

    // Método para obtener la URL de la imagen
  obtenerImagenUrl(permissionId: number, cedula: string): void {
    this.conflictoService.obtenerImagenUrlPermission(permissionId, cedula).subscribe(
      (response: any) => {
        console.log(response);
        this.detalleSolicitud.imagenUrl = response.imageUrl; // Asignar la URL de la imagen
      },
      (error) => {
        Swal.fire('Error', 'No se pudo obtener la URL de la imagen asociada.', 'error');
        this.detalleSolicitud.imagenUrl = null; // Asegurarse de que no haya datos incorrectos
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
        if (response.diasSemana) {
          const diasTraducidos: { [key: string]: string } = {
            Sunday: 'Domingo',
            Monday: 'Lunes',
            Tuesday: 'Martes',
            Wednesday: 'Miércoles',
            Thursday: 'Jueves',
            Friday: 'Viernes',
            Saturday: 'Sábado'
          };

          this.diasHabilitados = response.diasSemana.map((dia: any) => ({
            nombre: diasTraducidos[dia.nombre] || dia.nombre, // Traduce el nombre si existe
            valor: dia.dia // Conserva el valor del día
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
      file: null as File | null,
      diasSeleccionados: [],
    };

    this.diasDisponibles = [];
    this.previewUrl = null;
    this.pasoActual = 1; // Volver al paso inicial
  }

}
