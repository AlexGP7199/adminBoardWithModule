import { Component } from '@angular/core';
import { FormControl } from '@angular/forms';
import { map, Observable, startWith } from 'rxjs';

@Component({
  selector: 'app-solicitud-amonestacion',
  templateUrl: './solicitud-amonestacion.component.html',
  styleUrl: './solicitud-amonestacion.component.css'
})
export class SolicitudAmonestacionComponent {
  solicitudAmonestacion = {
    fechaReporte: '',
    gradoAmonestacion: '',
    nombreServidor: '',
    cedula: '',
    cargo: '',
    dependencia: '',
    contacto: '',
    reportadoPor: '',
    cargoReportado: '',
    fechaAcontecimiento: '',
    descripcionHecho: ''
  };

  cargos: string[] = [
    'Técnico de Transporte',
    'Enfermero/a',
    'Doctor/a',
    'Analista',
    'Administrador/a',
    'Asistente Administrativo',
    'Paramédico',
    'Supervisor de Operaciones',
    'Chofer de Ambulancia',
    'Coordinador de Logística',
    'Otros'
  ];

  cargoControl = new FormControl('');
  filteredCargos!: Observable<string[]>;

  ngOnInit() {
    this.filteredCargos = this.cargoControl.valueChanges.pipe(
      startWith(''),
      map(value => this._filter(value || ''))
    );
  }

  private _filter(value: string): string[] {
    const filterValue = value.toLowerCase();
    return this.cargos.filter(cargo => cargo.toLowerCase().includes(filterValue));
  }

  seleccionarCargo(event: any) {
    this.solicitudAmonestacion.cargo = event.option.value;
  }

  enviarSolicitud() {
    console.log('Solicitud de Amonestación:', JSON.stringify(this.solicitudAmonestacion, null, 2));
    alert('Solicitud de Amonestación enviada correctamente.');
  }
}
