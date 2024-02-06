import { AbstractControl, ValidationErrors, ValidatorFn } from '@angular/forms';

export function ValidatorCnpjCpf(required: boolean = false): ValidatorFn {
  return (control: AbstractControl): ValidationErrors | null => {
    let par = control.value;

    if (!required && par == null) {
      return null;
    }

    if (required && par.length == 0) {
      return { ValidadorCnpjCpf: true, message: 'Dado Obrigatório' };
    }

    if (!required && par.length == 0) {
      return null;
    }

    if (par.length == 11) {
      var cpf = par;

      cpf = cpf.replace(/\./g, '');
      cpf = cpf.replace('-', '');
      cpf = cpf.split('');

      var v1 = 0;
      var v2 = 0;

      var aux = false;

      for (var i = 1; cpf.length > i; i++) {
        if (cpf[i - 1] != cpf[i]) {
          aux = true;
        }
      }

      if (aux == false) {
        return { ValidadorCnpjCpf: true, message: 'CPF Inválido!' };
      }

      for (var i = 0, p = 10; cpf.length - 2 > i; i++, p--) {
        v1 += cpf[i] * p;
      }

      v1 = (v1 * 10) % 11;

      if (v1 == 10) {
        v1 = 0;
      }

      if (v1 != cpf[9]) {
        return { ValidadorCnpjCpf: true, message: 'CPF Inválido! digito' };
      }

      for (var i = 0, p = 11; cpf.length - 1 > i; i++, p--) {
        v2 += cpf[i] * p;
      }

      v2 = (v2 * 10) % 11;

      if (v2 == 10) {
        v2 = 0;
      }

      if (v2 != cpf[10]) {
        return { ValidadorCnpjCpf: true, message: 'CPF Inválido! digito' };
      } else {
        return null;
      }
    } else if (par.length == 14) {
      var cnpj = par;

      cnpj = cnpj.replace(/\./g, '');
      cnpj = cnpj.replace('-', '');
      cnpj = cnpj.replace('/', '');
      cnpj = cnpj.split('');

      var v1 = 0;
      var v2 = 0;
      var aux = false;

      for (var i = 1; cnpj.length > i; i++) {
        if (cnpj[i - 1] != cnpj[i]) {
          aux = true;
        }
      }

      if (aux == false) {
        return { ValidadorCnpjCpf: true, message: 'CNPJ Inválido!' };
      }

      for (var i = 0, p1 = 5, p2 = 13; cnpj.length - 2 > i; i++, p1--, p2--) {
        if (p1 >= 2) {
          v1 += cnpj[i] * p1;
        } else {
          v1 += cnpj[i] * p2;
        }
      }

      v1 = v1 % 11;

      if (v1 < 2) {
        v1 = 0;
      } else {
        v1 = 11 - v1;
      }

      if (v1 != cnpj[12]) {
        return { ValidadorCnpjCpf: true, message: 'CNPJ Inválido!' };
      }

      for (var i = 0, p1 = 6, p2 = 14; cnpj.length - 1 > i; i++, p1--, p2--) {
        if (p1 >= 2) {
          v2 += cnpj[i] * p1;
        } else {
          v2 += cnpj[i] * p2;
        }
      }

      v2 = v2 % 11;

      if (v2 < 2) {
        v2 = 0;
      } else {
        v2 = 11 - v2;
      }

      if (v2 != cnpj[13]) {
        return { ValidadorCnpjCpf: true, message: 'CNPJ Inválido!' };
      } else {
        return null;
      }
    } else {
      return { ValidadorCnpjCpf: true, message: 'DOCUMENTO Inválido!' };
    }

    return null;
  };
}
