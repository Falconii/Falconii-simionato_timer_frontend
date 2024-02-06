import { ParametroMotivoApo01 } from './../parametros/parametro-motivo-apo01';
import { MotivoApoModel } from './../Models/motivo-apo-model';
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root',
})
export class MotivoApoService {
  apiURL: string = environment.apiURL;

  constructor(private http: HttpClient) {}

  getMotivoApos(): Observable<MotivoApoModel[]> {
    return this.http.get<MotivoApoModel[]>(`${this.apiURL}motivoapos`);
  }

  getMotivoApos_01(params: ParametroMotivoApo01): Observable<MotivoApoModel[]> {
    return this.http.post<MotivoApoModel[]>(`${this.apiURL}motivoapos`, params);
  }

  getMotivoApo(id_empresa: number, codigo: string) {
    return this.http.get<MotivoApoModel>(
      `${this.apiURL}motivoapo/${id_empresa}/${codigo}`
    );
  }

  MotivoApoInsert(motivo: any) {
    return this.http.post<MotivoApoModel>(`${this.apiURL}motivoapo`, motivo);
  }

  MotivoApoUpdate(motivo: MotivoApoModel) {
    return this.http.put<MotivoApoModel>(`${this.apiURL}motivoapo`, motivo);
  }

  MotivoApoDelete(id_empresa: number, codigo: string) {
    return this.http.delete<MotivoApoModel>(
      `${this.apiURL}motivoapo/${id_empresa}/${codigo}`
    );
  }
}
