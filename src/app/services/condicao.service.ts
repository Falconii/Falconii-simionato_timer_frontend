import { CondicoesPagtoModel } from './../Models/condicoes_pagtoModel';
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ParametroCondicao01 } from '../parametros/parametro-condicao01';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root',
})
export class CondicaoService {
  apiURL: string = environment.apiURL;

  constructor(private http: HttpClient) {}

  getCondicoes(): Observable<CondicoesPagtoModel[]> {
    return this.http.get<CondicoesPagtoModel[]>(`${this.apiURL}condicoes`);
  }

  getCondicoes_01(
    params: ParametroCondicao01
  ): Observable<CondicoesPagtoModel[]> {
    return this.http.post<CondicoesPagtoModel[]>(
      `${this.apiURL}condicoes`,
      params
    );
  }

  getCondicao(id_empresa: number, id: number): Observable<CondicoesPagtoModel> {
    return this.http.get<CondicoesPagtoModel>(
      `${this.apiURL}condicao/${id_empresa}/${id}`
    );
  }

  CondicaoInsert(cond: any) {
    return this.http.post<CondicoesPagtoModel>(`${this.apiURL}condicao/`, cond);
  }

  CondicaoUpdate(cond: CondicoesPagtoModel) {
    return this.http.put<CondicoesPagtoModel>(`${this.apiURL}condicao/`, cond);
  }

  CondicaoDelete(id_empresa: number, id: number) {
    return this.http.delete<CondicoesPagtoModel>(
      `${this.apiURL}condicao/${id_empresa}/${id}`
    );
  }
}
