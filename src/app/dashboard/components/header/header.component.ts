import { Component, ElementRef, Renderer2 } from '@angular/core';
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
  isDropdownVisible: boolean = false;

  constructor(public authService: AuthService, private router: Router) {}

  ngOnInit(): void {
    this.nombre = this.authService.getNombre();
    this.rol = this.authService.getRole();
  }

  toggleDropdown() {
    this.isDropdownVisible = !this.isDropdownVisible;
  }

  logout() {
    this.authService.logout();
    this.router.navigate(['/login']);
  }
}
