import { Movimento } from './movimento';
export class MoviData {
  public data: Date = new Date();
  public data_: string = '';
  public id_exec: number = 0;
  public movimentos: Movimento[] = [];
}
