import { Component, OnInit } from '@angular/core';
import { UsuariosModuleService } from './services/usuarios.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-new-usuario',
  templateUrl: './new-usuario.component.html',
  styleUrl: './new-usuario.component.css'
})
export class NewUsuarioComponent {
  usuarioForm: FormGroup;
  regiones: any[] = [];
  provincias: any[] = [];
  ambulancias: any[] = [];
  equipos: any[] = [];
  roles: any[] = [];
  cargos: any[] = [];

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
  }

  cargarRegiones(): void {
    this.usuarioService.obtenerRegiones().subscribe(regiones => {
      this.regiones = regiones;
    });
  }

  cargarProvincias(regionId: number): void {
    this.usuarioService.obtenerProvinciasPorRegion(regionId).subscribe(provincias => {
      this.provincias = provincias;
    });
  }

  cargarAmbulancias(regionId: number, provinciaId: number): void {
    this.usuarioService.obtenerAmbulancias(regionId, provinciaId).subscribe(ambulancias => {
      this.ambulancias = ambulancias;
    });
  }

  cargarEquiposRolesCargos(): void {
    this.usuarioService.obtenerEquiposRolesCargos().subscribe(data => {
      this.equipos = data.equipos;
      this.roles = data.roles;
      this.cargos = data.cargos;
    });
  }

  onRegionChange(): void {
    const regionId = this.usuarioForm.value.regionId;
    this.cargarProvincias(regionId);
    this.provincias = [];
    this.ambulancias = [];
  }

  onProvinciaChange(): void {
    const regionId = this.usuarioForm.value.regionId;
    const provinciaId = this.usuarioForm.value.provinciaId;
    this.cargarAmbulancias(regionId, provinciaId);
  }

  crearUsuario(): void {
    if (this.usuarioForm.valid) {
      this.usuarioService.crearUsuario(this.usuarioForm.value).subscribe({
        next: (response) => {
          Swal.fire({
            title: '¡Éxito!',
            text: 'Usuario creado con éxito.',
            icon: 'success',
            confirmButtonText: 'Ok',
          });
          this.usuarioForm.reset();
        },
        error: (error) => {
          Swal.fire({
            title: 'Error',
            text: error.error || 'Ocurrió un problema al crear el usuario.',
            icon: 'error',
            confirmButtonText: 'Cerrar',
          });
        }
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

}
