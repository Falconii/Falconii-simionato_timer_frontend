import { AtividadeQuery_01Model } from "./atividade-query_01-model";
import { ProjetoModel } from "./projeto-model";

export class ConsultaMod01 {
  public projeto:ProjetoModel = new ProjetoModel();
  public atividades:AtividadeQuery_01Model[] = [];
}

