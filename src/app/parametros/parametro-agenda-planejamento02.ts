import { Dias_Planejados } from '../shared/classes/dias-planejados';
export class ParametroAgendaPlanejamento02 {
  public id_empresa: number = 0;
  public id_projeto: number = 0;
  public id_tarefa: string = '';
  public id_trabalho: string = '';
  public id_exec: number = 0;
  public agenda: Dias_Planejados[] = [];
}
