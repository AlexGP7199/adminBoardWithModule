import { Component } from '@angular/core';
import { AuthService } from '../../../services/auth.service';
import { ConflictoService } from '../../../tablero-conflictos/services/conflicto.service';

@Component({
  selector: 'app-sidenav',
  templateUrl: './sidenav.component.html',
  styleUrl: './sidenav.component.css'
})
export class SidenavComponent {
  nombre: string | null = '';
  rol: string | null = '';
  nivelUsuario: number = 0;
  team : string | null = '';
  habilitarApartado = false;
  usuarioId: number = 0; // ID del usuario autenticado
  constructor(private authService: AuthService, private conflictoService: ConflictoService) {}

  ngOnInit(): void {


    // Obtén los valores desde el servicio de autenticación
    this.nombre = this.authService.getNombre();
    this.rol = this.authService.getRole();
    //console.log("su rol es: " + this.rol);
    this.team = this.authService.getTeam();
    //console.log("su team es: " + this.team);
    this.nivelUsuario = this.authService.getNivel();

    // Verificar conflictos aprobados
    this.usuarioId = this.authService.getUsuarioId();
    if (this.usuarioId) {
      this.verificarConflictosAprobados(this.usuarioId);
    }
  }

  verificarConflictosAprobados(usuarioId: number): void {
    this.conflictoService.verificarConflictosAprobados(usuarioId).subscribe({
      next: (conflictoResponse) => {
        const tieneConflictoAprobado = conflictoResponse.tieneConflictoAprobado;

        // Actualizar el estado del botón
        this.habilitarApartado = tieneConflictoAprobado;

        // Guardar en LocalStorage
        localStorage.setItem(
          'conflictoAprobado',
          JSON.stringify({
            tieneConflictoAprobado: tieneConflictoAprobado,
            detalles: conflictoResponse.Detalles || [],
          })
        );
      },
      error: (error) => {
        console.error('Error al verificar conflictos aprobados:', error);
      },
    });
  }
}
