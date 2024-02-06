import { FeriadoModel } from '../Models/feriado-model';
import { CadastroAcoes } from '../shared/classes/cadastro-acoes';

export class ParametroAlterPonte {
  public acao: CadastroAcoes = CadastroAcoes.None;
  public feriado: FeriadoModel = new FeriadoModel();
}
