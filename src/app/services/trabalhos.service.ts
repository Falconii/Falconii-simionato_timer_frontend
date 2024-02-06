import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { TrabalhoQuery01 } from '../Models/trabalho-query01';
import { ParametroTrabalho01 } from '../parametros/parametro-trabalho01';
import { TrabalhoModel } from '../Models/trabalhoModel';
@Injectable({
  providedIn: 'root',
})
export class TrabalhosService {
  apiURL: string = environment.apiURL;

  constructor(private http: HttpClient) {}

  getTrabalho(
    id_empresa: number,
    id_projeto: number,
    id_atividade: number,
    id: number
  ): Observable<TrabalhoModel> {
    return this.http.get<TrabalhoModel>(
      `${this.apiURL}trabalho/${id_empresa}/${id_projeto}/${id_atividade}/${id}`
    );
  }

  getTrabalhos_01(params: ParametroTrabalho01): Observable<TrabalhoQuery01[]> {
    return this.http.post<TrabalhoQuery01[]>(
      `${this.apiURL}trabalhos/`,
      params
    );
  }

  TrabalhoInsert(trabalho: any) {
    return this.http.post<TrabalhoModel>(`${this.apiURL}trabalho/`, trabalho);
  }

  TrabalhoUpdate(trabalho: TrabalhoModel) {
    return this.http.put<TrabalhoModel>(`${this.apiURL}trabalho/`, trabalho);
  }

  TrabalhoDelete(
    id_empresa: number,
    id_projeto: number,
    id_atividade: number,
    id: number
  ) {
    return this.http.delete<TrabalhoModel>(
      `${this.apiURL}trabalho/${id_empresa}/${id_projeto}/${id_atividade}/${id}`
    );
  }
}
