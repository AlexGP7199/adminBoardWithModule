import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot } from '@angular/router';
import { AuthService } from '../auth.service';
import { initFlowbite } from 'flowbite';

@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate {
  constructor(private authService: AuthService, private router: Router) {}

  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): boolean {
    // Verifica si el usuario está autenticado
    if (!this.authService.isLoggedIn()) {
      this.router.navigate(['/login']);
      return false;
    }

    // Obtener el token decodificado
    const decodedToken = this.authService.getDecodedToken();

    if (!decodedToken) {
      this.router.navigate(['/login']);
      return false;
    }

    // Validar nivel del usuario
    const nivel = parseInt(decodedToken.nivel || '0', 10);
    const rutaSolicitada = state.url;
    const habilitarApartado = this.authService.getHabilitarApartado(); // Leer desde sessionStorage

    // Ruta especial "solicitudForm": Evaluar antes del nivel 0
  if (rutaSolicitada === '/solicitudForm') {
    if (habilitarApartado) {
      return true; // Permitir acceso si habilitarApartado es verdadero
    } else {
      this.router.navigate(['/horario']); // Redirigir si no está habilitado
      return false;
    }
  }

    // Nivel 0: Solo acceso a "horario" y "ValidacionFechas"
    if (nivel === 0 && !['/horario', '/ValidacionFechas'].includes(rutaSolicitada)) {
      this.router.navigate(['/horario']);
      return false;
    }

    // Ruta especial "solicitudForm": Permitir solo si habilitarApartado es verdadero
    //console.log(habilitarApartado);
    //console.log(rutaSolicitada);
    //console.log(rutaSolicitada === '/solicitudForm');


    // Nivel mayor a 0: Redirigir desde "/" a "Conflictos"
    if (nivel > 0 && rutaSolicitada === '/') {
      this.router.navigate(['/Conflictos']);
      return false;
    }

    return true; // Permitir acceso
  }

}
