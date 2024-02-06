import { AbstractControl, ValidationErrors, ValidatorFn } from '@angular/forms';

export function ValidatorCep(required: boolean = false): ValidatorFn {
  return (control: AbstractControl): ValidationErrors | null => {
    const value = control.value;

    if (!required && value == null) {
      return null;
    }

    if (required && value == null) {
      return { ValidatorCep: true, message: 'Dado Obrigatório' };
    }

    if (required && value.length == 0) {
      return { ValidatorCep: true, message: 'Dado Obrigatório' };
    }
    if (!required && value.length == 0) {
      return null;
    }

    if (!required && value == null) {
      return null;
    }

    const validaCep = /^[0-9]{8}$/;

    return !validaCep.test(value)
      ? { ValidatorCep: true, message: 'CEP Inválido!' }
      : null;
  };
}
