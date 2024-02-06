import { EstadoModel } from './../../Models/estado-model';
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, observable, Subscription } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class DropdownService {

  estados:EstadoModel[] = [];

  constructor(private http:HttpClient) { }

  getEstados():Observable<EstadoModel[]>{

  return this.http.get<EstadoModel[]>('assets/dados/estadosbr.json');

}

}


