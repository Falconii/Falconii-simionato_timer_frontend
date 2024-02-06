import { UsuarioQuery01Model } from 'src/app/Models/usuario-query_01-model';

export class RespAudiData {
  public executores: UsuarioQuery01Model[] = [];
  public id_resp: number = -1;
  public id_exec: number = -1;
  public desconsiderar_resp: boolean = true;
  public desconsiderar_exec: boolean = true;
  public processar: boolean = false;
}
