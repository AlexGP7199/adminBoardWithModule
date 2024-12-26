import { Component, OnInit } from '@angular/core';
import { DayOfWeek } from '../tablero-usuarios/enumInterfaces.ts/enumInt';
import Swal from 'sweetalert2';
import { UsuarioService } from '../tablero-usuarios/services/usuario.service';
import { AuthService } from '../services/auth.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-form-solicitud-validacion-fechas',
  templateUrl: './form-solicitud-validacion-fechas.component.html',
  styleUrl: './form-solicitud-validacion-fechas.component.css'
})
export class FormSolicitudValidacionFechasComponent implements OnInit {

  constructor(private usuarioService: UsuarioService,  private authService: AuthService, private router: Router) {
  }
  today: string = new Date().toISOString().split('T')[0]; // Fecha actual en formato ISO.
  diasSemana = [
    { label: 'Lunes', value: DayOfWeek.Monday },
    { label: 'Martes', value: DayOfWeek.Tuesday },
    { label: 'Miércoles', value: DayOfWeek.Wednesday },
    { label: 'Jueves', value: DayOfWeek.Thursday },
    { label: 'Viernes', value: DayOfWeek.Friday },
    { label: 'Sábado', value: DayOfWeek.Saturday },
    { label: 'Domingo', value: DayOfWeek.Sunday }
  ];

  validarFechasEstudioRequest = {
    usuarioId: 0, // Inicializamos con un valor predeterminado
    inicioEstudios: '',
    finEstudios: '',
    diasEstudio: [] as DayOfWeek[],
    motivo: '',
    imagen: null as File | null,
  };


  imagenUrl: string | null = null;
  mostrarErrorImagen = false;
  usuario: any = null;

  ngOnInit(): void {
    //this.usuario = this.getUserData();
    //console.log('Datos del usuario:', this.usuario);
    const decodedToken = this.authService.getDecodedToken();

  if (decodedToken) {
    this.usuario = {
      usuarioId: parseInt(decodedToken.usuarioId, 10),
      cedula: decodedToken.cedula,
      nombre: decodedToken.nombre,
      provincia: decodedToken.provincia,
      region: decodedToken.region,
      role: decodedToken.role,
      teamName: decodedToken.teamName,
    };
    if (this.usuario && this.usuario.usuarioId) {
      this.validarFechasEstudioRequest.usuarioId = parseInt(this.usuario.usuarioId, 10); // Asignar el userId al objeto de solicitud
    } else {
      console.warn('No se encontró el user.');
    }

  } else {
    //console.error('El token no se pudo decodificar o no existe.');
    this.authService.logout(); // Redirige al login si no hay un token válido
  }
}



  // Método para obtener datos del localStorage
  /*
  getUserData(): any {
    const userData: any = {};
    for (let i = 0; i < localStorage.length; i++) {
      const key = localStorage.key(i);
      if (key) {
        userData[key] = localStorage.getItem(key);
      }
    }
    return userData;
  } */

 onDiaEstudioChange(event: any): void {
  const diaSeleccionado = parseInt(event.target.value, 10); // Convertir a entero
  if (event.target.checked) {
    if (!this.validarFechasEstudioRequest.diasEstudio.includes(diaSeleccionado)) {
      this.validarFechasEstudioRequest.diasEstudio.push(diaSeleccionado);
    }
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
    Swal.fire('Error', 'Debe cargar una imagen antes de enviar el formulario.', 'error');
    this.authService.logout();
    return;
  }

  if (!this.validarFechasEstudioRequest.usuarioId || this.validarFechasEstudioRequest.usuarioId <= 0) {
    Swal.fire('Error', 'El usuario no está identificado. Por favor, vuelva a iniciar sesión.', 'error');
    this.authService.logout();
    return;
  }

  if (this.validarFechasEstudioRequest.diasEstudio.length === 0) {
    Swal.fire('Error', 'Debe seleccionar al menos un día de estudio.', 'error');
    this.authService.logout();
    return;
  }

  //console.log('Datos enviados al backend:', this.validarFechasEstudioRequest);
  this.usuarioService.validarFechasEstudio(this.validarFechasEstudioRequest).subscribe(
    (response) => {
      Swal.fire('Éxito', response.mensaje, 'success');
      //console.log('Respuesta del servidor:', response);

      const conflictoId =  response.conflictoId;
      //console.log('ID delconflicto:', conflictoId);

      if (conflictoId) {
        this.subirImagen(conflictoId);
      } else {
        this.limpiarFormulario();
      }
    },
    (error) => {
      this.manejarError(error);
    }
  );
}

  subirImagen(conflictoId: number): void {
    if (this.validarFechasEstudioRequest.imagen) {
      this.usuarioService.subirImagen(conflictoId, this.validarFechasEstudioRequest.imagen).subscribe(
        () => {
          Swal.fire('Éxito', 'Imagen cargada exitosamente.', 'success');
          this.limpiarFormulario();
          this.router.navigate(['/horario']); // Redirigir a la ruta de horario
        },
        (error) => {
          Swal.fire('Error', 'No se pudo cargar la imagen. Por favor, inténtelo más tarde.', 'error');
        }
      );
    } else {
      Swal.fire('Error', 'No se seleccionó ninguna imagen para subir.', 'error');
    }
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

  limpiarFormulario(): void {
    this.validarFechasEstudioRequest = {
      usuarioId : 0,
      inicioEstudios: '',
      finEstudios: '',
      diasEstudio: [],
      motivo: '',
      imagen: null,
    };
    this.imagenUrl = null;
    this.mostrarErrorImagen = false;
  }
}
