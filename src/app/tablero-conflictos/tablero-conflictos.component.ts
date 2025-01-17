import { Component, OnInit } from '@angular/core';
import { ConflictoService } from './services/conflicto.service';
import { Conflicto, ConflictosAgrupadosResponse, Provincia, Team, TipoAmbulancia } from './interfaces/conflictosInterfaces';
import Swal from 'sweetalert2';
import { UsuarioService } from '../tablero-usuarios/services/usuario.service';
import { AuthService } from '../services/auth.service';
import { initFlowbite } from 'flowbite';

@Component({
  selector: 'app-tablero-conflictos',
  templateUrl: './tablero-conflictos.component.html',
  styleUrl: './tablero-conflictos.component.css'
})
export class TableroConflictosComponent implements OnInit {
  mostrarDetalleSolicitud = false; // Para manejar exclusivamente el detalle de solicitudes
  detalleSolicitud: any = null; // Para manejar exclusivamente el detalle de la solicitud
  nuevoEstatus: string = ''; // Valor inicial del estatus
  searchNombre: string = '';
  searchFecha: string = '';
  conflictos: Conflicto[] = [];
  conflictosAgrupados: (TipoAmbulancia | Provincia)[] = [];
  detalleUsuario: any = null;
  mostrarDetalle = false;
  startDate: string;
  endDate: string;
  estatus = 'Aprobado';
  estatusList = ['Pendiente', 'En Proceso', 'Aprobado', 'Rechazado'];
  primeraCarga = true;
  imageUrlAbal = '';
  solicitudPermisoId : number = 0;
  // Nuevas propiedades
  nivelUsuario: number = 0;
  regiones: any[] = [];
  provinciasFiltradas: any[] = [];
  equipos: any[] = [];
  selectedRegion: number | null = null;
  selectedProvincia: number | null = null;
  selectedTeam: number | null = null;
  userData: any = {};

  mostrarModal = false; // Controla si el modal está visible
  notaCambio: string = ''; // Almacena la nota ingresada

  constructor(private conflictosService: ConflictoService, private  usuarioService: UsuarioService, private authService : AuthService) {
    const today = new Date();
    this.startDate = this.formatDate(today);
    this.endDate = this.formatDate(new Date(today.setDate(today.getDate() + 14)));
  }

  onTeamChange(): void {
    // Llamar a obtenerConflictos() para filtrar la tabla según el equipo seleccionado
    //if(this.nivelUsuario <= 1){
    //  this.obtenerConflictos();
   // }else{
      this.obtenerConflictosAgrupados();
    //}

  }

  abrirModal(): void {
    this.mostrarModal = true; // Muestra el modal
  }

  cerrarModal(): void {
    this.mostrarModal = false; // Oculta el modal
    this.notaCambio = ''; // Limpia la nota al cerrar
  }

  abrirModalSiEsNecesario(nuevoEstatus: string): void {
    if (nuevoEstatus === 'Aprobado' || nuevoEstatus === 'Rechazado') {
      this.mostrarModal = true;
    } else {
      this.cambiarEstatus(this.detalleUsuario.conflictoId, nuevoEstatus);
    }
  }


// Llama al servicio para actualizar la nota
guardarNotaYCambiarEstatus(): void {
  //console.log('Nota normal');
  //console.log(this.notaCambio);
  if (!this.notaCambio.trim()) {
    Swal.fire('Error', 'Debes incluir una nota o comentario.', 'error');
    return;
  }

  const notaEscapada = this.notaCambio.replace(/\n/g, '\\n');
  //console.log('nota escapada')
  //console.log(notaEscapada);
  this.usuarioService.actualizarNota(this.detalleUsuario.conflictoId, notaEscapada).subscribe({
    next: (response: any) => {
      //console.log(`Nota actualizada: ${response.Nota}`); // Muestra la respuesta en consola
      this.cambiarEstatus(this.detalleUsuario.conflictoId, this.detalleUsuario.estatus); // Cambia el estatus después de actualizar la nota
      Swal.fire('Éxito', 'Nota agregada y estatus actualizado con éxito.', 'success');
      this.cerrarModal(); // Cierra el modal
    },
    error: (error) => {
      //console.error('Error al actualizar la nota:', error);
      Swal.fire('Error', 'No se pudo actualizar la nota. Inténtalo de nuevo más tarde.', 'error');
    },
  });
}




