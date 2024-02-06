import { Lista01Model } from './../Models/lista01-model';
import { UsuarioModel } from 'src/app/Models/usuario-model';
import { UsuarioQuery01Model } from './../Models/usuario-query_01-model';
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ParametroUsuario01 } from '../parametros/parametro-usuario01';
import { environment } from 'src/environments/environment';
import { ParametroLista01 } from '../parametros/parametro-lista01';
import { UsuarioQuery_03Model } from '../Models/usuario-query_03-model';

@Injectable({
  providedIn: 'root',
})
export class UsuariosService {
  static login: UsuarioModel = new UsuarioModel();

  apiURL: string = environment.apiURL;

  constructor(private http: HttpClient) {}

  getUsuarios(): Observable<UsuarioModel[]> {
    return this.http.get<UsuarioModel[]>(`${this.apiURL}usuarios`);
  }

  getUsuario(id_empresa: number, id: number): Observable<UsuarioModel> {
    return this.http.get<UsuarioModel>(
      `${this.apiURL}usuario/${id_empresa}/${id}`
    );
  }

  getUsuarioByEmail(
    id_empresa: number,
    email: string
  ): Observable<UsuarioModel> {
    return this.http.get<UsuarioModel>(
      `${this.apiURL}usuariobyemail/${id_empresa}/${email}`
    );
  }

  getusuarios_01(
    params: ParametroUsuario01
  ): Observable<UsuarioQuery01Model[]> {
    return this.http.post<UsuarioQuery01Model[]>(
      `${this.apiURL}usuarios`,
      params
    );
  }

  getusuarios_01_Ponte(
    params: ParametroUsuario01
  ): Observable<UsuarioQuery_03Model[]> {
    return this.http.post<UsuarioQuery_03Model[]>(
      `${this.apiURL}usuariosbyponte`,
      params
    );
  }
  UsuarioInsert(usuario: UsuarioModel) {
    return this.http.post<UsuarioModel>(`${this.apiURL}usuario/`, usuario);
  }

  UsuarioUpdate(usuario: UsuarioModel) {
    return this.http.put<UsuarioModel>(`${this.apiURL}usuario/`, usuario);
  }

  UsuarioDelete(id_empresa: number, id: number) {
    return this.http.delete<UsuarioModel>(
      `${this.apiURL}usuario/${id_empresa}/${id}`
    );
  }

  UsarioHorasExec(param: ParametroLista01) {
    return this.http.post<Lista01Model[]>(
      `${this.apiURL}usariohorasexec/`,
      param
    );
  }

  getGruposDiretoria(): number[] {
    return [900];
  }

  getGruposCoordenador(): number[] {
    return [901];
  }

  getGruposAuditor(): number[] {
    return [902, 906];
  }

  getGruposTrainee(): number[] {
    return [903];
  }

  getGruposAdm(): number[] {
    return [904];
  }

  getGruposFinanceiro(): number[] {
    return [905];
  }

  getGruposTi(): number[] {
    return [906];
  }

  isDiretoria(value: number): boolean {
    if (value == 900) return true;

    return false;
  }

  isCoordenador(value: number): boolean {
    if (value == 901) return true;

    return false;
  }

  isAuditor(value: number): boolean {
    if (value == 902) return true;

    return false;
  }

  isTrainee(value: number): boolean {
    if (value == 903) return true;

    return false;
  }

  isAdm(value: number): boolean {
    if (value == 904) return true;

    return false;
  }

  isFinanceiro(value: number): boolean {
    if (value == 905) return true;

    return false;
  }

  isTi(value: number): boolean {
    if (value == 906) return true;

    return false;
  }
}
