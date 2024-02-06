import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'soHoras',
})
export class SoHorasPipe implements PipeTransform {
  transform(value: string): string {
    return value.substring(value.indexOf(' ') + 1);
  }
}
