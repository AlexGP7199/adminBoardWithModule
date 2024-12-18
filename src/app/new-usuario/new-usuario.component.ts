import { Component, OnInit } from '@angular/core';
import { UsuariosModuleService } from './services/usuarios.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-new-usuario',
  templateUrl: './new-usuario.component.html',
  styleUrl: './new-usuario.component.css'
})
export class NewUsuarioComponent  implements OnInit {
  usuarioForm: FormGroup;
  usuarios: any[] = [];
  regiones: any[] = [];
  provincias: any[] = [];
  ambulancias: any[] = [];
  equipos: any[] = [];
  roles: any[] = [];
  cargos: any[] = [];
  mostrarFormulario = false; // Controla la visibilidad del formulario
  usuarioEnEdicion: any = null; // Usuario seleccionado para edición

  regionSeleccionada: number | null = null;
  provinciaSeleccionada: number | null = null;

  constructor(
    private usuarioService: UsuariosModuleService,
    private fb: FormBuilder
  ) {
    this.usuarioForm = this.fb.group({
      cedula: ['', [Validators.required, Validators.minLength(11), Validators.maxLength(11)]],
      nombre: ['', Validators.required],
      password: ['', Validators.required],
      regionId: ['', Validators.required],
      provinciaId: ['', Validators.required],
      ambulanciaId: [''],
      teamId: ['', Validators.required],
      userRoleId: ['', Validators.required],
      cargoId: ['', Validators.required],
    });
  }

  ngOnInit(): void {
    this.cargarRegiones();
    this.cargarEquiposRolesCargos();
    this.filtrarUsuarios(); // Carga inicial
  }

  filtrarUsuarios(): void {
    const regionId = this.regionSeleccionada || undefined;
    const provinciaId = this.provinciaSeleccionada || undefined;
    console.log(regionId);
    console.log(provinciaId);
    this.usuarioService.obtenerUsuarios(regionId, provinciaId).subscribe((response) => {
      console.log('Usuarios filtrados:', response.Usuarios);
      this.usuarios = response.Usuarios;
    });
  }

  cargarRegiones(): void {
    this.usuarioService.obtenerRegiones().subscribe((regiones) => {
      this.regiones = regiones;
    });
  }

  cargarProvincias(regionId: number): void {
    console.log('Cargar provincias de la region ' + regionId);
    this.usuarioService.obtenerProvinciasPorRegion(regionId).subscribe((provincias) => {
      this.provincias = provincias;
    });
  }

  cargarAmbulancias(regionId: number, provinciaId: number): void {
    this.usuarioService.obtenerAmbulancias(regionId, provinciaId).subscribe((ambulancias) => {
      this.ambulancias = ambulancias;
    });
  }

  cargarEquiposRolesCargos(): void {
    this.usuarioService.obtenerEquiposRolesCargos().subscribe((data) => {
      this.equipos = data.equipos;
      this.roles = data.roles;
      this.cargos = data.cargos;
    });
  }

  cargarUsuarios(): void {
    this.usuarioService.obtenerUsuarios().subscribe((usuarios) => {
      this.usuarios = usuarios;
    });
  }

  mostrarFormularioAgregar(): void {
    this.usuarioEnEdicion = null; // Limpia cualquier usuario en edición
    this.usuarioForm.reset(); // Reinicia el formulario
    this.mostrarFormulario = true; // Muestra el formulario
  }

  onRegionChange(): void {
    const regionId = this.usuarioForm.value.regionId;
    console.log('Hi')
    console.log(regionId);
    this.cargarProvincias(regionId);
    this.provincias = [];
    this.ambulancias = [];
  }

  onProvinciaChange(): void {
    const regionId = this.usuarioForm.value.regionId;
    const provinciaId = this.usuarioForm.value.provinciaId;
    this.cargarAmbulancias(regionId, provinciaId);
  }

  onFilterRegionChange(): void {
    if (this.regionSeleccionada) {
      console.log('Cambio detectado en el filtro de región:', this.regionSeleccionada);
      this.cargarProvincias(this.regionSeleccionada); // Actualiza las provincias según la región seleccionada
      this.provinciaSeleccionada = null; // Reinicia la provincia seleccionada
    }
    this.filtrarUsuarios(); // Actualiza la tabla de usuarios
  }

  onFilterProvinciaChange(): void {
    console.log('Cambio detectado en el filtro de provincia:', this.provinciaSeleccionada);
    this.filtrarUsuarios(); // Actualiza la tabla de usuarios
  }


  crearUsuario(): void {
    if (this.usuarioForm.valid) {
      this.usuarioService.crearUsuario(this.usuarioForm.value).subscribe({
        next: () => {
          Swal.fire({
            title: '¡Éxito!',
            text: 'Usuario creado con éxito.',
            icon: 'success',
            confirmButtonText: 'Ok',
          });
          this.usuarioForm.reset();
          this.mostrarFormulario = false; // Oculta el formulario
          this.cargarUsuarios(); // Recarga la tabla
        },
        error: (error) => {
          Swal.fire({
            title: 'Error',
            text: error.error || 'Ocurrió un problema al crear el usuario.',
            icon: 'error',
            confirmButtonText: 'Cerrar',
          });
        },
      });
    } else {
      Swal.fire({
        title: 'Formulario incompleto',
        text: 'Por favor, complete todos los campos requeridos.',
        icon: 'warning',
        confirmButtonText: 'Entendido',
      });
    }
  }

  editarUsuario(id: number): void {
    this.usuarioService.obtenerUsuarioPorId(id).subscribe((usuario) => {
      this.usuarioEnEdicion = usuario;
      this.usuarioForm.patchValue({
        cedula: usuario.cedula,
        nombre: usuario.nombre,
        password: usuario.password,
        regionId: usuario.regionId,
        provinciaId: usuario.provinciaId,
        ambulanciaId: usuario.ambulanciaId,
        teamId: usuario.teamId,
        userRoleId: usuario.userRoleId,
        cargoId: usuario.cargoId,
      });
      this.mostrarFormulario = true; // Muestra el formulario para edición
    });
  }
}
