import { ParametroEstrutura01 } from './../parametros/parametro-estrutura01';
import { EstruturaModel } from './../Models/estrutura-model';
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { ParametroEstruHisto } from '../parametros/parametro-estru-histo';

@Injectable({
  providedIn: 'root',
})
export class EstruturasService {
  apiURL: string = environment.apiURL;

  estruturas: EstruturaModel[] = [];

  constructor(private http: HttpClient) {}

  getEstruturas(params: ParametroEstrutura01): Observable<EstruturaModel[]> {
    return this.http.post<EstruturaModel[]>(`${this.apiURL}estruturas`, params);
  }

  getEstrutura(
    id_empresa: number,
    conta: string,
    subconta: string,
    versao: string
  ) {
    return this.http.get<EstruturaModel>(
      `${this.apiURL}estrutura/${id_empresa}/${conta}/${subconta}/${versao}`
    );
  }

  getConta(id_empresa: number, conta: string, versao: string) {
    return this.http.get<EstruturaModel>(
      `${this.apiURL}conta/${id_empresa}/${conta}/${versao}`
    );
  }

  EstruturaInsert(estrutura: EstruturaModel, lsUsuarios?: any) {
    console.log('Indo para gravar', estrutura, lsUsuarios);
    return this.http.post<EstruturaModel>(`${this.apiURL}estrutura`, {
      estrutura: estrutura,
      usuarios: lsUsuarios,
    });
  }

  EstruturaUpdate(estrutura: EstruturaModel) {
    return this.http.put<EstruturaModel>(`${this.apiURL}estrutura`, estrutura);
  }

  EstruturaSaveAll(estruturas: EstruturaModel[], oldVersion: string) {
    return this.http.post<EstruturaModel[]>(`${this.apiURL}saveAllEstrutura`, {
      estruturas,
      oldVersion,
    });
  }

  EstruturaUpdateAll(estruturas: EstruturaModel[]) {
    return this.http.post<EstruturaModel[]>(
      `${this.apiURL}updateAllEstrutura`,
      {
        estruturas,
      }
    );
  }

  EstruturaDelete(
    id_empresa: number,
    conta: string,
    versao: string,
    subconta: string
  ) {
    return this.http.delete<EstruturaModel>(
      `${this.apiURL}estrutura/${id_empresa}/${conta}/${versao}/${subconta}`
    );
  }

  EstruturaAllDelete(id_empresa: number, conta: string, versao: string) {
    return this.http.delete<EstruturaModel>(
      `${this.apiURL}estrutura/${id_empresa}/${conta}/${versao}`
    );
  }

  copiaEstrutura(estru: EstruturaModel) {
    return this.http.post<EstruturaModel[]>(`${this.apiURL}copiaEstrutura`, {
      id_empresa: estru.id_empresa,
      conta: estru.conta,
      versao: estru.versao,
      controle: estru.controle,
      descricao: estru.descricao,
    });
  }

  multiEstrutura(estru: EstruturaModel[]) {
    return this.http.post<EstruturaModel[]>(`${this.apiURL}multiEstrutura`, {
      estruturas: estru,
    });
  }

  getEstruturasMem(): EstruturaModel[] {
    return this.estruturas;
  }

