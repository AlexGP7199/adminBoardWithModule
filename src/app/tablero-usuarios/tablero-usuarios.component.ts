import { Component } from '@angular/core';
import { UsuarioService } from './services/usuario.service';
import Swal from 'sweetalert2';
import { DayOfWeek } from './enumInterfaces.ts/enumInt';
import { AuthService } from '../services/auth.service';

@Component({
  selector: 'app-tablero-usuarios',
  templateUrl: './tablero-usuarios.component.html',
  styleUrl: './tablero-usuarios.component.css'
})
export class TableroUsuariosComponent {
  regiones: any[] = [];
  provinciasFiltradas: any[] = [];
  equipos: any[] = [];
  usuariosFiltrados: any[] = [];
  searchCedula: string = '';
  searchNombre: string = '';
  nivelUsuario: number = 0;

  mostrarErrorImagen: boolean = false;


  selectedRegion: number | null = null;
  selectedProvincia: number | null = null;
  selectedTeam: number | null = null;
  imagenSeleccionada!: File;
  mostrarFormulario = false;
  usuarioSeleccionado: any = null;
  validarFechasEstudioRequest = {
    usuarioId: 0,
    inicioEstudios: '',
    finEstudios: '',
    diasEstudio: [] as DayOfWeek[],
    motivo: ''
  };

  diasSemana = [
    { label: 'Lunes', value: DayOfWeek.Monday },
    { label: 'Martes', value: DayOfWeek.Tuesday },
    { label: 'Miércoles', value: DayOfWeek.Wednesday },
    { label: 'Jueves', value: DayOfWeek.Thursday },
    { label: 'Viernes', value: DayOfWeek.Friday },
    { label: 'Sábado', value: DayOfWeek.Saturday },
    { label: 'Domingo', value: DayOfWeek.Sunday }
  ];

  imagenUrl: string | ArrayBuffer | null = null;
  today: string = new Date().toISOString().split('T')[0];
  userData: any = {};

  constructor(private usuarioService: UsuarioService, private authService : AuthService) {}

