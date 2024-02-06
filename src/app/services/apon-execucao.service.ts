import { ApoExecucaoModel01 } from './../Models/apo-execucao-model01';
import { ParametroAponExecucao01 } from './../parametros/parametro-apon-execucao01';
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ApoExecucaoModel } from '../Models/apo-execucao-model';
import { environment } from 'src/environments/environment';
import { AponExecutorModel } from '../Models/apon-executor-model';

@Injectable({
  providedIn: 'root',
})
export class AponExecucaoService {
  apiURL: string = environment.apiURL;

  constructor(private http: HttpClient) {}

  getApoExecucao(id_empresa: number, id: number): Observable<ApoExecucaoModel> {
    return this.http.get<ApoExecucaoModel>(
      `${this.apiURL}aponexec/${id_empresa}/${id}`
    );
  }
  getApoExecucaos(): Observable<ApoExecucaoModel[]> {
    return this.http.get<ApoExecucaoModel[]>(`${this.apiURL}aponexec`);
  }

  getApoExecucoes_01(
    params: ParametroAponExecucao01
  ): Observable<ApoExecucaoModel01[]> {
    return this.http.post<ApoExecucaoModel01[]>(
      `${this.apiURL}aponexecs`,
      params
    );
  }

  ApoExecucaoInsert(aponexecucao: ApoExecucaoModel) {
    return this.http.post<ApoExecucaoModel>(
      `${this.apiURL}aponexec`,
      aponexecucao
    );
  }

  ApoExecucaoUpdate(aponexecucao: ApoExecucaoModel) {
    return this.http.put<ApoExecucaoModel>(
      `${this.apiURL}aponexec`,
      aponexecucao
    );
  }

  ApoExecucaoDelete(id_empresa: number, id: number) {
    return this.http.delete<ApoExecucaoModel>(
      `${this.apiURL}aponexec/${id_empresa}/${id}`
    );
  }

  AponExecByExecutor(
    id_empresa: number,
    id_usuario: number,
    data_ref: string
  ): Observable<AponExecutorModel[]> {
    return this.http.get<AponExecutorModel[]>(
      `${this.apiURL}getaponexecbyexecutor/${id_empresa}/${id_usuario}/${data_ref}`
    );
  }
}
