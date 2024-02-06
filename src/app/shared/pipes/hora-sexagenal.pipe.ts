import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'horaSexagenal',
})
export class HoraSexagenalPipe implements PipeTransform {
  transform(value: number): string {
    let numero: string = Number(value).toFixed(2);
    let horas: string = numero.substring(0, numero.indexOf('.'));
    let minutos: string = numero.substring(numero.indexOf('.') + 1);
    minutos = '00' + (Number.parseInt(minutos) / 1.67).toFixed(0).trim();
    minutos = minutos.substring(minutos.length - 2);
    if (minutos.length < 2) minutos = '0' + minutos;
    return horas + ':' + minutos;
  }
}
