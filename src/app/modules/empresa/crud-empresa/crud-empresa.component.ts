import { GlobalService } from './../../../services/global.service';
import {
  DataDDMMYYYY,
  DataYYYYMMDD,
  MensagensBotoes,
} from 'src/app/shared/classes/util';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { EmpresaQuery01Model } from 'src/app/Models/empresa-query_01-model';
import { CadastroAcoes } from 'src/app/shared/classes/cadastro-acoes';
import { ParametroEmpresa01 } from 'src/app/parametros/parametro-empresa-01';
import { EmpresasService } from 'src/app/services/empresas.service';
import { AppSnackbar } from 'src/app/shared/classes/app-snackbar';

@Component({
  selector: 'app-crud-empresa',
  templateUrl: './crud-empresa.component.html',
  styleUrls: ['./crud-empresa.component.css'],
})
export class CrudEmpresaComponent implements OnInit {
  inscricaoGetAll!: Subscription;
  inscricaoGetFiltro!: Subscription;

  empresas: EmpresaQuery01Model[] = [];

  parametros: FormGroup;

  erro: string = '';

  opcoesOrdenacao = ['Código', 'Razão'];

  opcoesCampo = ['Código', 'Razão'];

  constructor(
    private globalService: GlobalService,
    private formBuilder: FormBuilder,
    private empresaService: EmpresasService,
    private router: Router,
    private appSnackBar: AppSnackbar
  ) {
    this.parametros = formBuilder.group({
      ordenacao: [null],
      campo: [null],
      filtro: [null],
    });
    this.setValues();
  }

  ngOnInit(): void {
    this.getEmpresas();
  }

  setValues() {
    this.parametros.setValue({
      ordenacao: 'Código',
      campo: 'Código',
      filtro: '',
    });
  }

  ngOnDestroy() {
    this.inscricaoGetAll?.unsubscribe();
    this.inscricaoGetFiltro?.unsubscribe();
  }

  escolha(opcao: number, empresa?: EmpresaQuery01Model) {
    if (typeof empresa !== 'undefined') {
      this.router.navigate(['/empresas/empresa', empresa.id, opcao]);
    } else {
      this.router.navigate(['/empresas/empresa', 1, opcao]);
    }
  }

  getAcoes() {
    return CadastroAcoes;
  }

  getEmpresas() {
    let par = new ParametroEmpresa01();

    par.id = 1;

    if (this.parametros.value.campo == 'Código') {
      let key = parseInt(this.parametros.value.filtro, 10);
      if (isNaN(key)) {
        par.id = 0;
      } else {
        par.id = key;
      }
    }
    if (this.parametros.value.campo == 'Razão')
      par.razao = this.parametros.value.filtro.toUpperCase();

    par.orderby = this.parametros.value.ordenacao;
    this.globalService.setSpin(true);
    this.inscricaoGetFiltro = this.empresaService.getEmpresas_01(par).subscribe(
      (data: EmpresaQuery01Model[]) => {
        this.empresas = data;
        this.globalService.setSpin(false);
      },
      (error: any) => {
        this.empresas = [];
        this.appSnackBar.openFailureSnackBar(
          `Pesquisa Nas Empresas ${error.error.tabela} - ${error.error.erro} - ${error.error.message}`,
          'OK'
        );
        this.globalService.setSpin(false);
      }
    );
  }

  getTexto() {
    return MensagensBotoes;
  }

  onHome() {
    this.router.navigate(['']);
  }
}
