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
  regionSeleccionada: number = 0; // Valor predeterminado para "sin selección"
  provinciaSeleccionada: number = 0; // Valor predeterminado para "sin selección"

  mostrarFormulario: boolean = false;
  ambulanciaEnEdicion: any | null = null; // Para distinguir entre crear y editar

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
      baseOperativa: ['', Validators.maxLength(200)],
      georeferencia: ['', Validators.maxLength(200)],
    });
  }

  ngOnInit(): void {
    this.cargarRegiones();
    this.cargarTiposAmbulancia();
    this.filtrarAmbulancias();
  }

  cargarRegiones(): void {
    this.usuarioService.obtenerRegiones().subscribe((regiones) => {
      this.regiones = regiones;
    });
  }

  cargarProvincias(regionId: number): void {
    this.usuarioService.obtenerProvinciasPorRegion(regionId).subscribe((provincias) => {
      this.provincias = provincias;
    });
  }

  cargarTiposAmbulancia(): void {
    this.ambulanciaService.obtenerTiposAmbulancia().subscribe((tipos) => {
      this.tiposAmbulancia = tipos;
    });
  }

  filtrarAmbulancias(): void {
    this.ambulanciaService
      .obtenerAmbulancias(this.regionSeleccionada, this.provinciaSeleccionada)
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
    this.ambulanciaEnEdicion = null; // Modo creación
    this.ambulanciaForm.reset();
  }

  cerrarFormulario(): void {
    this.mostrarFormulario = false;
    this.ambulanciaEnEdicion = null; // Resetear el estado de edición
    this.filtrarAmbulancias();
  }

  imprimirId(id: number): void {
    // Obtener los datos de la ambulancia por ID
    this.ambulanciaService.obtenerAmbulanciaPorId(id).subscribe({
      next: (ambulancia) => {
        //console.log(ambulancia.provincia.id);
        this.mostrarFormulario = true;
        this.ambulanciaEnEdicion = ambulancia; // Pasar al modo edición
        this.ambulanciaForm.patchValue({
          codigo: ambulancia.codigo,
          descripcion: ambulancia.descripcion,
          regionId: ambulancia.region.id,
          provinciaId: ambulancia.provincia.id,
          tipoId: ambulancia.tipo.id,
          baseOperativa: ambulancia.baseOperativa,
          georeferencia: ambulancia.georeferencia,
        });
        this.cargarProvincias(ambulancia.region.id); // Cargar provincias asociadas
      },
      error: () => {
        Swal.fire({
          title: 'Error',
          text: 'No se pudo cargar la ambulancia.',
          icon: 'error',
          confirmButtonText: 'Cerrar',
        });
      },
    });
  }

  guardarAmbulancia(): void {
    if (this.ambulanciaForm.valid) {
      if (this.ambulanciaEnEdicion) {
        // Modo edición
        this.ambulanciaService
          .editarAmbulancia(this.ambulanciaEnEdicion.id, this.ambulanciaForm.value)
          .subscribe({
            next: () => {
              Swal.fire({
                title: '¡Éxito!',
                text: 'Ambulancia actualizada con éxito.',
                icon: 'success',
                confirmButtonText: 'Ok',
              });
              this.cerrarFormulario();
            },
            error: () => {
              Swal.fire({
                title: 'Error',
                text: 'No se pudo actualizar la ambulancia.',
                icon: 'error',
                confirmButtonText: 'Cerrar',
              });
            },
          });
      } else {
        // Modo creación
        //console.log('Ambulancias form ' + JSON.stringify(this.ambulanciaForm.value));
        this.ambulanciaService.crearAmbulancia(this.ambulanciaForm.value).subscribe({
          next: () => {

            Swal.fire({
              title: '¡Éxito!',
              text: 'Ambulancia creada con éxito.',
              icon: 'success',
              confirmButtonText: 'Ok',
            });
            this.cerrarFormulario();
          },
          error: () => {
            Swal.fire({
              title: 'Error',
              text: 'No se pudo crear la ambulancia.',
              icon: 'error',
              confirmButtonText: 'Cerrar',
            });
          },
        });
      }
    } else {
      //console.log(this.ambulanciaForm.value);
      Swal.fire({
        title: 'Formulario incompleto',
        text: 'Por favor, complete todos los campos requeridos.',
        icon: 'warning',
        confirmButtonText: 'Entendido',
      });
    }
  }
}
