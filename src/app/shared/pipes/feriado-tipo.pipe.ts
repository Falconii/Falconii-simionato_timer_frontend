import { NgSwitchCase } from '@angular/common';
import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'feriadoTipo',
})
export class FeriadoTipoPipe implements PipeTransform {
  transform(value: number): string {
    let retorno = '';
    switch (value) {
      case 1:
        retorno = 'FERIADO';
        break;
      case 2:
        retorno = 'PONTE';
        break;
      case 3:
        retorno = 'FERIAS';
        break;
      case 4:
        retorno = 'AFASTAMENTO';
        break;
      case 5:
        retorno = 'LICENÇA MATERNIDADE';
        break;
      default:
        retorno = 'FERIADO';
        break;
    }
    return retorno;
  }
}
