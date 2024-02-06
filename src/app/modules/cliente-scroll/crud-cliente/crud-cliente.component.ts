import { CdkVirtualScrollViewport } from '@angular/cdk/scrolling';
import {
  ChangeDetectionStrategy,
  Component,
  NgZone,
  OnInit,
  ViewChild,
} from '@angular/core';
import { FormGroup, FormBuilder } from '@angular/forms';
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';
import { ActivatedRoute, Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { ClientesQuery01Model } from 'src/app/Models/cliente-query_01-model';
import { GrupoEcoModel } from 'src/app/Models/gru-eco-models';
import { ParametroModel } from 'src/app/Models/parametro-model';
import { ParametroCliente01 } from 'src/app/parametros/parametro-cliente-01';
import { ParametroGrupoEco01 } from 'src/app/parametros/parametro-grupo-eco01';
import { ParametroParametro01 } from 'src/app/parametros/parametro-parametro01';
import { ClientesService } from 'src/app/services/clientes.service';
import { GlobalService } from 'src/app/services/global.service';
import { GrupoEconomicoService } from 'src/app/services/grupo-economico.service';
import { ParametrosService } from 'src/app/services/parametros.service';
import { AppSnackbar } from 'src/app/shared/classes/app-snackbar';
import { CadastroAcoes } from 'src/app/shared/classes/cadastro-acoes';
import { ControlePaginas } from 'src/app/shared/classes/controle-paginas';
import {
  GetValueJsonBoolean,
  GetValueJsonNumber,
  GetValueJsonString,
  GetValueJsonStringArray,
  MensagensBotoes,
  messageError,
} from 'src/app/shared/classes/util';
import { ShowClienteDialogData } from 'src/app/shared/components/show-cliente-dialog/show-cliente-dialog-data';
import { ShowClienteDialogComponent } from 'src/app/shared/components/show-cliente-dialog/show-cliente-dialog.component';

@Component({
  selector: 'app-crud-cliente',
  templateUrl: './crud-cliente.component.html',
  styleUrls: ['./crud-cliente.component.css'],
})
export class CrudClienteComponent implements OnInit {
  @ViewChild(CdkVirtualScrollViewport) viewPort!: CdkVirtualScrollViewport;

  inscricaoGetAll!: Subscription;
  inscricaoGetFiltro!: Subscription;
  inscricaoGetGrupo!: Subscription;
  inscricaoRota!: Subscription;
  inscricaoParametro!: Subscription;

  clientes: ClientesQuery01Model[] = [];

  grupos: GrupoEcoModel[] = [];

  parametros: FormGroup;

  erro: string = '';

  opcoesOrdenacao: string[] = [];

  opcoesCampo: string[] = [];

  tamPagina = 50;

  controlePaginas: ControlePaginas = new ControlePaginas(this.tamPagina, 0);

  retorno: boolean = false;

  parametro: ParametroModel = new ParametroModel();

  constructor(
    private formBuilder: FormBuilder,
    private clientesServices: ClientesService,
    private grupoEconomicoService: GrupoEconomicoService,
    private globalService: GlobalService,
    private router: Router,
    private appSnackBar: AppSnackbar,
    public showClienteDialog: MatDialog,
    public parametrosService: ParametrosService,
    private route: ActivatedRoute,
    private ngZone: NgZone
  ) {
    this.parametros = formBuilder.group({
      ordenacao: [null],
      campo: [null],
      filtro: [null],
      grupo: [],
    });
    this.inscricaoRota = route.params.subscribe((params: any) => {
      if (typeof params.retorno == 'undefined') {
        this.retorno = false;
      } else {
        this.retorno = true;
        const par = this.globalService.estadoFind('cliente');
      }
    });
    this.loadParametros();
    this.getGrupos();
  }

  ngOnInit(): void {
    this.getClientesContador();
  }

  ngAfterViewInit(): void {
    //this.viewPort.scrollToIndex(10, 'smooth');
    /*
    this.viewPort
      .elementScrolled()
      .pipe(
        new Map(() => this.viewPort.measureScrollOffset('bottom')),
        pairwise(),
        filter(([y1, y2]) => y2 < y1 && y2 < 140),
        throttleTime(200)
      )
      .subscribe(() => {
        this.ngZone.run(() => {
          this.fetchMore();
        });
      });
      */
  }

  ngOnDestroy() {
    this.inscricaoGetAll?.unsubscribe();
    this.inscricaoGetFiltro?.unsubscribe();
    this.inscricaoGetGrupo?.unsubscribe();
    this.inscricaoRota?.unsubscribe();
    this.inscricaoParametro?.unsubscribe();
  }

  escolha(opcao: number, cliente?: ClientesQuery01Model) {
    if (typeof cliente !== 'undefined') {
      let config = this.parametro.getParametro();
      Object(config).new = false;
      Object(config).id_retorno = cliente.id;
      Object(config).page = this.controlePaginas.getPaginalAtual();
      Object(config).op_ordenacao = this.opcoesOrdenacao.findIndex(
        (op) => this.parametros.value.ordenacao == op
      );
      Object(config).op_pesquisar = this.opcoesCampo.findIndex(
        (op) => this.parametros.value.campo == op
      );
      Object(config).descricao = this.parametros.value.filtro;
      this.parametro.parametro = JSON.stringify(config);
      this.globalService.estadoSave(this.parametro);
      this.router.navigate([
        '/clientes-scroll/cliente-scroll',
        cliente.id_empresa,
        cliente.id,
        opcao,
      ]);
    } else {
      let config = this.parametro.getParametro();
      Object(config).new = false;
      Object(config).id_retorno = 0;
      Object(config).page = this.controlePaginas.getPaginalAtual();
      Object(config).op_ordenacao = this.opcoesOrdenacao.findIndex(
        (op) => this.parametros.value.ordenacao == op
      );
      Object(config).op_pesquisar = this.opcoesCampo.findIndex(
        (op) => this.parametros.value.campo == op
      );
      Object(config).descricao = this.parametros.value.filtro;
      this.parametro.parametro = JSON.stringify(config);
      this.globalService.estadoSave(this.parametro);
      this.router.navigate(['/clientes-scroll/cliente-scroll', 1, 0, opcao]);
    }
  }

  getAcoes() {
    return CadastroAcoes;
  }

  getClientes() {
    let par = new ParametroCliente01();

    par.id_empresa = this.globalService.getIdEmpresa();

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

    par.pagina = this.controlePaginas.getPaginalAtual();

    par.contador = 'N';

    par.tamPagina = this.tamPagina;

    this.globalService.setSpin(true);
    this.inscricaoGetFiltro = this.clientesServices
      .getClientes_01(par)
      .subscribe(
        (data: ClientesQuery01Model[]) => {
          this.globalService.setSpin(false);
          this.clientes = [];
          this.clientes = data;
          const idx = this.clientes.findIndex(
            (cli) =>
              cli.id ==
              GetValueJsonNumber(this.parametro.getParametro(), 'id_retorno')
          );
          setTimeout(() => this.viewPort.scrollToIndex(idx), 10);
          this.retorno = false;
          let config = this.parametro.getParametro();
          Object(config).id_retorno = 0;
          Object(config).new = false;
          this.parametro.parametro = JSON.stringify(config);
        },
        (error: any) => {
          let config = this.parametro.getParametro();
          Object(config).id_retorno = 0;
          Object(config).new = false;
          this.retorno = false;
          this.globalService.setSpin(false);
          this.clientes = [];
          this.appSnackBar.openFailureSnackBar(
            `Pesquisa Nos Clientes ${messageError(error)}`,
            'OK'
          );
        }
      );
  }

  getClientesContador() {
    let par = new ParametroCliente01();

    par.id_empresa = 1;

    par.orderby = 'Código';

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

    par.tamPagina = this.tamPagina;

    this.globalService.setSpin(true);
    this.inscricaoGetFiltro = this.clientesServices
      .getClientes_01_C(par)
      .subscribe(
        (data: any) => {
          this.globalService.setSpin(false);
          this.controlePaginas = new ControlePaginas(
            this.tamPagina,
            data.total == 0 ? 1 : data.total
          );
          //atualiza com o parametro
          if (this.retorno)
            if (!GetValueJsonBoolean(this.parametro.getParametro(), 'new')) {
              let config = this.parametro.getParametro();
              this.controlePaginas.setPaginaAtual(Object(config)['page']);
            } else {
              //'É inclusao ',
              this.controlePaginas.goLast();
            }
          this.getClientes();
        },
        (error: any) => {
          this.globalService.setSpin(false);
          this.controlePaginas = new ControlePaginas(this.tamPagina, 0);
          this.appSnackBar.openFailureSnackBar(
            `Pesquisa Nos Clientes ${messageError(error)}`,
            'OK'
          );
        }
      );
  }

  getGrupos() {
    let par = new ParametroGrupoEco01();
    par.id_empresa = this.globalService.getIdEmpresa();
    par.pagina = 0;
    par.orderby = 'Razão';
    this.globalService.setSpin(true);
    this.inscricaoGetGrupo = this.grupoEconomicoService
      .getGrupoEcos_01(par)
      .subscribe(
        (data: GrupoEcoModel[]) => {
          this.globalService.setSpin(false);
          this.grupos = data;
        },
        (error: any) => {
          this.globalService.setSpin(false);
          this.erro = error;
          this.grupos = [];
          this.appSnackBar.openFailureSnackBar(
            `Falha Nos Grupos Ecônomicos ${messageError(error)}`,
            'OK'
          );
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
      ordenacao:
        this.opcoesOrdenacao[
          GetValueJsonNumber(this.parametro.getParametro(), 'op_ordenacao')
        ],
      campo:
        this.opcoesCampo[
          GetValueJsonNumber(this.parametro.getParametro(), 'op_pesquisar')
        ],
      filtro: GetValueJsonString(this.parametro.getParametro(), 'descricao'),
      grupo: 1,
    });
  }

  getTexto() {
    return MensagensBotoes;
  }

  onChangePage() {
    this.getClientes();
  }

  onChangeParametros() {
    this.getClientesContador();
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
      .subscribe((data: ShowClienteDialogData) => {});
  }

  /* rotinas dos parametros e scroll */

  onSaveConfig() {
    this.updateParametros();
  }

  loadParametros() {
    this.parametro = new ParametroModel();
    this.parametro.id_empresa = this.globalService.getIdEmpresa();
    this.parametro.modulo = 'cliente';
    this.parametro.assinatura = 'V1.00 26/08/23';
    this.parametro.id_usuario = this.globalService.usuario.id;
    this.parametro.parametro = `
    {
      "op_ordenacao": 0,
      "ordenacao": ["Código", "Razão", "Grupo"],
      "op_pesquisar": 1,
      "pesquisar": ["Código", "Razão", "Grupo"],
      "descricao": "",
      "page": 1,
      "new": false,
      "id_retorno":0
    }`;

    this.opcoesOrdenacao = GetValueJsonStringArray(
      this.parametro.getParametro(),
      'ordenacao'
    );
    this.opcoesCampo = GetValueJsonStringArray(
      this.parametro.getParametro(),
      'pesquisar'
    );
    if (this.retorno && this.globalService.estadoFind('cliente') !== null) {
      const par = this.globalService.estadoFind('cliente');
      if (par != null) {
        if (GetValueJsonBoolean(par.getParametro(), 'new')) {
          let config = this.parametro.getParametro();
          Object(config).id_retorno = GetValueJsonNumber(
            par.getParametro(),
            'id_retorno'
          );
          this.parametro.parametro = JSON.stringify(config);
          this.setPosicaoInclusao();
        } else {
          this.controlePaginas.setPaginaAtual(
            GetValueJsonNumber(par.getParametro(), 'page')
          );
          this.parametro.setParametro(par.getParametro());
        }
        this.globalService.estadoDelete(par);
        this.setValues();
      }
    } else {
      this.getParametro();
    }
  }

  setPosicaoInclusao() {
    const config = this.parametro.getParametro();
    Object(config).op_ordenacao = 0;
    Object(config).op_pesquisar = 0;
    Object(config).descricao = '';
    Object(config).new = true;
    this.parametro.setParametro(config);
  }

  getParametro() {
    this.globalService.setSpin(true);
    let par = new ParametroParametro01();
    par.id_empresa = this.parametro.id_empresa;
    par.modulo = this.parametro.modulo;
    par.assinatura = this.parametro.assinatura;
    par.id_usuario = this.parametro.id_usuario;
    par.orderby = 'Usuário';
    this.inscricaoParametro = this.parametrosService
      .getParametrosParametro01(par)
      .subscribe(
        (data: ParametroModel[]) => {
          this.globalService.setSpin(false);
          this.parametro = new ParametroModel();
          this.parametro.id_empresa = data[0].id_empresa;
          this.parametro.modulo = data[0].modulo;
          this.parametro.id_usuario = data[0].id_usuario;
          this.parametro.assinatura = data[0].assinatura;
          this.parametro.parametro = data[0].parametro;
          this.parametro.user_insert = data[0].user_insert;
          this.parametro.user_update = data[0].user_update;
          this.opcoesOrdenacao = GetValueJsonStringArray(
            this.parametro.getParametro(),
            'ordenacao'
          );
          this.opcoesCampo = GetValueJsonStringArray(
            this.parametro.getParametro(),
            'pesquisar'
          );
          this.setValues();
        },
        (error: any) => {
          this.globalService.setSpin(false);
          this.setValues();
        }
      );
  }

  updateParametros() {
    this.globalService.setSpin(true);
    this.parametro.user_insert = this.globalService.usuario.id;
    this.parametro.user_update = this.globalService.usuario.id;
    let config = this.parametro.getParametro();
    Object(config).op_ordenacao = this.opcoesOrdenacao.findIndex(
      (op) => this.parametros.value.ordenacao == op
    );
    Object(config).op_pesquisar = this.opcoesCampo.findIndex(
      (op) => this.parametros.value.campo == op
    );
    Object(config).descricao = this.parametros.value.filtro;
    Object(config).page = 0;
    Object(config).new = false;
    this.parametro.parametro = JSON.stringify(config);
    this.inscricaoParametro = this.parametrosService
      .ParametroAtualiza(this.parametro)
      .subscribe(
        (data: ParametroModel) => {
          this.globalService.setSpin(false);
          this.appSnackBar.openSuccessSnackBar(`Parâmetros Atualizados`, 'OK');
        },
        (error: any) => {
          this.globalService.setSpin(false);
          this.appSnackBar.openFailureSnackBar(
            `Gravação Dos Parametros ${messageError(error)}`,
            'OK'
          );
        }
      );
  }
}
