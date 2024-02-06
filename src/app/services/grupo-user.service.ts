import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { GruUserModel } from '../Models/gru-user-model';
import { ParametroGruuser01 } from '../parametros/parametro-gruuser-01';

@Injectable({
  providedIn: 'root',
})
export class GrupoUserService {
  apiURL: string = environment.apiURL;

  constructor(private http: HttpClient) {}

  getGrupoUsers(): Observable<GruUserModel[]> {
    return this.http.get<GruUserModel[]>(`${this.apiURL}gruusers`);
  }

  getGrupoUsers_01(params: ParametroGruuser01): Observable<GruUserModel[]> {
    return this.http.post<GruUserModel[]>(`${this.apiURL}gruusers`, params);
  }

  getGrupoUser(id_empresa: number, id: number) {
    return this.http.get<GruUserModel>(
      `${this.apiURL}gruuser/${id_empresa}/${id}`
    );
  }

  GrupoUserInsert(grupo: any) {
    return this.http.post<GruUserModel>(`${this.apiURL}gruuser/`, grupo);
  }

  GrupoUserUpdate(grupo: GruUserModel) {
    return this.http.put<GruUserModel>(`${this.apiURL}gruuser/`, grupo);
  }

  GrupoUserDelete(id_empresa: number, id: number) {
    return this.http.delete<GruUserModel>(
      `${this.apiURL}gruuser/${id_empresa}/${id}`
    );
  }
}