  ngOnInit(): void {
    initFlowbite();
    //this.userData = this.obtenerDatosLocalStorage();
    this.userData = this.authService.getDecodedToken();
    //console.log(this.userData);
    this.nivelUsuario = parseInt(this.userData.nivel, 10) || 0;
    //console.log('klk');
    //console.log(this.nivelUsuario);
    if (this.nivelUsuario === 1) {
        // Nivel 1: Cargar conflictos solo de la región, provincia y equipo asignados
        this.selectedRegion = this.userData.regionId;
        this.selectedProvincia = this.userData.provinciaId;
        this.selectedTeam = this.userData.teamId;
        this.cargarEquipos();
        //this.obtenerConflictos();
        this.obtenerConflictosAgrupados();
    } else if (this.nivelUsuario === 2) {
        // Nivel 2: Permitir cambio de provincia y cargar provincias para la región inicial
        this.selectedRegion = this.userData.regionId;
        this.cargarProvincias(this.selectedRegion!); // Cargar provincias con la región inicial
        this.selectedProvincia = this.userData.provinciaId;
        this.selectedTeam = this.userData.teamId;
        this.cargarEquipos();
        //this.obtenerConflictos();
        this.obtenerConflictosAgrupados(); // Llama a esta función si es nivel 2
    } else if (this.nivelUsuario === 3) {
        // Nivel 3: Cargar todas las opciones de región, provincia y equipo
        this.cargarRegiones();
        this.cargarEquipos(); // Cargar equipo
        this.selectedRegion = this.userData.regionId;

        // Cargar provincias si la región está definida
        if (this.selectedRegion) {
            this.cargarProvincias(this.selectedRegion);
        }

        this.selectedProvincia = this.userData.provinciaId;
        this.selectedTeam = this.userData.teamId;
        //this.obtenerConflictos();
        this.obtenerConflictosAgrupados(); // Llama a esta función si es nivel 2
    }
    else if (this.nivelUsuario >=4) {
      // Nivel 3: Cargar todas las opciones de región, provincia y equipo
      this.cargarRegiones();
      this.cargarEquipos(); // Cargar equipo
      this.selectedRegion = this.userData.regionId;

      // Cargar provincias si la región está definida
      if (this.selectedRegion) {
          this.cargarProvincias(this.selectedRegion);
      }

      this.selectedProvincia = this.userData.provinciaId;
      this.selectedTeam = this.userData.teamId;
      //this.obtenerConflictos();
      this.obtenerConflictosAgrupados(); // Llama a esta función si es nivel 2
  }
}

/*
filtrarEstatus(estatusList: string[]): string[] {
  if (this.nivelUsuario === 5) {
    // Nivel 5 admin: Puede realizar cualquier acción (mostrar todos los estatus)
    return estatusList;
  } else if (this.nivelUsuario === 6) {
    // Nivel 6: Solo puede Aprobar o Rechazar Focal RRHH
    return estatusList.filter((estatus) => estatus === 'Aprobado' || estatus === 'Rechazado');
  } else {
    // Otros niveles (excepto 5 y 6): Solo pueden Pendiente o En Proceso
    return estatusList.filter((estatus) => estatus === 'Pendiente' || estatus === 'En Proceso');
  }
} */

  filtrarEstatus(): string[] {
    return this.estatusList; // Siempre mostrar todos los estatus
  }



