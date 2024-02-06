import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { EmpresaModel } from '../Models/empresa-model';
import { EmpresaQuery01Model } from '../Models/empresa-query_01-model';
import { ParametroEmpresa01 } from '../parametros/parametro-empresa-01';

@Injectable({
  providedIn: 'root',
})
export class EmpresasService {
  apiURL: string = environment.apiURL;

  constructor(private http: HttpClient) {}

  getEmpresas(): Observable<EmpresaQuery01Model[]> {
    return this.http.get<EmpresaQuery01Model[]>(`${this.apiURL}empresas`);
  }

  getEmpresas_01(
    params: ParametroEmpresa01
  ): Observable<EmpresaQuery01Model[]> {
    return this.http.post<EmpresaQuery01Model[]>(
      `${this.apiURL}empresas`,
      params
    );
  }

  getEmpresa(id: number) {
    return this.http.get<EmpresaModel>(`${this.apiURL}empresa/${id}`);
  }

  EmpresaInsert(empresa: any) {
    return this.http.post<EmpresaModel>(`${this.apiURL}empresa`, empresa);
  }

  EmpresaUpdate(empresa: EmpresaModel) {
    return this.http.put<EmpresaModel>(`${this.apiURL}empresa`, empresa);
  }

  EmpresaDelete(id: number) {
    return this.http.delete<EmpresaModel>(`${this.apiURL}empresa/${id}`);
  }
}
