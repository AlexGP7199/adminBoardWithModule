import { Component } from '@angular/core';

@Component({
  selector: 'app-solicitud-licencia-medica',
  templateUrl: './solicitud-licencia-medica.component.html',
  styleUrl: './solicitud-licencia-medica.component.css'
})
export class SolicitudLicenciaMedicaComponent {
  solicitudLicencia = {
    nombreColaborador: '',
    cedulaColaborador: '',
    nombreMedico: '',
    registroMedico: '',
    especialidadMedico: '',
    diagnostico: '',
    tiempoDuracion: '',
    requisitos: {
      nombreMedico: false,
      registroMedico: false,
      especialidadMedico: false,
      diagnostico: false,
      tiempoDuracion: false,
      selloMedico: false,
      hojaTimbrada: false,
      recomendacionDiagnostico: false,
      cedulaColaboradorAdjunta: false,
      anexosLicencia: false
    },
    observaciones: '',
    ciudadDeclaracion: '',
    diaDeclaracion: '',
    mesDeclaracion: '',
    anioDeclaracion: ''
  };

  enviarSolicitud() {
    console.log('Solicitud de Licencia Médica:', JSON.stringify(this.solicitudLicencia, null, 2));
    alert('Solicitud enviada correctamente. Revisa la consola para ver los datos enviados.');
  }
}
