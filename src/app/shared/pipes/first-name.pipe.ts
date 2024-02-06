import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'firstName',
})
export class FirstNamePipe implements PipeTransform {
  transform(value: string): string {
    const nomes = value.split(' ');
    if (nomes.length > 0) {
      if (nomes[0] == 'ANTONIO') return 'FERRARO';
      return nomes[0];
    }
    return '';
  }
}
