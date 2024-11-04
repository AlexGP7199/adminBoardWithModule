import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-agentes',
  templateUrl: './agentes.component.html',
  styleUrls: ['./agentes.component.css']
})
export class AgentesComponent implements OnInit {
  personas: any[] = []; // Array para almacenar los datos de personas
  public searchCedula: string = '';
  public searchNombre: string = '';
  ngOnInit(): void {
    // Simulación de datos JSON
    this.personas = [
      { cedula: '001-2345678-9', nombre: 'Juan Pérez', provincia: 'Santo Domingo' },
      { cedula: '002-3456789-0', nombre: 'Ana García', provincia: 'Santiago' },
      { cedula: '003-4567890-1', nombre: 'Carlos López', provincia: 'La Vega' },
      { cedula: '004-5678901-2', nombre: 'María Rodríguez', provincia: 'Puerto Plata' },
      { cedula: '005-6789012-3', nombre: 'Pedro Martínez', provincia: 'San Cristóbal' }
    ];
  }


}
