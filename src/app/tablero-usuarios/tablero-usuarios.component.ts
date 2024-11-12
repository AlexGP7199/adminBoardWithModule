import { Component } from '@angular/core';
import { UsuarioService } from './services/usuario.service';
import Swal from 'sweetalert2';
import { DayOfWeek } from './enumInterfaces.ts/enumInt';

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

  selectedRegion: number | null = null;
  selectedProvincia: number | null = null;
  selectedTeam: number | null = null;

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

  constructor(private usuarioService: UsuarioService) {}

  ngOnInit(): void {
    this.userData = this.obtenerDatosLocalStorage();
    this.nivelUsuario = parseInt(this.userData.nivel, 10) || 0;

    if (this.nivelUsuario === 1) {
      // Nivel 1: Valores de filtros fijos desde el localStorage
      this.selectedRegion = +this.userData.regionId;
      this.selectedProvincia = +this.userData.provinciaId;
      this.selectedTeam = +this.userData.teamId;

      this.filtrarUsuarios(); // Filtra con los valores del usuario

    } else if (this.nivelUsuario === 2) {
      // Nivel 2: Permitir cambiar solo la provincia
      this.selectedRegion = +this.userData.regionId;
      this.selectedProvincia = +this.userData.provinciaId;
      this.selectedTeam = +this.userData.teamId;
      this.cargarProvincias(this.selectedRegion); // Cargar provincias para la región específica
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
      const reader = new FileReader();
      reader.onload = () => {
        this.imagenUrl = reader.result;
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
    this.usuarioService.validarFechasEstudio(this.validarFechasEstudioRequest).subscribe(
      (response) => {
        Swal.fire('Éxito', response.mensaje, 'success');
        this.cerrarFormulario();
      },
      (error) => {
        Swal.fire('Error', 'Ocurrió un error al validar las fechas de estudio.', 'error');
      }
    );
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
    this.filtrarUsuarios();
  }

  filtrarUsuarios(): void {
    this.usuarioService.listarUsuariosFiltrados(
      this.selectedRegion ?? undefined,
      this.selectedProvincia ?? undefined,
      this.selectedTeam ?? undefined,
      this.nivelUsuario
    ).subscribe(
      (usuarios) => (this.usuariosFiltrados = usuarios),
      (error) => console.error('Error al filtrar usuarios:', error)
    );
  }
}
