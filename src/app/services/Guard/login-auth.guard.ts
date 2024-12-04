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

      const decodedToken = this.authService.getDecodedToken();

      if (decodedToken && decodedToken.nivel) {
        const nivel = parseInt(decodedToken.nivel, 10);
        // Redirigir según el nivel del usuario
        const ruta = nivel === 0 ? '/horario' : '/Conflictos';
        this.router.navigate([ruta]);
        return false;
      }
    }
    // Permitir acceso a login si no está autenticado
    return true;
  }
}



