import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'cnpjcpf',
})
export class CnpjCpfPipe implements PipeTransform {
  transform(value: string): string {
    let retorno: string = '';
    if (value == null) {
      return '';
    } else {
      if (value.trim().length == 11) {
        retorno = `${value.substring(0, 3)}.${value.substring(
          3,
          6
        )}.${value.substring(6, 9)}-${value.substring(9, 11)}`;
      }
      if (value.trim().length == 14) {
        retorno = `${value.substring(0, 2)}.${value.substring(
          2,
          5
        )}.${value.substring(5, 8)}/${value.substring(8, 12)}-${value.substring(
          12,
          14
        )}`;
      }
      return retorno;
    }
  }
}
