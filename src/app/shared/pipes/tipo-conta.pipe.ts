import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'tipoConta',
})
export class TipoContaPipe implements PipeTransform {
  transform(value: string): string {
    let retorno = '';

    if (value == 'C') return 'CONTA';
    if (value == 'S') return 'SUBCONTA';
    if (value == 'O') return 'OPERACIONAL';

    return value;
  }
}
