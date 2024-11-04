import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'nombreFilter'
})
export class NombreFilterPipe implements PipeTransform {

  transform(personas: any[], searchNombre: string): any[] {
    if (!personas || !searchNombre) {
      return personas;
    }
    return personas.filter(persona =>
      persona.nombre.toLowerCase().includes(searchNombre.toLowerCase())
    );
  }
}
