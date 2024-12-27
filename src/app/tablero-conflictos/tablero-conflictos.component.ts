import { Component, OnInit } from '@angular/core';
import { ConflictoService } from './services/conflicto.service';
import { Conflicto, ConflictosAgrupadosResponse, Team, TipoAmbulancia } from './interfaces/conflictosInterfaces';
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

  searchNombre: string = '';
  searchFecha: string = '';
  conflictos: Conflicto[] = [];
  conflictosAgrupados: TipoAmbulancia[] = []; // Usar la interfaz para tipar la variable
  detalleUsuario: any = null;
  mostrarDetalle = false;
  startDate: string;
  endDate: string;
  estatus = 'Aprobado';
  estatusList = ['Pendiente', 'En Proceso', 'Aprobado', 'Rechazado'];
  primeraCarga = true;
  imageUrlAbal = '';

  // Nuevas propiedades
  nivelUsuario: number = 0;
  regiones: any[] = [];
  provinciasFiltradas: any[] = [];
  equipos: any[] = [];
  selectedRegion: number | null = null;
  selectedProvincia: number | null = null;
  selectedTeam: number | null = null;
  userData: any = {};

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


  ngOnInit(): void {
    initFlowbite();
    //this.userData = this.obtenerDatosLocalStorage();
    this.userData = this.authService.getDecodedToken();
    //console.log(this.userData);
    this.nivelUsuario = parseInt(this.userData.nivel, 10) || 0;

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
      console.log('Datos recibidos del backend:', response);

      // Limpiar la lista antes de procesar la nueva respuesta
      this.conflictosAgrupados = [];

      if (Array.isArray(response) && response.length > 0) {
        this.conflictosAgrupados = response.map((tipoAmbulancia) => ({
          ...tipoAmbulancia,
          expanded: false, // Añade la propiedad 'expanded'
          teams: tipoAmbulancia.teams.map((team) => ({
            ...team,
            expanded: false, // Añade la propiedad 'expanded' a cada equipo
          })),
        }));
        //console.log('Datos procesados y guardados en conflictosAgrupados:', this.conflictosAgrupados);
      } else {
        Swal.fire('Sin resultados', 'No se encontraron conflictos agrupados.', 'info');
      }
    },
    (error) => {
      // Limpiar conflictos agrupados en caso de error también
      this.conflictosAgrupados = [];
      console.error('Error al obtener conflictos agrupados:', error);
      Swal.fire('Error', 'Ocurrió un error al obtener los conflictos agrupados.', 'error');
    }
  );
}



alternarExpandir(tipoAmbulancia: TipoAmbulancia): void {
  tipoAmbulancia.expanded = !tipoAmbulancia.expanded;
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
    this.conflictosService.obtenerDetalleSolicitud(solicitudId).subscribe({
      next: (response: any) => {
        //console.log('Detalle de la solicitud:', response);

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
          detalles: response.conflictoDetalles.map((detalle: any) => ({
            fechaConflicto: detalle.fechaConflicto,
            motivo: detalle.motivo,
            detallesAdicionales: detalle.detallesAdicionales,
          })),
        };

        this.mostrarDetalleSolicitud = true; // Activa la vista del detalle de la solicitud
      },
      error: (error) => {
        console.error('Error al obtener el detalle de la solicitud:', error);
        Swal.fire('Error', 'No se pudo obtener el detalle de la solicitud.', 'error');
      },
    });
  }



  verDetalle(conflicto: any,teamName: string): void {
    //console.log("Nombre del Team");
    //console.log(teamName);
    this.detalleUsuario = {
      ...conflicto,
      teamName // Añadimos el nombre del equipo al detalle del usuario
    };
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
