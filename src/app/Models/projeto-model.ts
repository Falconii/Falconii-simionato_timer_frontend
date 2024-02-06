import { DataDDMMYYYY } from '../shared/classes/util';

export class ProjetoModel {
  public id_empresa: number = 0;
  public id: number = 0;
  public id_cliente: number = 0;
  public id_diretor: number = 0;
  public dataprop: string = DataDDMMYYYY(new Date());
  public dataproj: string = DataDDMMYYYY(new Date());
  public dataenc: string = DataDDMMYYYY(new Date());
  public descricao: string = '';
  public horasve: number = 1;
  public horasplan: number = 0;
  public horasexec: number = 0;
  public horasdir: number = 0;
  public status: string = '';
  public status_pl: string = '';
  public status_ex: string = '';
  public id_tipo: number = 1;
  public objeto: string = '';
  public obs: string = '';
  public reajuste: string = DataDDMMYYYY(new Date());
  public valor: number = 0;
  public id_cond_pgto: number = 0;
  public id_contrato: number = 0;
  public id_parceira: number = 2;
  public assinatura: string = DataDDMMYYYY(new Date());
  public user_insert: number = 0;
  public user_update: number = 0;
  public diretor_razao: string = '';
  public cliente_razao: string = '';
  public cliente_gru_econo: number = 0;
  public nivelplan: number = -1;
  public nivelexec: number = -1;
  public tem_atividade: string = '';
}
