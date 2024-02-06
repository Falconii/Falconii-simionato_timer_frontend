import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { BrasilApiModel } from '../Models/brasil-api-model';

@Injectable({
  providedIn: 'root',
})
export class ApiBrasilService {
  constructor(private http: HttpClient) {}

  getFeriados(ano: string): Observable<BrasilApiModel[]> {
    return this.http.get<BrasilApiModel[]>(
      `https://brasilapi.com.br/api/feriados/v1/${ano}`
    );
  }
}
