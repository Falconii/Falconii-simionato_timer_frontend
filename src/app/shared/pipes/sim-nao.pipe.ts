import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'simNao',
})
export class SimNaoPipe implements PipeTransform {
  transform(value: string): string {
    let retorno = 'Não';
    if (value == 'S') retorno = 'Sim';
    else retorno = 'Não';
    return retorno;
  }
}