  montaMemEstruturas() {
    let x: number = 0;

    let y: number = 0;

    let z: number = 0;

    let n4: number = 0;

    let n5: number = 0;

    let n6: number = 0;

    let n7: number = 0;

    let cta: string = '';

    let subconta: string = '';

    let contaanterior: string = '';

    let contaatual: string = '';

    let anterior2: string = '';

    let anterior3: string = '';

    let anterior4: string = '';

    let anterior5: string = '';

    let anterior6: string = '';

    //nivel 1
    for (x = 1; x <= 2; x++) {
      let conta: EstruturaModel = new EstruturaModel();

      conta.id_empresa = 1;

      cta = '' + x;

      if (cta.length == 1) cta = '0' + cta;

      conta.id_empresa = 1;
      conta.conta = cta;
      conta.subconta = cta;
      conta.descricao = `Conta ${cta} - EXEMPLO DE ESTRUTURA !`;
      conta.nivel = 1;
      conta.tipo = 'C';
      conta.user_insert = 0;
      conta.user_update = 0;
      this.estruturas.push(conta);

      //nivel 2
      for (y = 1; y < 5; y++) {
        contaanterior = cta;

        let conta: EstruturaModel = new EstruturaModel();

        conta.id_empresa = 1;

        cta = '' + x;

        contaatual = '' + y;

        if (cta.length == 1) cta = '0' + cta;

        if (contaatual.length == 1) contaatual = '0' + contaatual;

        conta.id_empresa = 1;
        conta.conta = cta;
        conta.subconta = contaanterior + contaatual;
        conta.descricao = `Conta  ${cta} Sub-Conta ${conta.subconta} `;
        conta.nivel = 2;
        conta.tipo = 'S';
        conta.user_insert = 0;
        conta.user_update = 0;
        this.estruturas.push(conta);

        if (anterior2 == '') {
          anterior2 = contaanterior + contaatual;
        }
        contaanterior = anterior2;
        //nivel 3
        for (z = 1; z < 4; z++) {
          let conta: EstruturaModel = new EstruturaModel();

          conta.id_empresa = 1;

          cta = '' + x;

          contaatual = '' + z;

          if (cta.length == 1) cta = '0' + cta;

          if (contaatual.length == 1) contaatual = '0' + contaatual;

          conta.id_empresa = 1;
          conta.conta = cta;
          conta.subconta = contaanterior + contaatual;
          conta.descricao = `Conta  ${cta} Sub-Conta ${conta.subconta} `;
          conta.nivel = 3;
          conta.tipo = 'S';
          conta.user_insert = 0;
          conta.user_update = 0;
          this.estruturas.push(conta);

          if (anterior3 == '') {
            anterior3 = contaanterior + contaatual;
          }
          contaanterior = anterior3;
          //nivel 4
          for (n4 = 1; n4 < 5; n4++) {
            let conta: EstruturaModel = new EstruturaModel();

            conta.id_empresa = 1;

            cta = '' + x;

            contaatual = '' + n4;

            if (cta.length == 1) cta = '0' + cta;

            if (contaatual.length == 1) contaatual = '0' + contaatual;

            conta.id_empresa = 1;
            conta.conta = cta;
            conta.subconta = contaanterior + contaatual;
            conta.descricao = `Conta ${cta} Sub-Conta ${conta.subconta}`;
            conta.nivel = 4;
            conta.tipo = 'S';
            conta.user_insert = 0;
            conta.user_update = 0;
            this.estruturas.push(conta);

            //nivel 5
            if (anterior4 == '') {
              anterior4 = contaanterior + contaatual;
            }
            contaanterior = anterior4;

            for (n5 = 1; n5 < 4; n5++) {
              let conta: EstruturaModel = new EstruturaModel();

              conta.id_empresa = 1;

              cta = '' + x;

              contaatual = '' + n5;

              if (cta.length == 1) cta = '0' + cta;

              if (contaatual.length == 1) contaatual = '0' + contaatual;

              conta.id_empresa = 1;
              conta.conta = cta;
              conta.subconta = contaanterior + contaatual;
              conta.descricao = `Conta ${cta} Sub-Conta ${conta.subconta}`;
              conta.nivel = 5;
              conta.tipo = 'S';
              conta.user_insert = 0;
              conta.user_update = 0;
              this.estruturas.push(conta);

              //nivel 6
              if (anterior5 == '') {
                anterior5 = contaanterior + contaatual;
              }
              contaanterior = anterior5;

              for (n6 = 1; n6 < 3; n6++) {
                let conta: EstruturaModel = new EstruturaModel();

                conta.id_empresa = 1;

                cta = '' + x;

                contaatual = '' + n6;

                if (cta.length == 1) cta = '0' + cta;

                if (contaatual.length == 1) contaatual = '0' + contaatual;

                conta.id_empresa = 1;
                conta.conta = cta;
                conta.subconta = contaanterior + contaatual;
                conta.descricao = `Conta ${cta} Sub-Conta ${conta.subconta}`;
                conta.nivel = 6;
                conta.tipo = 'S';
                conta.user_insert = 0;
                conta.user_update = 0;
                this.estruturas.push(conta);

                //nivel 7
                if (anterior6 == '') {
                  anterior6 = contaanterior + contaatual;
                }

                contaanterior = anterior6;

                for (n7 = 1; n7 < 3; n7++) {
                  let conta: EstruturaModel = new EstruturaModel();

                  conta.id_empresa = 1;

                  cta = '' + x;

                  contaatual = '' + n7;

                  if (cta.length == 1) cta = '0' + cta;

                  if (contaatual.length == 1) contaatual = '0' + contaatual;

                  conta.id_empresa = 1;
                  conta.conta = cta;
                  conta.subconta = contaanterior + contaatual;
                  conta.descricao = `Conta ${cta} Sub-Conta ${conta.subconta}`;
                  conta.nivel = 7;
                  conta.tipo = 'O';
                  conta.user_insert = 0;
                  conta.user_update = 0;
                  this.estruturas.push(conta);
                }

                contaanterior = anterior5;
              }
              contaanterior = anterior4;
            }
            contaanterior = anterior3;
          }
          contaanterior = anterior2;
        }
      }
    }
  }

  estrutura_histo(par: ParametroEstruHisto) {
    return this.http.post<any>(`${this.apiURL}estrutura_histo`, par);
  }
}
