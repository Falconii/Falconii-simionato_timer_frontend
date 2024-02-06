import { AbstractControl, ValidationErrors, ValidatorFn } from '@angular/forms';

export function ValidatorDescricoes(
  tamMin: number,
  tamMax: number,
  required: boolean = false
): ValidatorFn {
  return (control: AbstractControl): ValidationErrors | null => {
    let message = '';

    let valido = true;

    const value = control.value;

    if (required && value.length == 0) {
      return { ValidatorStringLen: true, message: 'Dado Obrigatório' };
    }
    if (!required && value.length == 0) {
      return null;
    }

    if (!required && value == null) {
      return null;
    }

    if (tamMin > 0 && value.length < tamMin) {
      message = `Campo Deverá Ter No Minimo ${tamMin} Caracteres.`;

      valido = false;
    }

    if (tamMax > 0 && value.length > tamMax) {
      message = `Campo Deverá Ter No Máximo ${tamMax} Caracteres.`;

      valido = false;
    }

    return !valido ? { ValidatorStringLen: true, message: message } : null;
  };
}
