import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'fechaFormat'
})
export class FechaFormatPipe implements PipeTransform {

  transform(value: string): string {
    if (!value) return '';

    const [year, month, day] = value.split('-');
    return `${day}/${month}/${year}`;
  }

}
