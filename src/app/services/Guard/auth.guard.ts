import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot } from '@angular/router';
import { AuthService } from '../auth.service';

@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate {
  constructor(private authService: AuthService, private router: Router) {}

  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): boolean {
    if (!this.authService.isLoggedIn()) {
      this.router.navigate(['/login']);
      return false;
    }

    // Obtener el token decodificado
    const decodedToken = this.authService.getDecodedToken();

    if (!decodedToken) {
      // Si el token no es válido o no existe, redirigir al login
      this.router.navigate(['/login']);
      return false;
    }

    const nivel = parseInt(decodedToken.nivel || '0', 10);
    const rutaSolicitada = state.url;

    // Redirigir según el nivel del usuario
    if (nivel === 0 && !['/horario', '/ValidacionFechas'].includes(rutaSolicitada)) {
      this.router.navigate(['/horario']);
      return false;
    }
     else if (nivel > 0 && rutaSolicitada === '/') {
      // Redirige a la página de Conflictos si es un usuario de nivel mayor a 0
      this.router.navigate(['/Conflictos']);
      return false;
    }

    return true;
  }
}
