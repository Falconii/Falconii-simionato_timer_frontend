import { ApoExecucaoModel } from 'src/app/Models/apo-execucao-model';

export class ApoExecData {
  public processar: boolean = false;
  public opcao: number = 0;
  public apontamento: ApoExecucaoModel = new ApoExecucaoModel();
}
