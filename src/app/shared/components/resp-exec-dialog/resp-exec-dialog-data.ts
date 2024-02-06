import { UsuarioQuery01Model } from 'src/app/Models/usuario-query_01-model';

export class RespExecDialogData {
  public titulo: string = '';
  public texto: string = '';
  public usuarios: UsuarioQuery01Model[] = [];
  public id_usuario: number = 0;
  public processar: boolean = false;
  public justificativa: string = '';
  public dataHota: Date = new Date();
  public usuarioNome: String = '';
  public temJustificativa: boolean = true;
}
