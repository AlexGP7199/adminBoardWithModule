// auth-level.guard.ts
import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, Router } from '@angular/router';
import { AuthService } from '../auth.service';

@Injectable({
  providedIn: 'root'
})
export class AuthLevelGuard implements CanActivate {
  constructor(private router: Router, private authService: AuthService) {}

  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): boolean {
    const decodedToken = this.authService.getDecodedToken();

    if (!decodedToken) {
      // Redirigir al login si no hay un token válido
      this.router.navigate(['/login']);
      return false;
    }

    const userLevel = parseInt(decodedToken.nivel || '0', 10);


    // Validar la ruta según el nivel
    if (userLevel === 0 && state.url !== '/horario') {
      this.router.navigate(['/horario']);
      return false;
    }

    return true;
  }

}
