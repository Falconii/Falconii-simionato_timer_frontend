import { AbstractControl, ValidationErrors, ValidatorFn } from '@angular/forms';

export function ValidatorCurrency(
  required: boolean = false,
  zero: boolean = false
): ValidatorFn {
  return (control: AbstractControl): ValidationErrors | null => {
    let message = '';

    let valido = true;

    let value = control.value;

    if (!required && value == null) {
      return null;
    }

    if (required && value == null) {
      return { ValidatorStringLen: true, message: 'Dado Obrigatório' };
    }

    let valor: string = value.toString();
    let CtPonto = valor.split('.').length - 1;

    let CtVirgula = (valor.match(/,/g) || []).length;

    if (CtPonto > 1 || CtVirgula > 1) {
      message = `Valor Inválido, Usar Apenas Vírgula Na Casa Decimal e Não Coloque Separador De Milhar.`;
      valido = false;
    } else {
      valor = valor.replace('.', '');
      valor = valor.replace(',', '.');

      if (isNaN(Number(valor))) {
        message = `Valor Inválido, Usar Apenas Vírgula Na Casa Decimal e Não Coloque Separador De Milhar`;

        valido = false;
      } else {
        if (Number(valor) == 0 && !zero) {
          message = `Valor Não Poderá Ser Zero!`;
          valido = false;
        }
      }
    }

    return !valido ? { ValidatorCurrency: true, message: message } : null;
  };
}
