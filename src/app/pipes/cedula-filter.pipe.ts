import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'cedulaFilter'
})
export class CedulaFilterPipe implements PipeTransform {

  transform(personas: any[], searchCedula: string): any[] {
    if (!personas || !searchCedula) {
      return personas;
    }
    return personas.filter(persona =>
      persona.cedula.toLowerCase().includes(searchCedula.toLowerCase())
    );
  }

}
