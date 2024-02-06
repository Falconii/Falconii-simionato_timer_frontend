import { ApoExecucaoModel } from '../../Models/apo-execucao-model';
import { Movimento } from '../../Models/movimento';
import { MoviData } from '../../Models/movi-data';
import { Dias_Planejados } from './dias-planejados';
import { ErrorIntervalo } from './error-intervalo';
import { Intervalo } from './intervalo';

export function DataYYYYMMDD(value: Date): string {
  let d: Date = new Date(value),
    month = '' + (d.getMonth() + 1),
    day = '' + d.getDate(),
    year = d.getFullYear();
  if (month.length < 2) month = '0' + month;
  if (day.length < 2) day = '0' + day;

  return [year, month, day].join('-');
}

export function DataDDMMYYYY(value: Date): string {
  let d: Date = new Date(value),
    month = '' + (d.getMonth() + 1),
    day = '' + d.getDate(),
    year = d.getFullYear();

  if (month.length < 2) month = '0' + month;
  if (day.length < 2) day = '0' + day;

  return [day, month, year].join('/');
}

/*
exports Date.prototype.yyyymmdd = function() {
  var mm = this.getMonth() + 1; // getMonth() is zero-based
  var dd = this.getDate();

  return [this.getFullYear(),
          (mm>9 ? '' : '0') + mm,
          (dd>9 ? '' : '0') + dd
         ].join('');
};

*/
export function DataYYYYMMDDTHHMMSSZ(value: Date): string {
  let d: Date = new Date(value),
    month = '' + (d.getMonth() + 1),
    day = '' + d.getDate(),
    year = '' + d.getFullYear(),
    hora = '' + d.getHours(),
    min = '' + d.getMinutes(),
    seg = '' + d.getSeconds();

  if (month.length < 2) month = '0' + month;
  if (day.length < 2) day = '0' + day;
  if (hora.length < 2) hora = '0' + hora;
  if (min.length < 2) min = '0' + min;
  if (seg.length < 2) seg = '0' + seg;
  return (
    [year, month, day].join('-') + 'T' + [hora, min, seg].join(':') + '.000Z'
  );
}

export function nextCode(value: string): string {
  let base: string = value.substring(0, 3);
  let chave: string = value.substring(3);
  let nro: number = 0;
  let retorno = '';
  try {
    nro = parseInt(chave) + 1;
    retorno = '000' + nro.toString();
    retorno = retorno.substring(retorno.length - 3);
    retorno = base + retorno;
  } catch (err) {
    console.log('Problemas Com Chave', value);
  }

  return retorno;
}

export class MensagensBotoes {
  static incluir: string = 'Novo Registro';
  static alterar: string = 'Alterar Registro';
  static consultar: string = 'Consultar registro';
  static excluir: string = 'Excluir Registro';
  static tarefas_incluir = 'Manutenção Das Tarefas';
  static trabalhos_incluir = 'Manutenção Dos Trabalhos';
  static planejamentos_manutencao = 'Manutenção Dos Planejamentos';
  static sub_conta = 'Acesso As SubContas.';
  static financeiro = 'Financeiro';
  static multi_edicao = 'Alteração Em Lote';
}

export function DiasUteis(Inicial: string, Final: string): Dias_Planejados[] {
  let retorno: Dias_Planejados[] = [];

  let x = 0;

  const date1 = new Date(Inicial);

  const date2 = new Date(Final);

  date1.setHours(0);
  date1.setMinutes(0);

  date2.setHours(0);
  date2.setMinutes(0);

  // One day in milliseconds
  const oneDay = 1000 * 60 * 60 * 24;

  // Calculating the time difference between two dates
  const diffInTime = date2.getTime() - date1.getTime();

  // Calculating the no. of days between two dates
  const diffInDays = Math.round(diffInTime / oneDay);

  for (x = 0; x <= diffInDays; x++) {
    const proxima = new Dias_Planejados();
    proxima.data.setDate(date1.getDate() + x);
    //proxima.data_ = proxima.data.toISOString();
    //proxima.data_ = proxima.data.toLocaleDateString('pt-BR', {
    //  timeZone: 'UTC',
    //});
    proxima.data_ = DataYYYYMMDD(proxima.data);
    proxima.manha = '0';
    proxima.tarde = '0';
    if (proxima.data.getDay() != 6 && proxima.data.getDay() != 0) {
      retorno.push(proxima);
    }
  }
  return retorno;
}

