export class ParametroTrabalho01 {
  public id_empresa: number = 0;
  public id_projeto: number = 0;
  public id_atividade: number = 0;
  public id: number = 0;
  public id_responsavel: number = 0;
  public id_cliente: number = 0;
  public descricao: string = '';
  public situacao: string = '';
  public pagina: number = 1;
  public tamPagina: number = 50;
  public contador: string = 'N';
  public orderby: string = '';
  public sharp: Boolean = false;
}
