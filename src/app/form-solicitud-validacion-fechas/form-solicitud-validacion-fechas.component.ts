import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-form-solicitud-validacion-fechas',
  templateUrl: './form-solicitud-validacion-fechas.component.html',
  styleUrl: './form-solicitud-validacion-fechas.component.css'
})
export class FormSolicitudValidacionFechasComponent implements OnInit {
  today: string = new Date().toISOString().split('T')[0]; // Fecha actual en formato ISO.
  diasSemana = [
    { label: 'Lunes', value: 'lunes' },
    { label: 'Martes', value: 'martes' },
    { label: 'Miércoles', value: 'miercoles' },
    { label: 'Jueves', value: 'jueves' },
    { label: 'Viernes', value: 'viernes' },
    { label: 'Sábado', value: 'sabado' },
    { label: 'Domingo', value: 'domingo' },
  ];
  validarFechasEstudioRequest = {
    inicioEstudios: '',
    finEstudios: '',
    diasEstudio: [] as string[],
    motivo: '',
    imagen: null as File | null,
  };
  imagenUrl: string | null = null;
  mostrarErrorImagen = false;
  usuario: any = null;

  ngOnInit(): void {
    // Obtener información del usuario desde localStorage
    const storedUser = localStorage.getItem('usuarioSeleccionado');
    this.usuario = storedUser ? JSON.parse(storedUser) : null;
  }

  onDiaEstudioChange(event: any): void {
    const diaSeleccionado = event.target.value;
    if (event.target.checked) {
      this.validarFechasEstudioRequest.diasEstudio.push(diaSeleccionado);
    } else {
      this.validarFechasEstudioRequest.diasEstudio = this.validarFechasEstudioRequest.diasEstudio.filter(
        (dia) => dia !== diaSeleccionado
      );
    }
  }

  onImageSelected(event: any): void {
    const file = event.target.files[0];
    if (file) {
      this.validarFechasEstudioRequest.imagen = file;
      const reader = new FileReader();
      reader.onload = () => (this.imagenUrl = reader.result as string);
      reader.readAsDataURL(file);
      this.mostrarErrorImagen = false;
    }
  }

  enviarFormulario(): void {
    if (!this.validarFechasEstudioRequest.imagen) {
      this.mostrarErrorImagen = true;
      return;
    }
    console.log('Formulario enviado:', this.validarFechasEstudioRequest);
    // Lógica para enviar el formulario.
  }
}
