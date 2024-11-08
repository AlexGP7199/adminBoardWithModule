import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-solicitud-permisos-colaboradores',
  templateUrl: './solicitud-permisos-colaboradores.component.html',
  styleUrl: './solicitud-permisos-colaboradores.component.css'
})
export class SolicitudPermisosColaboradoresComponent {
  formulario: FormGroup;
  previewUrl: string | ArrayBuffer | null = null; // Propiedad para almacenar la URL de vista previa de la imagen

  diasConflictos: { nombre: string, valor: number }[] = [
    { nombre: 'Domingo', valor: 0 },
    { nombre: 'Lunes', valor: 1 },
    { nombre: 'Martes', valor: 2 },
    { nombre: 'Miércoles', valor: 3 },
    { nombre: 'Jueves', valor: 4 },
    { nombre: 'Viernes', valor: 5 },
    { nombre: 'Sábado', valor: 6 }
  ];

  diasSemana = this.diasConflictos;

  constructor(private fb: FormBuilder) {
    this.formulario = this.fb.group({
      nombre: ['', Validators.required],
      telefono: ['', Validators.required],
      cargoActual: ['', Validators.required],
      provincia: ['', Validators.required],
      preposicion: ['', Validators.required],
      nombreEncargado: ['', Validators.required],
      telefonoEncargado: ['', Validators.required],
      otroTrabajo: ['no', Validators.required],
      descripcionTrabajo: [''],
      programaEstudio: ['', Validators.required],
      imagen: [''],
      nivelCarrera: ['', Validators.required],
      universidad: ['', Validators.required],
      nombreProfesor: ['', Validators.required],
      contactoProfesor: ['', Validators.required],
      inicioPeriodo: ['', Validators.required],
      finalPeriodo: ['', Validators.required],
      diasConflicto: [[]],
      diasClase: [[]],
      fechaEnvio: [new Date()]
    });
  }

  ngOnInit() {
    this.onTrabajoChange();
  }

  onTrabajoChange() {
    const descripcionTrabajoControl = this.formulario.get('descripcionTrabajo');
    if (this.formulario.get('otroTrabajo')?.value === 'si') {
      descripcionTrabajoControl?.setValidators([Validators.required]);
    } else {
      descripcionTrabajoControl?.clearValidators();
    }
    descripcionTrabajoControl?.updateValueAndValidity();
  }

  onFileSelected(event: any) {
    const file = event.target.files[0];
    if (file && file.type.startsWith('image/')) {
      const reader = new FileReader();
      reader.onload = () => {
        this.previewUrl = reader.result; // Almacena la URL para la vista previa
      };
      reader.readAsDataURL(file);
      this.formulario.patchValue({ imagen: file });
    } else {
      alert('Por favor, seleccione un archivo de imagen válido.');
    }
  }

  toggleDia(dia: number) {
    const diasConflicto = this.formulario.get('diasConflicto')?.value as number[];
    if (diasConflicto.includes(dia)) {
      this.formulario.patchValue({
        diasConflicto: diasConflicto.filter(d => d !== dia)
      });
    } else {
      this.formulario.patchValue({
        diasConflicto: [...diasConflicto, dia]
      });
    }
  }

  toggleDiaClase(dia: number) {
    const diasClase = this.formulario.get('diasClase')?.value as number[];
    if (diasClase.includes(dia)) {
      this.formulario.patchValue({
        diasClase: diasClase.filter(d => d !== dia)
      });
    } else {
      this.formulario.patchValue({
        diasClase: [...diasClase, dia]
      });
    }
  }

  onSubmit() {
    if (this.formulario.valid) {
      const formData = this.formulario.value;
      const jsonFormData = JSON.stringify(formData, null, 2);
      console.log("Información a enviar (JSON):", jsonFormData);

      Swal.fire({
        title: 'Formulario enviado',
        text: 'La información ha sido enviada exitosamente.',
        icon: 'success',
        confirmButtonText: 'Aceptar'
      });
    } else {
      Swal.fire({
        title: 'Formulario incompleto',
        text: 'Por favor, completa todos los campos requeridos.',
        icon: 'error',
        confirmButtonText: 'Aceptar'
      });
    }
  }
}
