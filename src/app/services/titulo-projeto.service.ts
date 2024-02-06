import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { TituloProjetoModel } from '../Models/titulo-projetoModel';
import { ParametroTituloProjeto01 } from '../parametros/parametro-titulo-projeto01';

@Injectable({
  providedIn: 'root',
})
export class TituloProjetoService {
  apiURL: string = environment.apiURL;

  constructor(private http: HttpClient) {}

  getTitulosProjeto(): Observable<TituloProjetoModel[]> {
    return this.http.get<TituloProjetoModel[]>(`${this.apiURL}projetos`);
  }

  getTitulosProjeto_01(
    params: ParametroTituloProjeto01
  ): Observable<TituloProjetoModel[]> {
    return this.http.post<TituloProjetoModel[]>(
      `${this.apiURL}titulosprojeto`,
      params
    );
  }

  getTituloProjeto(
    id_empresa: number,
    id_projeto: number,
    data_vencto: string
  ) {
    return this.http.get<TituloProjetoModel>(
      `${this.apiURL}titulo_projeto/${id_empresa}/${id_projeto}/${data_vencto}`
    );
  }

  TituloProjetoInsert(titulo: TituloProjetoModel) {
    return this.http.post<TituloProjetoModel>(
      `${this.apiURL}titulo_projeto/`,
      titulo
    );
  }

  TituloProjetoUpdate(projeto: TituloProjetoModel) {
    return this.http.put<TituloProjetoModel>(
      `${this.apiURL}titulo_projeto/`,
      projeto
    );
  }

  TituloProjetoDelete(
    id_empresa: number,
    id_projeto: number,
    data_vencto: string
  ) {
    return this.http.delete<TituloProjetoModel>(
      `${this.apiURL}titulo_projeto/${id_empresa}/${id_projeto}/${data_vencto}`
    );
  }

  tituloProjetoSaveAll(titulos: TituloProjetoModel[]) {
    return this.http.post<TituloProjetoModel[]>(
      `${this.apiURL}titulo_projeto_save_all/`,
      titulos
    );
  }
}
