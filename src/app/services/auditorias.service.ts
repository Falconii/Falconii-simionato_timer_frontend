import { ParametroAuditoria01 } from './../parametros/parametro-auditoria01';
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { AuditoriaModel } from '../Models/auditoria-model';

@Injectable({
  providedIn: 'root',
})
export class AuditoriasService {
  apiURL: string = environment.apiURL;

  constructor(private http: HttpClient) {}

  getAuditorias_01(params: ParametroAuditoria01): Observable<AuditoriaModel[]> {
    return this.http.post<AuditoriaModel[]>(`${this.apiURL}auditorias`, params);
  }

  getAuditoria(id_empresa: number, id: number) {
    return this.http.get<AuditoriaModel>(
      `${this.apiURL}auditoria/${id_empresa}/${id}`
    );
  }

  auditoriaInsert(auditoria: AuditoriaModel) {
    console.log('Auditoria Enviada..', auditoria);
    return this.http.post<AuditoriaModel>(`${this.apiURL}auditoria`, auditoria);
  }

  auditoriaUpdate(auditoria: AuditoriaModel) {
    return this.http.put<AuditoriaModel>(`${this.apiURL}auditoria`, auditoria);
  }
  auditoriaDelete(id_empresa: number, id: number) {
    return this.http.delete<any>(`${this.apiURL}auditoria/${id_empresa}/${id}`);
  }
}