  ngOnInit(): void {
    const decodedToken = this.authService.getDecodedToken();
    if (decodedToken) {
      this.nivelUsuario = parseInt(decodedToken.nivel, 10) || 0;
      this.selectedRegion = parseInt(decodedToken.regionId, 10);
      this.selectedProvincia = parseInt(decodedToken.provinciaId, 10);
      this.selectedTeam = parseInt(decodedToken.teamId, 10);

      if (this.nivelUsuario === 1) {
        this.cargarEquipos();
        this.filtrarUsuarios();
      } else if (this.nivelUsuario === 2) {
        this.cargarProvincias(this.selectedRegion); // Cargar provincias para la región específica
        this.cargarEquipos();
        this.filtrarUsuarios();
      } else if (this.nivelUsuario === 3) {
        this.cargarRegiones();
        this.cargarProvincias(this.selectedRegion); // Cargar provincias de la región inicial
        this.cargarEquipos();
        this.filtrarUsuarios();
      }
    } else {
      Swal.fire('Error', 'No se pudo obtener la información del usuario. Por favor, inicie sesión nuevamente.', 'error');
    }
    //this.userData = this.obtenerDatosLocalStorage();
    //this.nivelUsuario = parseInt(this.userData.nivel, 10) || 0;

    /*
    if (this.nivelUsuario === 1) {
      // Nivel 1: Valores de filtros fijos desde el localStorage
      this.selectedRegion = +this.userData.regionId;
      this.selectedProvincia = +this.userData.provinciaId;
      this.selectedTeam = +this.userData.teamId;
      this.cargarEquipos();  // Cargar equipo
      this.filtrarUsuarios(); // Filtra con los valores del usuario

    } else if (this.nivelUsuario === 2) {
      // Nivel 2: Permitir cambiar solo la provincia
      this.selectedRegion = +this.userData.regionId;
      this.selectedProvincia = +this.userData.provinciaId;
      this.selectedTeam = +this.userData.teamId;
      this.cargarProvincias(this.selectedRegion); // Cargar provincias para la región específica
      this.cargarEquipos();  // Cargar Equipo
      this.filtrarUsuarios(); // Filtra con la región y provincia iniciales

    } else if (this.nivelUsuario === 3) {
      // Nivel 3: Permitir cambiar región y provincia
      this.selectedRegion = +this.userData.regionId;
      this.selectedProvincia = +this.userData.provinciaId;
      this.selectedTeam = +this.userData.teamId;
      this.cargarRegiones(); // Cargar todas las regiones
      this.cargarProvincias(this.selectedRegion); // Cargar provincias de la región inicial
      this.cargarEquipos();  // Cargar opciones de equipos
      this.filtrarUsuarios(); // Filtra con los valores iniciales
    } */
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

  abrirFormulario(usuario: any): void {
    this.mostrarFormulario = true;
    this.usuarioSeleccionado = usuario;
    this.validarFechasEstudioRequest.usuarioId = usuario.userId;
  }

  cerrarFormulario(): void {
    this.mostrarFormulario = false;
    this.usuarioSeleccionado = null;
    this.validarFechasEstudioRequest = {
      usuarioId: 0,
      inicioEstudios: '',
      finEstudios: '',
      diasEstudio: [] as DayOfWeek[],
      motivo: ''
    };
  }

  onDiaEstudioChange(event: any): void {
    const dia = +event.target.value;
    if (event.target.checked) {
      if (!this.validarFechasEstudioRequest.diasEstudio.includes(dia)) {
        this.validarFechasEstudioRequest.diasEstudio.push(dia);
      }
    } else {
      this.validarFechasEstudioRequest.diasEstudio = this.validarFechasEstudioRequest.diasEstudio.filter(d => d !== dia);
    }
  }

  onImageSelected(event: Event): void {
    const file = (event.target as HTMLInputElement).files?.[0];
    if (file) {
      this.imagenSeleccionada = file; // Guardar el archivo seleccionado
      const reader = new FileReader();
      reader.onload = () => {
        this.imagenUrl = reader.result; // Mostrar previsualización
      };
      reader.readAsDataURL(file);
    }
  }

  onInicioEstudiosChange(): void {
    const inicioDate = new Date(this.validarFechasEstudioRequest.inicioEstudios);
    const maxEndDate = new Date(inicioDate);
    maxEndDate.setFullYear(inicioDate.getFullYear() + 1);

    if (this.validarFechasEstudioRequest.finEstudios) {
      const finDate = new Date(this.validarFechasEstudioRequest.finEstudios);
      if (finDate < inicioDate || finDate > maxEndDate) {
        this.validarFechasEstudioRequest.finEstudios = '';
        Swal.fire('Advertencia', 'La fecha de fin debe estar entre la fecha de inicio y un año después.', 'warning');
      }
    }
  }

  onFinEstudiosChange(): void {
    const inicioDate = new Date(this.validarFechasEstudioRequest.inicioEstudios);
    const finDate = new Date(this.validarFechasEstudioRequest.finEstudios);
    const maxEndDate = new Date(inicioDate);
    maxEndDate.setFullYear(inicioDate.getFullYear() + 1);

    if (finDate < inicioDate) {
      Swal.fire('Advertencia', 'La fecha de fin no puede ser anterior a la fecha de inicio.', 'warning');
      this.validarFechasEstudioRequest.finEstudios = '';
    } else if (finDate > maxEndDate) {
      Swal.fire('Advertencia', 'La fecha de fin no puede ser más de un año después de la fecha de inicio.', 'warning');
      this.validarFechasEstudioRequest.finEstudios = '';
    }
  }

  enviarFormulario(): void {

    if (!this.imagenSeleccionada) {
      this.mostrarErrorImagen = true;
      Swal.fire('Error', 'Debe cargar una imagen antes de enviar el formulario.', 'error');
      return; // Detener el flujo si no hay imagen
    }


    this.mostrarErrorImagen = false; // Ocultar el error si la imagen está presente
    this.usuarioService.validarFechasEstudio(this.validarFechasEstudioRequest).subscribe(
      (response) => {
        Swal.fire('Éxito', response.mensaje, 'success');
         // Obtener el ID del conflicto desde la respuesta
      //console.log('Respuesta del server');
      //console.log(response);
      const conflictoId = response.conflictoId;
      //console.log('Aqui el id dle conflico o algo')
      //console.log(conflictoId);
      if (conflictoId && this.imagenSeleccionada) {
        // Si hay un archivo seleccionado, subirlo
        this.subirImagen(conflictoId);
      } else {
        // Si no hay imagen, cerrar el formulario
        this.cerrarFormulario();
      }
      },
      (error) => {
        // Manejo de errores específicos según el mensaje devuelto por el backend
         // Manejo de errores en la creación del conflicto
      this.manejarError(error);
      }
    );
  }

  subirImagen(conflictoId: number): void {
    // Subir la imagen al backend
    this.usuarioService.subirImagen(conflictoId, this.imagenSeleccionada).subscribe(
      () => {
        Swal.fire('Éxito', 'Imagen cargada exitosamente.', 'success');
        this.cerrarFormulario();
      },
      (error) => {
        // Manejo de errores en la carga de la imagen
        Swal.fire('Error', 'No se pudo cargar la imagen. Por favor, inténtelo más tarde.', 'error');
      }
    );
  }

  manejarError(error: any): void {
    if (error.error) {
      if (typeof error.error === 'string') {
        Swal.fire('Error', error.error, 'error');
      } else if (error.error.Message) {
        Swal.fire('Error', error.error.Message, 'error');
      } else {
        Swal.fire('Error', 'Ocurrió un error inesperado al validar las fechas de estudio.', 'error');
      }
    } else {
      Swal.fire('Error', 'No se pudo procesar la solicitud. Por favor, inténtelo más tarde.', 'error');
    }
  }

  cargarRegiones(): void {
    this.usuarioService.obtenerRegiones().subscribe(
      (regiones) => (this.regiones = regiones),
      (error) => console.error('Error al cargar regiones:', error)
    );
  }

  cargarProvincias(regionId: number): void {
    if (regionId) {
      this.usuarioService.obtenerProvincias(regionId).subscribe(
        (provincias) => (this.provinciasFiltradas = provincias),
        (error) => {
          console.error('Error al cargar provincias:', error);
          Swal.fire('Error', 'No se encontraron provincias para la región seleccionada.', 'error');
        }
      );
    }
  }

  cargarEquipos(): void {
    this.usuarioService.obtenerEquipos().subscribe(
      (equipos) => (this.equipos = equipos),
      (error) => console.error('Error al cargar equipos:', error)
    );
  }

  onRegionChange(): void {
    if (this.selectedRegion) {
      this.cargarProvincias(this.selectedRegion);
    } else {
      this.provinciasFiltradas = [];
    }
    this.selectedProvincia = null;
    this.filtrarUsuarios();
  }

  onProvinciaChange(): void {
    this.filtrarUsuarios();
  }

  onTeamChange(): void {
    this.selectedTeam = Number(this.selectedTeam);
    this.filtrarUsuarios();
  }

  filtrarUsuarios(): void {
    this.usuarioService.listarUsuariosFiltrados(
      this.selectedRegion ?? undefined,
      this.selectedProvincia ?? undefined,
      this.selectedTeam ?? undefined,
      this.nivelUsuario
    ).subscribe(
      (usuarios) =>{(this.usuariosFiltrados = usuarios);
      //console.log()
    },
      (error) => console.error('Error al filtrar usuarios:', error)
    );
  }
}
