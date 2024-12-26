import { Component, OnInit } from '@angular/core';
import { initFlowbite } from 'flowbite';
import { AuthService } from './services/auth.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent implements OnInit {
  title = 'adminBoardWithModule';


  isSidenavHidden = false; // Controla si el sidenav está oculto

  constructor(public authService: AuthService, private router: Router) {}

  ngOnInit(): void {
    initFlowbite();

    this.checkAuthentication();
  }

  checkAuthentication() {
    // Verifica si el usuario está autenticado y redirige al login si no lo está
    if (!this.authService.isLoggedIn()) {
      this.router.navigate(['/login']);
    }
  }

  toggleSidenav() {
    this.isSidenavHidden = !this.isSidenavHidden;
  }
}
