import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

interface Region {
  name: string;
  provinces: string[];
}

@Component({
  selector: 'app-agentes-regionales',
  templateUrl: './agentes-regionales.component.html',
  styleUrl: './agentes-regionales.component.css'
})
export class AgentesRegionalesComponent {
  personas: any[] = []; // Array to store person data
  provinces: string[] = ['Santo Domingo', 'Santiago', 'La Vega', 'Puerto Plata', 'San Cristóbal']; // List of provinces
  public searchCedula: string = '';
  public searchNombre: string = '';
  public selectedProvince: string = ''; // To hold the selected province for filtering

  ngOnInit(): void {
    // Sample JSON data
    this.personas = [
      { cedula: '001-2345678-9', nombre: 'Juan Pérez', provincia: 'Santo Domingo' },
      { cedula: '002-3456789-0', nombre: 'Ana García', provincia: 'Santiago' },
      { cedula: '003-4567890-1', nombre: 'Carlos López', provincia: 'La Vega' },
      { cedula: '004-5678901-2', nombre: 'María Rodríguez', provincia: 'Puerto Plata' },
      { cedula: '005-6789012-3', nombre: 'Pedro Martínez', provincia: 'San Cristóbal' }
    ];
  }

  constructor(private router: Router) {}

  verDetalles(cedula: string): void {
    this.router.navigate(['/detalle', cedula]); // Navigate to detail page
  }

  filterPersons() {
    return this.personas.filter(persona =>
      (this.searchCedula ? persona.cedula.includes(this.searchCedula) : true) &&
      (this.searchNombre ? persona.nombre.toLowerCase().includes(this.searchNombre.toLowerCase()) : true) &&
      (this.selectedProvince ? persona.provincia === this.selectedProvince : true)
    );
  }
}
