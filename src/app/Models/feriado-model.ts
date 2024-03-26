import { ApoExecucaoModel } from './apo-execucao-model';

export class FeriadoModel {
  public id_empresa: number = 0;
  public id_usuario: number = 0;
  public id_tipo: number = 1;
  public data: string = '';
  public id_nivel: number = 0;
  public descricao: string = '';
  public conta: string = '';
  public versao: string = '';
  public subconta: string = '';
  public user_insert: number = 0;
  public user_update: number = 0;
  public lancamento01: ApoExecucaoModel = new ApoExecucaoModel();
  public lancamento02: ApoExecucaoModel = new ApoExecucaoModel();
  public usu_nome: string = '';
  public conta_descricao: string = '';
  public subconta_descricao: string = '';
  public atividade_descricao: string = '';
}
