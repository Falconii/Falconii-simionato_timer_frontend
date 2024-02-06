import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'feriadoNivel',
})
export class FeriadoNivelPipe implements PipeTransform {
  transform(value: number): string {
    let retorno = '';
    switch (value) {
      case 0:
        retorno = 'CUSTOMIZADO';
        break;
      case 1:
        retorno = 'MUNICIPAL';
        break;
      case 2:
        retorno = 'ESTADUAL';
        break;
      default:
        retorno = 'NACIONAL';
        break;
    }
    return retorno;
  }
}
