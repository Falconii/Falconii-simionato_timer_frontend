import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { FeriadoModel } from '../Models/feriado-model';
import { ParametroFeriado01 } from '../parametros/parametro-feriado01';
import { FeriadoPonteModel } from '../Models/feriado-ponte-model';
import { ParametroAlterPonte } from '../parametros/parametro-alter-ponte';

@Injectable({
  providedIn: 'root',
})
export class FeriadosService {
  apiURL: string = environment.apiURL;

  constructor(private http: HttpClient) {}

  getFeriados(): Observable<FeriadoModel[]> {
    return this.http.get<FeriadoModel[]>(`${this.apiURL}feriados`);
  }

  getFeriado(
    id_empresa: number,
    id_usuario: number,
    id_tipo: number,
    data: string
  ): Observable<FeriadoModel> {
    return this.http.get<FeriadoModel>(
      `${this.apiURL}feriado/${id_empresa}/${id_usuario}/${id_tipo}?data=${data}`
    );
  }

  getFeriados_01(params: ParametroFeriado01): Observable<FeriadoModel[]> {
    return this.http.post<FeriadoModel[]>(`${this.apiURL}feriados`, params);
  }

  getPontes_01(params: ParametroFeriado01): Observable<FeriadoPonteModel[]> {
    return this.http.post<FeriadoPonteModel[]>(
      `${this.apiURL}feriados`,
      params
    );
  }

  FeriadoInsert(feriado: FeriadoModel) {
    return this.http.post<FeriadoModel>(`${this.apiURL}feriado/`, feriado);
  }

  FeriadoinsertAllFeriados(feriados: FeriadoModel[]) {
    return this.http.post<any>(`${this.apiURL}insert_all_feriados/`, feriados);
  }

  FeriadoAllPontes(pontes: FeriadoModel[]) {
    return this.http.post<any>(`${this.apiURL}allpontes/`, pontes);
  }

  FeriadoUpdate(feriado: FeriadoModel) {
    return this.http.put<FeriadoModel>(`${this.apiURL}feriado/`, feriado);
  }

  FeriadoAlterPontes(params: ParametroAlterPonte[]) {
    return this.http.post<any>(`${this.apiURL}alterpontes/`, params);
  }

  FeriadoAlterPonteDescricao(params: FeriadoPonteModel) {
    return this.http.put<any>(`${this.apiURL}alterpontedescricao/`, params);
  }

  FeriadoDelete(
    id_empresa: number,
    id_usuario: number,
    id_tipo: number,
    data: string
  ): Observable<FeriadoModel> {
    return this.http.delete<any>(
      `${this.apiURL}feriado/${id_empresa}/${id_usuario}/${id_tipo}/${data}`
    );
  }

  PonteDelete(id_empresa: number, data: string): Observable<FeriadoModel> {
    return this.http.delete<any>(`${this.apiURL}ponte/${id_empresa}/${data}`);
  }
}
