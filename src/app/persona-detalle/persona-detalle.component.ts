import { Component } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-persona-detalle',
  templateUrl: './persona-detalle.component.html',
  styleUrl: './persona-detalle.component.css'
})
export class PersonaDetalleComponent {
  persona: any = {};
  actividades: any[] = [];

  constructor(private route: ActivatedRoute) {}

  ngOnInit(): void {
    const cedula = this.route.snapshot.paramMap.get('cedula'); // Obtener la cédula de la URL
    this.cargarDatosPersona(cedula);
  }

  cargarDatosPersona(cedula: string | null): void {
    // Simulación de datos de ejemplo
    this.persona = {
      cedula: cedula,
      nombre: 'Juan Pérez',
      provincia: 'Santo Domingo'
    };
    this.actividades = [
      { fecha: '2023-01-01', descripcion: 'Reunión de planificación' },
      { fecha: '2023-02-15', descripcion: 'Evaluación de desempeño' },
      { fecha: '2023-03-20', descripcion: 'Capacitación técnica' }
    ];
  }
}