  obtenerConflictosAgrupados(): void {
    if (!this.validarFechas()) return;

    const params = {
      regionId: this.selectedRegion ?? undefined,
      provinciaId: this.selectedProvincia ?? undefined,
      estatus: this.estatus ?? undefined,
      startDate: this.startDate ?? undefined,
      endDate: this.endDate ?? undefined,
      nivel: this.nivelUsuario ?? undefined,
    };

    this.conflictosService.filtrarConflictosAgrupados(params).subscribe(
      (response: TipoAmbulancia[]) => {
        this.conflictosAgrupados = []; // Limpiar la lista antes de procesar

        if (Array.isArray(response) && response.length > 0) {
          if (params.provinciaId === undefined) {
            // Agrupar por Provincia
            const conflictosPorProvincia: Record<string, Provincia> = {};

            response.forEach((tipoAmbulancia) => {
              tipoAmbulancia.teams.forEach((team) => {
                team.conflictos.forEach((conflicto) => {
                  const provinciaNombre = conflicto.provincia;

                  if (!conflictosPorProvincia[provinciaNombre]) {
                    conflictosPorProvincia[provinciaNombre] = {
                      provinciaNombre,
                      tiposAmbulancia: [],
                      expanded: false,
                    };
                  }

                  const provincia = conflictosPorProvincia[provinciaNombre];

                  let tipoAmbulanciaGroup = provincia.tiposAmbulancia.find(
                    (tipo) => tipo.tipoAmbulanciaId === tipoAmbulancia.tipoAmbulanciaId
                  );

                  if (!tipoAmbulanciaGroup) {
                    tipoAmbulanciaGroup = {
                      tipoAmbulanciaId: tipoAmbulancia.tipoAmbulanciaId,
                      tipoAmbulanciaNombre: tipoAmbulancia.tipoAmbulanciaNombre,
                      teams: [],
                      expanded: false,
                    };
                    provincia.tiposAmbulancia.push(tipoAmbulanciaGroup);
                  }

                  let teamGroup = tipoAmbulanciaGroup.teams.find(
                    (t) => t.teamId === team.teamId
                  );

                  if (!teamGroup) {
                    teamGroup = {
                      teamId: team.teamId,
                      teamNombre: team.teamNombre,
                      conflictos: [],
                      expanded: false,
                    };
                    tipoAmbulanciaGroup.teams.push(teamGroup);
                  }

                  teamGroup.conflictos.push(conflicto);
                });
              });
            });

            // Convertir el objeto agrupado en un array
            this.conflictosAgrupados = Object.values(conflictosPorProvincia);
          } else {
            // Agrupamiento original
            this.conflictosAgrupados = response.map((tipoAmbulancia) => ({
              ...tipoAmbulancia,
              expanded: false,
              teams: tipoAmbulancia.teams.map((team) => ({
                ...team,
                expanded: false,
              })),
            }));
          }
        } else {
          Swal.fire('Sin resultados', 'No se encontraron conflictos agrupados.', 'info');
        }
      },
      (error) => {
        console.error('Error al obtener conflictos agrupados:', error);
        this.conflictosAgrupados = [];
        Swal.fire('Error', 'Ocurrió un error al obtener los conflictos agrupados.', 'error');
      }
    );
  }




  alternarExpandir(item: TipoAmbulancia | Provincia): void {
    if (this.isProvincia(item)) {
      item.expanded = !item.expanded;
    } else {
      item.expanded = !item.expanded;
    }
  }

  alternarExpandirEquipo(team: Team): void {
    team.expanded = !team.expanded;
  }


