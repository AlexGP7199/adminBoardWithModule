import { Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router';
import { AuthService } from '../auth.service';

@Injectable({
  providedIn: 'root'
})
export class loginAuthGuard implements CanActivate {
  constructor(private authService: AuthService, private router: Router) {}

  canActivate(): boolean {
    if (this.authService.isLoggedIn()) {
      // Si el usuario está autenticado, redirige al dashboard
      this.router.navigate(['/Dashboard']);
      return false;
    }
    // Si no está autenticado, permite el acceso al login
    return true;
  }
}



