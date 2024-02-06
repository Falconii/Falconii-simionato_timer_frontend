import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { ParametroModel } from '../Models/parametro-model';
import { Observable } from 'rxjs';
import { ParametroParametro01 } from '../parametros/parametro-parametro01';

@Injectable({
  providedIn: 'root',
})
export class ParametrosService {
  apiURL: string = environment.apiURL;

  constructor(private http: HttpClient) {}

  getParametros(): Observable<ParametroModel[]> {
    return this.http.get<ParametroModel[]>(`${this.apiURL}parametros`);
  }

  getParametrosParametro01(
    params: ParametroParametro01
  ): Observable<ParametroModel[]> {
    return this.http.post<ParametroModel[]>(`${this.apiURL}parametros`, params);
  }

  getParametro(
    id_empresa: number,
    modulo: string,
    assinatura: string,
    id_usuario: number
  ) {
    return this.http.get<ParametroModel>(
      `${this.apiURL}parametro/${id_empresa}/${modulo}/${assinatura}/${id_usuario}`
    );
  }

  ParametroInsert(parametro: ParametroModel) {
    return this.http.post<ParametroModel>(
      `${this.apiURL}parametro/`,
      parametro
    );
  }

  ParametroUpdate(parametro: ParametroModel) {
    return this.http.put<ParametroModel>(`${this.apiURL}parametro/`, parametro);
  }

  ParametroAtualiza(parametro: ParametroModel) {
    return this.http.post<ParametroModel>(
      `${this.apiURL}atualizarparametro/`,
      parametro
    );
  }

  ParametroDelete(
    id_empresa: number,
    modulo: string,
    assinatura: string,
    id_usuario: number
  ) {
    return this.http.delete<ParametroModel>(
      `${this.apiURL}parametro/${id_empresa}/${modulo}/${assinatura}/${id_usuario}`
    );
  }
}
