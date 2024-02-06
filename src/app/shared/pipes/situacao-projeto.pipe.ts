import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'situacaoProjeto',
})
export class SituacaoProjetoPipe implements PipeTransform {
  transform(value: string): string {
    let retorno = 'Proposta';
    if (value == '0') return 'Proposta';
    if (value == '1') return 'Em Aberto';
    if (value == '2') return 'Em Andamento';
    if (value == '3') return 'Encerrado';
    if (value == '4') return 'Suspenso';
    if (value == '5') return 'Cancelado';
    return retorno;
  }
}
