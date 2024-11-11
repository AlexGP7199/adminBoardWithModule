import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'filtroConflictos'
})
export class FiltroConflictosPipe implements PipeTransform {
  transform(conflictos: any[], searchNombre: string, searchFecha: string): any[] {
    if (!conflictos) return [];
    if (!searchNombre && !searchFecha) return conflictos;

    return conflictos.filter(conflicto => {
      const coincideNombre = searchNombre
        ? conflicto.usuarioNombre.toLowerCase().includes(searchNombre.toLowerCase())
        : true;

      const coincideFecha = searchFecha
        ? conflicto.fechaGeneracion.includes(searchFecha)
        : true;

      return coincideNombre && coincideFecha;
    });
  }
}
