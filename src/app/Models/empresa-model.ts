import { DataDDMMYYYY } from '../shared/classes/util';

export class EmpresaModel {
  public id: number = 0;
  public cnpj_cpf: string = '';
  public razao: string = '';
  public fantasi: string = '';
  public inscri: string = '';
  public cadastr: string = DataDDMMYYYY(new Date());
  public ruaf: string = '';
  public nrof: string = '';
  public complementof: string = '';
  public bairrof: string = '';
  public cidadef: string = '';
  public uff: string = '';
  public cepf: string = '';
  public tel1: string = '';
  public tel2: string = '';
  public emailf: string = '';
  public obs: string = '';
  public user_insert: number = 1;
  public user_update: number = 0;
}
