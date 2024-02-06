import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { AtividadeHorasDirModel } from '../Models/atividade-horas-dir-model';
import { AtividadeModel } from '../Models/atividade-model';
import { AtividadeQuery_01Model } from '../Models/atividade-query_01-model';
import { ParametroAtividade01 } from '../parametros/parametro-atividade01';
import { ParametroAtividade02 } from '../parametros/parametro-atividade02';
import { DisplayAtividadeV2 } from '../shared/classes/DisplayAtividadeV2';

@Injectable({
  providedIn: 'root',
})
export class AtividadesService {
  apiURL: string = environment.apiURL;

  constructor(private http: HttpClient) {}

  getAtividades(): Observable<AtividadeModel[]> {
    return this.http.get<AtividadeModel[]>(`${this.apiURL}atividades`);
  }

  getAtividades_01(
    params: ParametroAtividade01
  ): Observable<AtividadeQuery_01Model[]> {
    return this.http.post<AtividadeQuery_01Model[]>(
      `${this.apiURL}atividades`,
      params
    );
  }

  getAtividades_02(
    params: ParametroAtividade02
  ): Observable<AtividadeQuery_01Model[]> {
    return this.http.post<AtividadeQuery_01Model[]>(
      `${this.apiURL}atividadesvazia`,
      params
    );
  }
  getAtividade(id_empresa: number, id: number) {
    return this.http.get<AtividadeModel>(
      `${this.apiURL}atividade/${id_empresa}/${id}`
    );
  }

  atividadeInsert(atividade: any) {
    return this.http.post<AtividadeModel>(`${this.apiURL}atividade`, atividade);
  }

  atividadeUpdate(atividade: AtividadeModel) {
    return this.http.put<AtividadeModel>(`${this.apiURL}atividade`, atividade);
  }

  atividadeUpdateHoraDir(atividadeHorasDir: AtividadeHorasDirModel) {
    return this.http.put<AtividadeHorasDirModel>(
      `${this.apiURL}updateAtividadehorasdir`,
      atividadeHorasDir
    );
  }

  atividadeDelete(
    id_empresa: number,
    id_projeto: number,
    conta: string,
    versao: string,
    subconta: string
  ) {
    return this.http.delete<AtividadeModel>(
      `${this.apiURL}atividade/${id_empresa}/${id_projeto}/${conta}/${versao}/${subconta}`
    );
  }

  anexaatividade(
    id_empresa: number,
    conta: string,
    versao: string,
    id_projeto: number,
    id_exec: number,
    id_resp: number
  ) {
    return this.http.get<any>(
      `${this.apiURL}anexaatividade/${id_empresa}/${conta}/${versao}/${id_projeto}/${id_exec}/${id_resp}`
    );
  }

  anexaatividadev2(atividades: DisplayAtividadeV2[]) {
    return this.http.post<any>(`${this.apiURL}anexaatividadev2`, atividades);
  }

  desanexaatividade(
    id_empresa: number,
    conta: string,
    versao: string,
    id_projeto: number
  ) {
    return this.http.get<any>(
      `${this.apiURL}desanexaatividade/${id_empresa}/${conta}/${versao}/${id_projeto}`
    );
  }

  desanexasubconta(
    id_empresa: number,
    id_projeto: number,
    id_conta: string,
    id_conta_versao: string,
    id_subconta: string,
    nivel: number
  ) {
    return this.http.get<any>(
      `${this.apiURL}desanexasubconta/${id_empresa}/${id_projeto}/${id_conta}/${id_conta_versao}/${id_subconta}/${nivel}`
    );
  }
}
