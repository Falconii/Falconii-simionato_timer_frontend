import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { ClientesModel } from '../Models/cliente-model';
import { ClientesQuery01Model } from '../Models/cliente-query_01-model';
import { ParametroCliente01 } from '../parametros/parametro-cliente-01';

@Injectable({
  providedIn: 'root',
})
export class ClientesService {
  apiURL: string = environment.apiURL;

  constructor(private http: HttpClient) {}

  getClientes(): Observable<ClientesModel[]> {
    return this.http.get<ClientesModel[]>(`${this.apiURL}clientes`);
  }

  getClientes_01(
    params: ParametroCliente01
  ): Observable<ClientesQuery01Model[]> {
    return this.http.post<ClientesQuery01Model[]>(
      `${this.apiURL}clientes`,
      params
    );
  }

  getClientes_01_C(params: ParametroCliente01): Observable<number> {
    return this.http.post<any>(`${this.apiURL}clientes`, params);
  }

  getCliente(id_empresa: number, id: number) {
    return this.http.get<ClientesModel>(
      `${this.apiURL}cliente/${id_empresa}/${id}`
    );
  }

  clienteInsert(cliente: any) {
    return this.http.post<ClientesModel>(`${this.apiURL}cliente`, cliente);
  }

  clienteUpdate(cliente: ClientesModel) {
    return this.http.put<ClientesModel>(`${this.apiURL}cliente`, cliente);
  }

  clienteDelete(id_empresa: number, id: number) {
    return this.http.delete<ClientesModel>(
      `${this.apiURL}cliente/${id_empresa}/${id}`
    );
  }
}