export function DiasUteisV2(
  Inicial: string,
  Final: string,
  id_exec: number
): MoviData[] {
  let retorno: MoviData[] = [];

  let x = 0;

  let date1 = new Date(Inicial + 'T00:00:00');

  let date2 = new Date(Final + 'T00:00:00');

  date1.setHours(0);
  date1.setMinutes(0);

  date2.setHours(0);
  date2.setMinutes(0);

  const addDays = (date: Date, days: number): Date => {
    let result = new Date(date);
    result.setDate(result.getDate() + days);
    return result;
  };

  // One day in milliseconds
  const oneDay = 1000 * 60 * 60 * 24;

  // Calculating the time difference between two dates
  const diffInTime = date2.getTime() - date1.getTime();

  // Calculating the no. of days between two dates
  const diffInDays = Math.round(diffInTime / oneDay);

  for (x = 1; x <= diffInDays + 1; x++) {
    const date: Date = new Date(Inicial + 'T00:00:00.000Z');
    const result: Date = addDays(date, x);
    const proxima = new MoviData();
    result.setHours(0);
    result.setMinutes(0);
    proxima.movimentos = [];
    proxima.id_exec = id_exec;
    proxima.data = new Date(result.toISOString());
    proxima.data.setHours(0);
    proxima.data.setMinutes(0);
    proxima.data_ = DataYYYYMMDD(proxima.data);
    if (proxima.data.getDay() != 6 && proxima.data.getDay() != 0) {
      retorno.push(proxima);
    }
  }
  return retorno;
}

export function adicionaZero(numero: number) {
  if (numero <= 9) return '0' + numero;
  else return '' + numero;
}

export function formatarData(date: any): string {
  if (date == null) {
    return '';
  }

  if (typeof date === 'string') {
    return date;
  } else {
    let data = new Date(date);
    return data.toLocaleDateString('pt-BR', { timeZone: 'UTC' });
  }
}

export function formatDateHour(date: Date) {
  return date;
}

export function DifHoras(Inicial: string, Final: string): number {
  let retorno: Dias_Planejados[] = [];

  let x = 0;

  const date1 = new Date(Inicial);

  const date2 = new Date(Final);

  // One day in milliseconds
  const oneMin = 1000 * 60;

  // Calculating the time difference between two dates
  const diffInTime = date2.getTime() - date1.getTime();

  // Calculating the no. of days between two dates
  const diffInDays = Math.round(diffInTime / oneMin);

  return diffInDays;
}

export function hhmm(minutos: number): string {
  const str = (minutos / 60).toString();

  const parte = str.split('.');

  const horas = parseInt(parte[0]);

  const min = minutos - horas * 60;

  let hora = '' + horas.toString();

  let minu = '' + min.toString();

  if (hora.length < 2) hora = '0' + hora;

  if (minu.length < 2) minu = '0' + minu;

  return hora + ':' + minu;
}

export function minutostostohorasexagenal(minutos: number): number {
  const str = (minutos / 60).toString();

  const parte = str.split('.');

  const horas = parseInt(parte[0]);

  let min = minutos - horas * 60;

  min = Number.parseInt((min * 1.67).toFixed(0)) / 100;

  return horas + min;
}

export function horahexa(value: number): string {
  let numero: string = Number(value).toFixed(2);
  let horas: string = numero.substring(0, numero.indexOf('.'));
  let minutos: string = numero.substring(numero.indexOf('.') + 1);
  minutos = '00' + (Number.parseInt(minutos) / 1.67).toFixed(0).trim();
  minutos = minutos.substring(minutos.length - 2);
  if (minutos.length < 2) minutos = '0' + minutos;
  return horas + ':' + minutos;
}

export function setHorario(
  value: Date,
  horas: string,
  minutos: string
): string {
  let retorno: string = '';
  let dt = new Date(value);
  retorno = setDBtoAngularGMT(`${DataYYYYMMDD(dt)} ${horas}:${minutos}:00`);
  return retorno;
}

export function getHora(hora: string): string {
  let retorno: string = '00';
  retorno = hora.split(':')[0];
  return retorno;
}

export function getMinuto(hora: string): string {
  let retorno: string = '00';
  retorno = hora.split(':')[1];
  return retorno;
}

export function setDBtoAngular(value: string): string {
  let retorno = '';
  retorno = value.replace(' ', 'T') + '.000Z';
  return retorno;
}

export function setDBtoAngularGMT(value: string): string {
  let retorno = '';
  retorno = value + ' GMT-0300';
  return retorno;
}

export function populaIntervalo(
  movimentos: Movimento[],
  id_lanca: number
): Intervalo[] {
  let retorno: Intervalo[] = [];
  movimentos.forEach((movi) => {
    if (movi.id !== id_lanca) {
      const hinicial = movi.inicial
        .substring(movi.inicial.indexOf(' ') + 1, 16)
        .split(':');
      const hfinal = movi.final
        .substring(movi.final.indexOf(' ') + 1, 16)
        .split(':');

      const horasi = parseInt(hinicial[0]) * 60;
      const minutosi = parseInt(hinicial[1]);
      const horasf = parseInt(hfinal[0]) * 60;
      const minutosf = parseInt(hfinal[1]);
      const descri =
        hinicial[0] + ':' + hinicial[1] + ' às ' + hfinal[0] + ':' + hfinal[1];
      const inter: Intervalo = new Intervalo();
      inter.descricao = descri;
      inter.inicio = horasi + minutosi;
      inter.final = horasf + minutosf;
      retorno.push(inter);
    }
  });
  return retorno;
}

