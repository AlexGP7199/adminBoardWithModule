// auth-level.guard.ts
import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class AuthLevelGuard implements CanActivate {
  constructor(private router: Router) {}

  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): boolean {
    const userLevel = parseInt(localStorage.getItem('nivelUsuario') || '0', 10);

    // Validar la ruta según el nivel
    if (userLevel === 0 && state.url !== '/horario') {
      this.router.navigate(['/horario']);
      return false;
    }

    return true;
  }
}
