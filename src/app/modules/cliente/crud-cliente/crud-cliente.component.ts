import { ShowClienteDialogData } from './../../../shared/components/show-cliente-dialog/show-cliente-dialog-data';
import { ClientesModel } from './../../../Models/cliente-model';
import { GlobalService } from './../../../services/global.service';
import { ControlePaginas } from '../../../shared/classes/controle-paginas';
import { MensagensBotoes } from 'src/app/shared/classes/util';
import { GrupoEconomicoService } from '../../../services/grupo-economico.service';
import { ClientesService } from '../../../services/clientes.service';
import { ParametroCliente01 } from '../../../parametros/parametro-cliente-01';
import { CadastroAcoes } from '../../../shared/classes/cadastro-acoes';
import { GrupoEcoModel } from '../../../Models/gru-eco-models';
import { ClientesQuery01Model } from '../../../Models/cliente-query_01-model';
import { Component, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { FormBuilder, FormGroup } from '@angular/forms';
import { Router } from '@angular/router';
import { MatSnackBar } from '@angular/material/snack-bar';
import {
  MatDialog,
  MAT_DIALOG_DATA,
  MatDialogRef,
  MatDialogConfig,
} from '@angular/material/dialog';
import { ShowClienteDialogComponent } from 'src/app/shared/components/show-cliente-dialog/show-cliente-dialog.component';
import { AppSnackbar } from 'src/app/shared/classes/app-snackbar';

@Component({
  selector: 'app-crud-cliente',
  templateUrl: './crud-cliente.component.html',
  styleUrls: ['./crud-cliente.component.css'],
})
export class CrudClienteComponent implements OnInit {
  inscricaoGetAll!: Subscription;
  inscricaoGetFiltro!: Subscription;
  inscricaoGetGrupo!: Subscription;

  clientes: ClientesQuery01Model[] = [];

  grupos: GrupoEcoModel[] = [];

  parametros: FormGroup;

  erro: string = '';

  opcoesOrdenacao = ['Código', 'Razão', 'Grupo'];

  opcoesCampo = ['Código', 'Razão', 'Grupo'];

  tamPagina = 50;

  controlePaginas: ControlePaginas = new ControlePaginas(this.tamPagina, 0);

  constructor(
    private formBuilder: FormBuilder,
    private clientesServices: ClientesService,
    private grupoEconomicoService: GrupoEconomicoService,
    private globalService: GlobalService,
    private router: Router,
    private appSnackBar: AppSnackbar,
    public showClienteDialog: MatDialog
  ) {
    this.parametros = formBuilder.group({
      ordenacao: [null],
      campo: [null],
      filtro: [null],
      grupo: [],
    });
    this.setValues();
    this.getGrupos();
  }

  ngOnInit(): void {
    this.getClientesContador();
  }

  ngOnDestroy() {
    this.inscricaoGetAll?.unsubscribe();
    this.inscricaoGetFiltro?.unsubscribe();
    this.inscricaoGetGrupo?.unsubscribe();
  }

  escolha(opcao: number, cliente?: ClientesQuery01Model) {
    if (typeof cliente !== 'undefined') {
      this.router.navigate([
        '/clientes/cliente',
        cliente.id_empresa,
        cliente.id,
        opcao,
      ]);
    } else {
      this.router.navigate(['/clientes/cliente', 1, 0, opcao]);
    }
  }

  getAcoes() {
    return CadastroAcoes;
  }

  getClientes() {
    let par = new ParametroCliente01();

    par.id_empresa = 1;

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
    if (this.parametros.value.campo == 'Grupo')
      par.grupo = this.parametros.value.grupo;

    par.orderby = this.parametros.value.ordenacao;

    par.contador = 'N';

    par.pagina = this.controlePaginas.getPaginalAtual();

    this.globalService.setSpin(true);
    this.inscricaoGetFiltro = this.clientesServices
      .getClientes_01(par)
      .subscribe(
        (data: ClientesQuery01Model[]) => {
          this.globalService.setSpin(false);
          this.clientes = data;
        },
        (error: any) => {
          this.globalService.setSpin(false);
          this.clientes = [];
          this.appSnackBar.openFailureSnackBar(
            `Pesquisa Nos Clientes ${error.error.tabela} - ${error.error.erro} - ${error.error.message}`,
            'OK'
          );
        }
      );
  }

  getClientesContador() {
    let par = new ParametroCliente01();

    par.id_empresa = 1;

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
    if (this.parametros.value.campo == 'Grupo')
      par.grupo = this.parametros.value.grupo;

    par.orderby = this.parametros.value.ordenacao;

    par.contador = 'S';

    this.globalService.setSpin(true);
    this.inscricaoGetFiltro = this.clientesServices
      .getClientes_01_C(par)
      .subscribe(
        (data: any) => {
          this.globalService.setSpin(false);
          this.controlePaginas = new ControlePaginas(
            this.tamPagina,
            data.total
          );
          this.getClientes();
        },
        (error: any) => {
          this.globalService.setSpin(false);
          this.controlePaginas = new ControlePaginas(this.tamPagina, 0);
          this.appSnackBar.openFailureSnackBar(
            `Pesquisa Nos Clientes ${error.error.tabela} - ${error.error.erro} - ${error.error.message}`,
            'OK'
          );
        }
      );
  }

  getGrupos() {
    this.globalService.setSpin(true);
    this.inscricaoGetGrupo = this.grupoEconomicoService
      .getGrupoEcos()
      .subscribe(
        (data: GrupoEcoModel[]) => {
          this.globalService.setSpin(false);
          this.grupos = data;
        },
        (error: any) => {
          this.globalService.setSpin(false);
          this.erro = error;
          this.grupos = [];
        }
      );
  }

  isGrupo(): Boolean {
    if (this.parametros.value.campo == 'Grupo') {
      return true;
    } else {
      return false;
    }
  }

  setValues() {
    this.parametros.setValue({
      ordenacao: 'Código',
      campo: 'Código',
      filtro: '',
      grupo: 1,
    });
  }

  getTexto() {
    return MensagensBotoes;
  }

  onChangePage() {
    this.getClientes();
  }

  onHome() {
    this.router.navigate(['']);
  }

  onShowCliente(cliente: any): void {
    this.openShowClienteDialog(cliente);
  }

  openShowClienteDialog(cliente: ClientesQuery01Model) {
    const data: ShowClienteDialogData = new ShowClienteDialogData();
    data.cliente = cliente;

    const dialogConfig = new MatDialogConfig();

    dialogConfig.id = 'show-cliente';
    dialogConfig.data = data;
    const modalDialog = this.showClienteDialog
      .open(ShowClienteDialogComponent, dialogConfig)
      .beforeClosed()
      .subscribe((data: ShowClienteDialogData) => {
        console.log('Retorno data', data);
      });
  }
}
