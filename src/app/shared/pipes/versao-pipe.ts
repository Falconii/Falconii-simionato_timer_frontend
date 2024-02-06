import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'versaopipe',
})
export class VersaoPipe implements PipeTransform {
  transform(value: string): string {
    const retorno =
      value.length >= 4
        ? value.substring(0, 2) + '.' + value.substring(2, 4)
        : value;
    return retorno;
  }
}
