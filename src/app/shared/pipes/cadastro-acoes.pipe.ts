import { Pipe, PipeTransform } from '@angular/core';
import { CadastroAcoes } from '../classes/cadastro-acoes';

@Pipe({
  name: 'cadastroAcoesPipe',
})
export class CadastroAcoesPipe implements PipeTransform {
  transform(value: number): string {
    let retorno = '';
    switch (value) {
      case CadastroAcoes.None:
        retorno = '';
        break;
      case CadastroAcoes.Inclusao:
        retorno = 'INCLUSÃO';
        break;
      case CadastroAcoes.Exclusao:
        retorno = 'EXCLUSÃO';
        break;
      case CadastroAcoes.Edicao:
        retorno = 'ALTERAÇÃO';
        break;
      default:
        retorno = '';
        break;
    }
    return retorno;
  }
}
