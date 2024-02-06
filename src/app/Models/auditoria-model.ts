import { DataYYYYMMDDTHHMMSSZ } from '../shared/classes/util';

export class AuditoriaModel {
  public id_empresa: number = 0;
  public id: number = 0;
  public tabela: string = '';
  public campo: string = '';
  public chave: string = '';
  public old_data: string = '';
  public new_data: string = '';
  public data: string = '';
  public descricao: string = '';
  public user_insert: number = 0;
  public user_update: number = 0;
  public user_name: string = '';
}
