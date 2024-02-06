import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'ativo',
})
export class AtivoPipe implements PipeTransform {
  transform(value: number): string {
    const retorno = value == 1 ? 'ATIVA' : 'INATIVA';
    return retorno;
  }
}
