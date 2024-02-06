import { UsuarioQuery_03Model } from 'src/app/Models/usuario-query_03-model';
import { CadastroAcoes } from './cadastro-acoes';

export class DisplayPontes {
  public checked: boolean = false;
  public acao: number = CadastroAcoes.None;
  public vazia: boolean = false;
  public ponte: UsuarioQuery_03Model = new UsuarioQuery_03Model();
}
