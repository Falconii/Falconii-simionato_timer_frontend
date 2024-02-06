import { DataDDMMYYYY } from '../shared/classes/util';

export class ClientesModel {
  public id_empresa: number = 0;
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
  public gru_econo: number = 0;
  public gru_descricao: string = '';
  public user_insert: number = 0;
  public user_update: number = 0;
}
