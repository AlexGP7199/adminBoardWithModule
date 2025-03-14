import { Component } from '@angular/core';

@Component({
  selector: 'app-solicitud-rrhhpermiso',
  templateUrl: './solicitud-rrhhpermiso.component.html',
  styleUrl: './solicitud-rrhhpermiso.component.css'
})
export class SolicitudRRHHPermisoComponent {
  solicitudPermiso = {
    nombre: '',
    cedula: '',
    cargo: '',
    departamento: '',
    fechaSolicitud: '',
    motivo: '',
    otroMotivo: '',
    tipoPermiso: '',
    fechaPermiso: '',
    desdeHora: '',
    desdeAMPM: 'AM',
    hastaHora: '',
    hastaAMPM: 'AM'
  };

  enviarSolicitud() {
    console.log('Solicitud de Permiso:', JSON.stringify(this.solicitudPermiso, null, 2));
    alert('Solicitud enviada correctamente. Revisa la consola para ver los datos enviados.');
  }
}