  obtenerDatosLocalStorage(): any {
    const userData: any = {};
    for (let i = 0; i < sessionStorage.length; i++) {
      const key = sessionStorage.key(i);
      if (key) {
        userData[key] = sessionStorage.getItem(key);
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
    ////console.log(this.validarFechas());
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
              nuevoEstatus: conflicto.estatus, // Añadir propiedad para nuevo estatus
              teamName: teamId ? this.obtenerNombreEquipo(teamId) : 'Sin Equipo', // Añadimos el nombre del equipo
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

  obtenerNombreEquipo(teamId: number): string {
    const equipo = this.equipos.find((equipo) => equipo.teamId === teamId);
    return equipo ? equipo.teamNombre : 'Desconocido';
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


  verDetalleSolicitud(solicitudId: number): void {
    //console.log('a mostrar el aval');
    this.solicitudPermisoId = solicitudId;
    this.conflictosService.obtenerDetalleSolicitudInforme(solicitudId).subscribe({
      next: (response: any) => {
        console.log('Detalle de la solicitud:', response.estatus);

        this.detalleSolicitud = {
          usuarioNombre: response.nombreUsuario,
          cedula: response.cedula,
          provincia: response.provincia,
          teamName: response.teamNombre,
          descripcionPersonal: response.descripcionPersonal,
          descripcionSupervisor: response.descripcionSupervisor,
          fechaInicio: response.fechaInicio,
          fechaFin: response.fechaFin,
          estatus: response.estado,
          estadoSolicitud: response.estatus,
          detalles: response.conflictoDetalles.map((detalle: any) => ({
            fechaConflicto: detalle.fechaConflicto,
            motivo: detalle.motivo,
            detallesAdicionales: detalle.detallesAdicionales,
          })),
          imagenUrl: null, // Placeholder para la URL de la imagen
        };

        // Asignar el estatus inicial desde el endpoint
        // Asignar el valor inicial al dropdown
      this.nuevoEstatus = response.estatus || response.estadoSolicitud;
        // Llamar al endpoint para obtener la URL de la imagen
        this.obtenerImagenUrl(solicitudId, response.cedula);

        this.mostrarDetalleSolicitud = true; // Activa la vista del detalle de la solicitud
      },
      error: (error) => {
        console.error('Error al obtener el detalle de la solicitud:', error);
        Swal.fire('Error', 'No se pudo obtener el detalle de la solicitud.', 'error');
      },
    });
  }

  cambiarEstatusSolicitud(): void {
    const estatusValido = ['Aprobado', 'Rechazado'];

    // Validar que no se intente enviar "Pendiente" como cambio
    if (this.nuevoEstatus === 'Pendiente') {
      Swal.fire('Error', 'No puedes cambiar el estatus a "Pendiente".', 'error');
      return;
    }

    if (!estatusValido.includes(this.nuevoEstatus)) {
      Swal.fire('Error', 'Debes seleccionar un estatus válido antes de proceder.', 'error');
      return;
    }

    // Solicitar el comentario del supervisor
    Swal.fire({
      title: 'Comentario del Supervisor',
      input: 'textarea',
      inputLabel: 'Escribe un comentario o nota para este cambio de estatus:',
      inputPlaceholder: 'Escribe tu comentario aquí...',
      inputAttributes: {
        'aria-label': 'Escribe tu comentario aquí'
      },
      showCancelButton: true,
      confirmButtonText: 'Enviar',
      cancelButtonText: 'Cancelar',
      preConfirm: (nota) => {
        if (!nota || nota.trim() === '') {
          Swal.showValidationMessage('Debes escribir un comentario.');
        }
        return nota.trim();
      }
    }).then((result) => {
      if (result.isConfirmed && result.value) {
        const payload = {
          Estatus: this.nuevoEstatus,
          DescripcionSupervisor: result.value // Comentario ingresado
        };

        // Llamada al servicio para actualizar el estatus y la descripción
        this.conflictosService.actualizarEstatusSolicitud(this.solicitudPermisoId, payload).subscribe(
          (response: any) => {
            Swal.fire('Éxito', `El estatus ha sido cambiado a: ${this.nuevoEstatus}.`, 'success');
            this.detalleSolicitud.estatus = this.nuevoEstatus; // Actualizar en la UI
            this.detalleSolicitud.descripcionSupervisor = payload.DescripcionSupervisor; // Actualizar la descripción en la UI
          },
          (error) => {
            console.error('Error al actualizar el estatus:', error);
            Swal.fire('Error', error.error || 'No se pudo actualizar el estatus. Inténtalo de nuevo.', 'error');
          }
        );
      }
    });
  }




  // Método para obtener la URL de la imagen
  obtenerImagenUrl(permissionId: number, cedula: string): void {
    this.conflictosService.obtenerImagenUrlPermission(permissionId, cedula).subscribe(
      (response: any) => {
        if (this.detalleSolicitud) {
          this.detalleSolicitud.imagenUrl = response.imageUrl; // Asignar la URL de la imagen
        }
      },
      (error) => {
        console.error('Error al obtener la URL de la imagen:', error);
        if (this.detalleSolicitud) {
          this.detalleSolicitud.imagenUrl = null; // Si hay error, asegurar que la URL sea null
        }
      }
    );
  }


  abrirImagenEnNuevaPestana(url: string): void {
    if (url) {
      window.open(url, '_blank');
    } else {
      Swal.fire('Error', 'No se encontró una URL válida para la imagen.', 'error');
    }
  }


  verDetalle(conflicto: any,teamName: string): void {
    //console.log("Nombre del Team");
    //console.log(teamName);


    this.detalleUsuario = {
      ...conflicto,
      teamName, // Añadimos el nombre del equipo al detalle del usuario
      estatusInicial: conflicto.estatus,
    };
    console.log('Data ');
    console.log(this.detalleUsuario);
    //console.log(this.detalleUsuario.teamName);
    /*
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
    ); */
  //console.log('Datos del conflicto');
  //console.log(conflicto);
  //this.detalleUsuario = conflicto; // Asigna directamente el detalle del usuario seleccionado
  this.mostrarDetalle = true; // Muestra el detalle
  //console.log(this.detalleUsuario)
  //console.log('hello v1');
  //console.log(conflicto.conflictoId);
  // Obtener detalles del conflicto asociado
  this.conflictosService.obtenerDetalleConflictoAsociado(conflicto.conflictoId).subscribe(
    (response: any) => {
      //console.log(response);
      this.detalleUsuario.detalles = response.detalles || []; // Asigna los detalles al usuario
      this.detalleUsuario.conflictoEstado = response.conflictoEstado;
      this.detalleUsuario.fechaGeneracion = response.fechaGeneracion;
    },
    (error) => {
      //console.error('Error al obtener detalles del conflicto asociado:', error);
      Swal.fire('Error', 'No se pudieron cargar los detalles del conflicto.', 'error');
    }
  );
   // Obtener la URL de la imagen desde el backend
   this.conflictosService.obtenerImagenUrl(conflicto.conflictoId, conflicto.cedula).subscribe(
    (response: any) => {

      this.imageUrlAbal = response.imageUrl;
      this.detalleUsuario.imagenUrl = response.ImageUrl;
    },
    (error) => {
      //console.error('Error al obtener la URL de la imagen:', error);
      Swal.fire('Error', 'No se pudo obtener la URL de la imagen.', 'error');
    }
  );
  }

  volverATabla(): void {
    this.mostrarDetalle = false;
    this.mostrarDetalleSolicitud = false; // Oculta el detalle de la solicitud
    this.detalleUsuario = null; // Limpiar detalles
  }

  volverATabla2(): void {
    //this.mostrarDetalle = false;
    this.mostrarDetalleSolicitud = false; // Oculta el detalle de la solicitud
    this.detalleSolicitud = null;
    //this.detalleUsuario = null; // Limpiar detalles
  }

  onEstatusChange(event: any): void {
    this.estatus = event.target.value;
    //if(this.nivelUsuario <= 1){
      //this.obtenerConflictos();
   // }else{
      this.obtenerConflictosAgrupados();
    //}
  }

  onFechaChange(): void {
    //if(this.nivelUsuario <= 1){
    //  this.obtenerConflictos();
   // }else{
      this.obtenerConflictosAgrupados();
    //}
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
          //if(this.nivelUsuario <= 1){
            //this.obtenerConflictos();
          //}else{
            this.obtenerConflictosAgrupados();
            window.location.reload();
          //}
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
   // if(this.nivelUsuario <= 1){
     // this.obtenerConflictos();
  //  }else{
      this.obtenerConflictosAgrupados();
   // }
  }

  onProvinciaChange(): void {
    //if(this.nivelUsuario <= 1){
      //this.obtenerConflictos();
    //}else{
      this.obtenerConflictosAgrupados();
    //}
  }

  isProvincia(item: TipoAmbulancia | Provincia): item is Provincia {
    return (item as Provincia).provinciaNombre !== undefined;
  }

  isTipoAmbulancia(item: TipoAmbulancia | Provincia): item is TipoAmbulancia {
    return (item as TipoAmbulancia).tipoAmbulanciaId !== undefined;
  }

  alternarExpandirProvincia(provincia: Provincia): void {
    provincia.expanded = !provincia.expanded;
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
