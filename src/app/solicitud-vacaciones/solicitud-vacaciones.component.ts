import { Component } from '@angular/core';

@Component({
  selector: 'app-solicitud-vacaciones',
  templateUrl: './solicitud-vacaciones.component.html',
  styleUrl: './solicitud-vacaciones.component.css'
})
export class SolicitudVacacionesComponent {
  solicitudVacaciones = {
    nombre: '',
    cedula: '',
    cargo: '',
    departamento: '',
    aniosAdministracionPublica: 0,
    vacacionesDesde: '',
    vacacionesHasta: '',
    cantidadDias: 0,
    fraccionarVacaciones: false,
    justificacionFraccionamiento: '',
    trabajoOtraInstitucion: '',
    certificacionAdjunta: false
  };

  enviarSolicitud() {
    console.log('Solicitud de Vacaciones:', JSON.stringify(this.solicitudVacaciones, null, 2));
    alert('Solicitud enviada correctamente. Revisa la consola para ver los datos enviados.');
  }
}
