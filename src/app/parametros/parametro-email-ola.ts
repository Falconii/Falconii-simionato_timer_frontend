import { UserEmail } from '../shared/classes/User-Email';

export class ParametroEmailOla {
  public id_empresa: number = 0;
  public users: UserEmail[] = [];
  public mensagem: string = '';
  public html: string = '';
}
