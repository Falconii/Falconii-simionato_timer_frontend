import { AbstractControl, ValidationErrors, ValidatorFn } from '@angular/forms';
import { DataYYYYMMDD, ddmmaaaatoaaaammdd } from '../classes/util';

export function ValidatorDate(required: boolean = false): ValidatorFn {
  return (control: AbstractControl): ValidationErrors | null => {
    let message = '';

    let valido = true;

    const value = control.value;

    if (value == null) {
      if (required) return { ValidatorDate: true, message: 'Data Obrigatória' };
      return null;
    }

    if (required && value.length == 0) {
      return { ValidatorDate: true, message: 'Data Obrigatória' };
    }
    if (!required && value.length == 0) {
      return null;
    }
    try {
      var parsedDate = Date.parse(
        ddmmaaaatoaaaammdd(value) + ' 00:00:00 GMT-0300'
      );

      if (isNaN(value) && !isNaN(parsedDate)) {
        var dt = new Date(parsedDate);
        if (ddmmaaaatoaaaammdd(value) == DataYYYYMMDD(dt)) {
          valido = true;
        } else {
          valido = false;
          message = 'Data Inválida';
        }
      } else {
        valido = false;
        message = 'Data Inválida';
      }
    } catch (Ex) {
      valido = false;
      message = 'Data Inválida';
    }

    return !valido ? { ValidatorDate: true, message: message } : null;
  };
}
