import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'situacaoAtividadeProjeto',
})
export class SituacaoTarefaTrabalhoPipe implements PipeTransform {
  transform(value: string): string {
    let retorno = '';
    if (value == '0') return 'Não Iniciado';
    if (value == '1') return 'Em Andamento';
    if (value == '2') return 'Encerrado';
    if (value == '3') return 'Suspenso';
    if (value == '4') return 'Cancelado';
    return retorno;
  }
}
