import { Component, OnInit } from '@angular/core';
import { UsuariosModuleService } from '../new-usuario/services/usuarios.service';
import { AmbulanciasService } from './services/ambulancias.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-new-ambulancia',
  templateUrl: './new-ambulancia.component.html',
  styleUrl: './new-ambulancia.component.css'
})
export class NewAmbulanciaComponent {
  ambulanciaForm: FormGroup;
  regiones: any[] = [];
  provincias: any[] = [];
  tiposAmbulancia: any[] = [];
  ambulancias: any[] = [];
  regionSeleccionada: number | undefined = undefined;
  provinciaSeleccionada: number | undefined = undefined;
  mostrarFormulario: boolean = false;

  constructor(
    private usuarioService: UsuariosModuleService,
    private ambulanciaService: AmbulanciasService,
    private fb: FormBuilder
  ) {
    this.ambulanciaForm = this.fb.group({
      codigo: ['', [Validators.required, Validators.maxLength(50)]],
      descripcion: ['', [Validators.required, Validators.maxLength(100)]],
      regionId: ['', Validators.required],
      provinciaId: ['', Validators.required],
      tipoId: ['', Validators.required],
      baseOperativa: ['', Validators.maxLength(100)],
      georeferencia: ['', Validators.maxLength(50)],
    });
  }

  ngOnInit(): void {
    this.cargarRegiones();
    this.cargarTiposAmbulancia();
    this.filtrarAmbulancias(); // Cargar datos iniciales en la tabla
  }

  cargarRegiones(): void {
    this.usuarioService.obtenerRegiones().subscribe((regiones) => {
      this.regiones = regiones;
    });
  }

  cargarProvincias(regionId: number): void {
    this.usuarioService
      .obtenerProvinciasPorRegion(regionId)
      .subscribe((provincias) => {
        this.provincias = provincias;
      });
  }

  cargarTiposAmbulancia(): void {
    this.ambulanciaService.obtenerTiposAmbulancia().subscribe((tipos) => {
      this.tiposAmbulancia = tipos;
    });
  }

  filtrarAmbulancias(): void {
    const regionId = this.regionSeleccionada ?? undefined;
    const provinciaId = this.provinciaSeleccionada ?? undefined;

    this.ambulanciaService
      .obtenerAmbulancias(regionId, provinciaId)
      .subscribe((ambulancias) => {
        this.ambulancias = ambulancias;
      });
  }

  onRegionChange(): void {
    const regionId = this.ambulanciaForm.value.regionId;
    this.cargarProvincias(regionId);
    this.provincias = [];
  }

  mostrarFormularioAgregar(): void {
    this.mostrarFormulario = true;
  }

  cerrarFormulario(): void {
    this.mostrarFormulario = false;
    this.filtrarAmbulancias(); // Recargar la tabla al cerrar el formulario
  }

  imprimirId(id: number): void {
    console.log('ID de la ambulancia seleccionada:', id);
  }

  crearAmbulancia(): void {
    if (this.ambulanciaForm.valid) {
      this.ambulanciaService.crearAmbulancia(this.ambulanciaForm.value).subscribe({
        next: () => {
          Swal.fire({
            title: '¡Éxito!',
            text: 'Ambulancia creada con éxito.',
            icon: 'success',
            confirmButtonText: 'Ok',
          });
          this.ambulanciaForm.reset();
          this.cerrarFormulario(); // Cerrar el formulario y recargar la tabla
        },
        error: (error) => {
          Swal.fire({
            title: 'Error',
            text: error.error || 'Ocurrió un problema al crear la ambulancia.',
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
}
