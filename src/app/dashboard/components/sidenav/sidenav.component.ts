import { Component } from '@angular/core';
import { AuthService } from '../../../services/auth.service';

@Component({
  selector: 'app-sidenav',
  templateUrl: './sidenav.component.html',
  styleUrl: './sidenav.component.css'
})
export class SidenavComponent {
  nombre: string | null = '';
  rol: string | null = '';

  constructor(private authService: AuthService) {}

  ngOnInit(): void {
    // Obtén los valores desde el servicio de autenticación
    this.nombre = this.authService.getNombre();
    this.rol = this.authService.getRole();
  }
}
