export class AuditorModel {
  public id_empresa: number = 0;
  public id: number = 0;
  public id_projeto: number = 0;
  public conta: string = '';
  public subconta: string = '';
  public nivel: number = 0;
  public tipo: string = '';
  public id_resp: number = 0;
  public id_exec: number = 0;
  public id_subcliente: number = 0;
  public inicial: Date = new Date();
  public final: Date = new Date();
  public horasplan: number = 0;
  public horasexec: number = 0;
  public obs: string = '';
  public user_insert: number = 0;
  public user_update: number = 0;
  public proj_descri: string = '';
  public estru_descri: string = '';
  public exec_razao: string = '';
  public resp_razao: string = '';
}
