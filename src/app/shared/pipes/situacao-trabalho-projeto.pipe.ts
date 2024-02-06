import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'situacaoTrabalhoProjeto',
})
export class SituacaoTrabalhoProjetoPipe implements PipeTransform {
  transform(value: string): unknown {
    let retorno = '';

    if ((value = '0')) return 'Em aberto';
    if ((value = '1')) return 'Planejamento Trabalhos OK';
    if ((value = '2')) return 'Em Andamento';
    if ((value = '3')) return 'Encerrada';
    if ((value = '4')) return 'Suspensa';
    if ((value = '5')) return 'Cancelada';

    return retorno;
  }
}
