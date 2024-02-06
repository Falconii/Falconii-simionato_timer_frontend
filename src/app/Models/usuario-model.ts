import { DataDDMMYYYY } from '../shared/classes/util';

export class UsuarioModel {
  public id_empresa: number = 0;
  public id: number = 0;
  public razao: string = '';
  public cnpj_cpf: string = '';
  public cadastr: string = DataDDMMYYYY(new Date());
  public rua: string = '';
  public nro: string = '';
  public complemento: string = '';
  public bairro: string = '';
  public cidade: string = '';
  public uf: string = '';
  public cep: string = '';
  public tel1: string = '';
  public tel2: string = '';
  public email: string = '';
  public senha: string = '';
  public pasta: string = '';
  public grupo: number = 0;
  public ativo: string = 'S';
  public timer: string = 'S';
  public ticket: string = 'S';
  public man_hora_entrada: string = '07:45';
  public man_hora_saida: string = '13:00';
  public tard_hora_entrada: string = '13:00';
  public tard_hora_saida: string = '17:48';
  public user_insert: number = 0;
  public user_update: number = 0;
  public gru_descricao: string = '';
}
