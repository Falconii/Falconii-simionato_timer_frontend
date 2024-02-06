import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'subconta',
})
export class SubcontaPipe implements PipeTransform {
  transform(value: string): string {
    let conta: string = value.trim();

    let retorno: string = '';

    if (conta.length <= 2) {
      return conta;
    } else {
      for (var x = 0; x < conta.length; x = x + 2) {
        if (retorno.length != 0) retorno += '.';
        retorno = retorno + conta.substring(x, x + 2);
      }
      return retorno;
    }
  }
}
