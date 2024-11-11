import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'filtroUsuario'
})
export class FiltroUsuarioPipe  implements PipeTransform {
  transform(usuarios: any[], cedula: string, nombre: string): any[] {
    if (!usuarios) return [];

    return usuarios.filter(usuario => {
      const cedulaMatch = cedula ? usuario.cedula.toLowerCase().includes(cedula.toLowerCase()) : true;
      const nombreMatch = nombre ? usuario.nombre.toLowerCase().includes(nombre.toLowerCase()) : true;
      return cedulaMatch && nombreMatch;
    });
  }
}
