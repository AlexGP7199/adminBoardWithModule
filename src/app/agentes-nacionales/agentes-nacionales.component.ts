import { Component } from '@angular/core';
import { Router } from '@angular/router';

interface Region {
  name: string;
  provinces: string[];
}


@Component({
  selector: 'app-agentes-nacionales',
  templateUrl: './agentes-nacionales.component.html',
  styleUrl: './agentes-nacionales.component.css'
})
export class AgentesNacionalesComponent {
  personas: any[] = []; // Array to store person data
  regions: Region[] = [
    { name: 'Cibao Norte', provinces: ['Santiago', 'Puerto Plata', 'La Vega'] },
    { name: 'Cibao Sur', provinces: ['San Cristóbal', 'Santo Domingo', 'Distrito Nacional'] },
    { name: 'Cibao Este', provinces: ['La Altagracia', 'El Seibo', 'Hato Mayor'] },
    // Add additional regions and their provinces as needed
  ];
  provinces: string[] = []; // Provinces filtered by selected region
  public searchCedula: string = '';
  public searchNombre: string = '';
  public selectedRegion: string = '';
  public selectedProvince: string = '';

  ngOnInit(): void {
    // Sample JSON data
    this.personas = [
      { cedula: '001-2345678-9', nombre: 'Juan Pérez', provincia: 'Santo Domingo', region: 'Cibao Sur' },
      { cedula: '002-3456789-0', nombre: 'Ana García', provincia: 'Santiago', region: 'Cibao Norte' },
      { cedula: '003-4567890-1', nombre: 'Carlos López', provincia: 'La Vega', region: 'Cibao Norte' },
      { cedula: '004-5678901-2', nombre: 'María Rodríguez', provincia: 'Puerto Plata', region: 'Cibao Norte' },
      { cedula: '005-6789012-3', nombre: 'Pedro Martínez', provincia: 'San Cristóbal', region: 'Cibao Sur' }
    ];
  }

  constructor(private router: Router) {}

  verDetalles(cedula: string): void {
    this.router.navigate(['/detalle', cedula]); // Navigate to detail page
  }

  onRegionChange(): void {
    // Update the province list based on selected region
    const region = this.regions.find(r => r.name === this.selectedRegion);
    this.provinces = region ? region.provinces : [];
    this.selectedProvince = ''; // Reset province selection when region changes
  }

  filterPersons() {
    return this.personas.filter(persona =>
      (this.searchCedula ? persona.cedula.includes(this.searchCedula) : true) &&
      (this.searchNombre ? persona.nombre.toLowerCase().includes(this.searchNombre.toLowerCase()) : true) &&
      (this.selectedRegion ? persona.region === this.selectedRegion : true) &&
      (this.selectedProvince ? persona.provincia === this.selectedProvince : true)
    );
  }
}
