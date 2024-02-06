import { ParametroEmailOla } from './../parametros/parametro-email-ola';
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { Observable } from 'rxjs/internal/Observable';

@Injectable({
  providedIn: 'root',
})
export class EmailServiceService {
  apiURL: string = environment.apiURL;

  constructor(private http: HttpClient) {}

  emailOla(params: ParametroEmailOla): Observable<any> {
    return this.http.post<any>(`${this.apiURL}emailOla`, params);
  }
}
