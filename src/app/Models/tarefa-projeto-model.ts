export class TarefaProjetoModel {
  public id_empresa: number = 0;
  public id: number = 0;
  public id_projeto: number = 0;
  public id_tarefa: string = '';
  public id_resp: number = 0;
  public seq: number = 0;
  public inicial: Date = new Date();
  public final: Date = new Date();
  public obs: string = '';
  public horasplan: number = 0;
  public horasexec: number = 0;
  public status: string = '';
  public user_insert: number = 0;
  public user_update: number = 0;
  public projeto_data_proposta: Date = new Date();
  public projeto_data_projeto: Date = new Date();
  public projeto_data_enc: Date = new Date();
  public diretor_id: number = 0;
  public cliente_id: number = 0;
  public diretor_razao: string = '';
  public resp_razao: string = '';
  public cli_razao: string = '';
  public tarefa_descricao: string = '';
}
