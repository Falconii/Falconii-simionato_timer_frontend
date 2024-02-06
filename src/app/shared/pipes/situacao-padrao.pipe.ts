import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'situacaoPadrao',
})
export class SituacaoPadraoPipe implements PipeTransform {
  transform(value: string): string {
    let retorno = 'Em Aberto';
    if (value == '0') return 'Em Aberto';
    if (value == '1') return 'Em Andamento';
    if (value == '2') return 'Em Finalizado';
    if (value == '3') return 'Em Atraso';
    return retorno;
  }
}
