import { Component } from '@angular/core';
import { UsuarioService } from './services/usuario.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-tablero-usuarios',
  templateUrl: './tablero-usuarios.component.html',
  styleUrl: './tablero-usuarios.component.css'
})
export class TableroUsuariosComponent {
  regiones: any[] = [];
  provinciasFiltradas: any[] = [];
  equipos: any[] = [];
  usuariosFiltrados: any[] = [];

  selectedRegion: number | null = null;
  selectedProvincia: number | null = null;
  selectedTeam: number | null = null;

  constructor(private usuarioService: UsuarioService) {}

  ngOnInit(): void {
    this.cargarRegiones();
    this.cargarEquipos();
  }

  cargarRegiones(): void {
    this.usuarioService.obtenerRegiones().subscribe(
      (regiones) => (this.regiones = regiones),
      (error) => console.error('Error al cargar regiones:', error)
    );
  }

  cargarProvincias(regionId: number): void {
    this.usuarioService.obtenerProvincias(regionId).subscribe(
      (provincias) => (this.provinciasFiltradas = provincias),
      (error) => {
        console.error('Error al cargar provincias:', error);
        Swal.fire('Error', 'No se encontraron provincias para la región seleccionada.', 'error');
      }
    );
  }

  cargarEquipos(): void {
    this.usuarioService.obtenerEquipos().subscribe(
      (equipos) => (this.equipos = equipos),
      (error) => console.error('Error al cargar equipos:', error)
    );
  }

  onRegionChange(): void {
    if (this.selectedRegion) {
      this.cargarProvincias(this.selectedRegion);
    } else {
      this.provinciasFiltradas = [];
    }
    this.selectedProvincia = null;
    this.filtrarUsuarios();
  }

  onProvinciaChange(): void {
    this.filtrarUsuarios();
  }

  onTeamChange(): void {
    this.filtrarUsuarios();
  }

  filtrarUsuarios(): void {
    this.usuarioService.listarUsuariosFiltrados(
      this.selectedRegion ?? undefined,
      this.selectedProvincia ?? undefined,
      this.selectedTeam ?? undefined
    ).subscribe(
      (usuarios) => (this.usuariosFiltrados = usuarios),
      (error) => console.error('Error al filtrar usuarios:', error)
    );
  }

}