export function populaIntervalo2(
  movimentos: ApoExecucaoModel[],
  id_lanca: number
): Intervalo[] {
  let retorno: Intervalo[] = [];
  movimentos.forEach((movi) => {
    if (movi.id !== id_lanca) {
      const hinicial = movi.inicial
        .substring(movi.inicial.indexOf(' ') + 1, 16)
        .split(':');
      const hfinal = movi.final
        .substring(movi.final.indexOf(' ') + 1, 16)
        .split(':');

      const horasi = parseInt(hinicial[0]) * 60;
      const minutosi = parseInt(hinicial[1]);
      const horasf = parseInt(hfinal[0]) * 60;
      const minutosf = parseInt(hfinal[1]);
      const descri =
        hinicial[0] + ':' + hinicial[1] + ' às ' + hfinal[0] + ':' + hfinal[1];
      const inter: Intervalo = new Intervalo();
      inter.descricao = descri;
      inter.inicio = horasi + minutosi;
      inter.final = horasf + minutosf;
      retorno.push(inter);
    }
  });
  return retorno;
}

export function validaIntervalo(
  intervalos: Intervalo[],
  inicio: string,
  final: string
) {
  try {
    const hinicial = inicio.split(':');
    const hfinal = final.split(':');
    const horasi = parseInt(hinicial[0]) * 60;
    const minutosi = parseInt(hinicial[1]);
    const horasf = parseInt(hfinal[0]) * 60;
    const minutosf = parseInt(hfinal[1]);
    const inicial = horasi + minutosi;
    const fim = horasf + minutosf;
    let erro: Boolean = false;
    let descricao: string = '';

    for (let x = 0; x < intervalos.length; x++) {
      if (inicial > intervalos[x].inicio && inicial < intervalos[x].final) {
        erro = true;
        descricao = intervalos[x].descricao;
      }
      if (fim > intervalos[x].inicio && fim < intervalos[x].final) {
        erro = true;
        descricao = intervalos[x].descricao;
      }
    }
    if (erro) throw new ErrorIntervalo(descricao);
  } catch (err) {
    throw err;
  }
  return;
}

export function ddmmaaaatoaaaammdd(dt: string): string {
  var data = dt.split('/');

  return [data[2], data[1], data[0]].join('-');
}

export function aaaammddddmmaaaa(dt: string): string {
  var data = dt.substring(0, 10).split('-');

  return [data[2], data[1], data[0]].join('/');
}

export function getFirstName(value: string): string {
  const nomes = value.split(' ');
  return nomes[0];
}

export function messageError(value: any): string {
  var retorno = '';
  if (value.name == 'HttpErrorResponse' && value.tabela === 'undefined') {
    retorno += ` ${value.message}\n${value.url} `;
  } else {
    if (!(typeof value.error === 'undefined')) {
      retorno += `${value.error.message} `;
    } else {
      if (!(typeof value.tabela === 'undefined')) {
        retorno += `${value.tabela} `;
      }

      if (!(typeof value.erro === 'undefined')) {
        retorno += `${value.erro} `;
      }

      if (!(typeof value.message === 'undefined')) {
        retorno += `${value.message} `;
      }
    }
  }
  if (retorno.length == 0) retorno = value;

  return retorno;
}

export function getfirstName(name: string): string {
  return getFirstName(name);
}

export function getSituacoesProjeto(): SituacaoProjeto[] {
  const retorno: SituacaoProjeto[] = [];
  retorno.push(new SituacaoProjeto(-1, 'TODAS'));
  retorno.push(new SituacaoProjeto(0, 'Proposta'));
  retorno.push(new SituacaoProjeto(1, 'Em Aberto'));
  retorno.push(new SituacaoProjeto(2, 'Em Andamento'));
  retorno.push(new SituacaoProjeto(3, 'Encerrado'));
  retorno.push(new SituacaoProjeto(4, 'Suspenso'));
  retorno.push(new SituacaoProjeto(5, 'Cancelado'));
  return retorno;
}

export class SituacaoProjeto {
  public idx: number = 0;
  public descricao: string = '';

  constructor(idx: number, descricao: string) {
    this.idx = idx;
    this.descricao = descricao;
  }
}

export function GetValueJsonNumber(obj: JSON, tag: string): number {
  const retorno = Object(obj)[tag];
  return retorno;
}

export function GetValueJsonString(obj: JSON, tag: string): string {
  const retorno = Object(obj)[tag];
  return retorno;
}

export function GetValueJsonStringArray(obj: JSON, tag: string): string[] {
  const retorno = Object(obj)[tag];
  return retorno;
}

export function GetValueJsonBoolean(obj: JSON, tag: string): boolean {
  const retorno = Object(obj)[tag];
  return retorno;
}
