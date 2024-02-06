import { ParametroProjetoValor01 } from './../parametros/parametro-projeto-valor01';
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { ProjetoValorModel } from '../Models/projeto-valorModel';

@Injectable({
  providedIn: 'root',
})
export class ProjetoValorService {
  apiURL: string = environment.apiURL;

  constructor(private http: HttpClient) {}

  getProValor(id_empresa: number, id: number): Observable<ProjetoValorModel> {
    return this.http.get<ProjetoValorModel>(
      `${this.apiURL}pro_valor/${id_empresa}/${id}`
    );
  }

  getProValores(): Observable<ProjetoValorModel[]> {
    return this.http.get<ProjetoValorModel[]>(`${this.apiURL}pro_valores`);
  }

  getProValores_01(
    params: ParametroProjetoValor01
  ): Observable<ProjetoValorModel[]> {
    return this.http.post<ProjetoValorModel[]>(
      `${this.apiURL}pro_valores`,
      params
    );
  }

  ProjetoValorInsert(cond: any) {
    return this.http.post<ProjetoValorModel>(`${this.apiURL}pro_valor/`, cond);
  }

  ProjetoValorUpdate(cond: ProjetoValorModel) {
    return this.http.put<ProjetoValorModel>(`${this.apiURL}pro_valor/`, cond);
  }

  ProjetoValorDelete(id_empresa: number, id: number) {
    return this.http.delete<ProjetoValorModel>(
      `${this.apiURL}pro_valor/${id_empresa}/${id}`
    );
  }
}
