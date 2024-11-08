import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../../../services/auth.service';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrl: './header.component.css'
})
export class HeaderComponent {
  nombre: string | null = '';
  rol: string | null = '';

  constructor(public authService: AuthService, private router: Router) {}

  ngOnInit(): void {
    // Obtiene el nombre y rol del usuario
    this.nombre = this.authService.getNombre();
    this.rol = this.authService.getRole();
  }

  logout() {
    this.authService.logout();
    this.router.navigate(['/login']);
  }
}
