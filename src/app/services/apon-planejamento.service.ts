import { ApoPlanejamentoMoldel } from 'src/app/Models/apo-planejamento-moldel';
import { Dias_Planejados } from '../shared/classes/dias-planejados';
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ParametroAgendaPlanejamento01 } from '../parametros/parametro-agenda-planejamento01';
import { ParametroAgendaPlanejamento02 } from '../parametros/parametro-agenda-planejamento02';
import { ResqPlanejamento } from '../Models/resq-planejamento';
import { ParametroAgendaPlanejamento03 } from '../parametros/parametro-agenda-planejamento03';
import { ApoPlanejamentoQuery_01Model } from '../Models/apo-planejamento-query_01-model';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root',
})
export class AponPlanejamentoService {
  constructor(private http: HttpClient) {}

  apiURL: string = environment.apiURL;

  getApoPlanejamento(
    id_empresa: number,
    id: number
  ): Observable<ApoPlanejamentoMoldel> {
    return this.http.get<ApoPlanejamentoMoldel>(
      `${this.apiURL}aponplan/${id_empresa}/${id}`
    );
  }

  getApoPlanejamentos(): Observable<ApoPlanejamentoMoldel[]> {
    return this.http.get<ApoPlanejamentoMoldel[]>(`${this.apiURL}aponplans`);
  }

  getApoPlanejamentos_01(
    params: ParametroAgendaPlanejamento01
  ): Observable<ApoPlanejamentoQuery_01Model[]> {
    return this.http.post<ApoPlanejamentoQuery_01Model[]>(
      `${this.apiURL}aponplans`,
      params
    );
  }

  getAponAgendaPlanejamentos(
    params: ParametroAgendaPlanejamento02
  ): Observable<ParametroAgendaPlanejamento02> {
    return this.http.post<ParametroAgendaPlanejamento02>(
      `${this.apiURL}aponagenda`,
      params
    );
  }

  getAponAgendaPlanejamentosV2(
    params: ParametroAgendaPlanejamento03
  ): Observable<ParametroAgendaPlanejamento03> {
    return this.http.post<ParametroAgendaPlanejamento03>(
      `${this.apiURL}aponagenda`,
      params
    );
  }

  postPlanejamento(params: ResqPlanejamento[]) {
    return this.http.post<ResqPlanejamento[]>(
      `${this.apiURL}planejamento`,
      params
    );
  }

  ApoPlanejamentoInsert(aponplanejamento: ApoPlanejamentoMoldel) {
    return this.http.post<ApoPlanejamentoMoldel>(
      `${this.apiURL}aponplan`,
      aponplanejamento
    );
  }

  ApoPlanejamentoUpdate(aponplanejamento: ApoPlanejamentoMoldel) {
    return this.http.put<ApoPlanejamentoMoldel>(
      `${this.apiURL}aponplan`,
      aponplanejamento
    );
  }

  ApoPlanejamentoDelete(id_empresa: number, id: number) {
    return this.http.delete<ApoPlanejamentoMoldel>(
      `${this.apiURL}aponplan/${id_empresa}/${id}`
    );
  }
}
