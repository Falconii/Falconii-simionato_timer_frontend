import { ApiBrasilService } from './../../../services/api-brasil.service';
import { CdkVirtualScrollViewport } from '@angular/cdk/scrolling';
import { Component, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';
import { ActivatedRoute, Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { BrasilApiModel } from 'src/app/Models/brasil-api-model';
import { FeriadoModel } from 'src/app/Models/feriado-model';
import { ParametroModel } from 'src/app/Models/parametro-model';
import { ParametroFeriado01 } from 'src/app/parametros/parametro-feriado01';
import { ParametroParametro01 } from 'src/app/parametros/parametro-parametro01';
import { FeriadosService } from 'src/app/services/feriados.service';
import { GlobalService } from 'src/app/services/global.service';
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
  aaaammddddmmaaaa,
} from 'src/app/shared/classes/util';
import { NovoAnoDialogData } from '../novo-ano-dialog/novo-ano-dialog-data';
import { NovoAnoDialogComponent } from '../novo-ano-dialog/novo-ano-dialog.component';

@Component({
  selector: 'app-crud-feriado',
  templateUrl: './crud-feriado.component.html',
  styleUrls: ['./crud-feriado.component.css'],
})
export class CrudFeriadoComponent implements OnInit {
  @ViewChild(CdkVirtualScrollViewport) viewPort!: CdkVirtualScrollViewport;
  inscricaoGetAll!: Subscription;
  inscricaoParametro!: Subscription;
  inscricaoRota!: Subscription;
  inscricaoApiBrasil!: Subscription;
  inscricaoSaveFeriado!: Subscription;

  lsFeriadosBrasilApi: BrasilApiModel[] = [];

  feriados: FeriadoModel[] = [];

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
    private feriadoService: FeriadosService,
    private router: Router,
    private route: ActivatedRoute,
    private appSnackBar: AppSnackbar,
    private globalService: GlobalService,
    private parametrosService: ParametrosService,
    private apiBrasilService: ApiBrasilService,
    public novoAnoDialog: MatDialog
  ) {
    this.parametros = formBuilder.group({
      ordenacao: [null],
      campo: [null],
      filtro: [null],
    });
    this.inscricaoRota = route.params.subscribe((params: any) => {
      if (typeof params.retorno == 'undefined') {
        this.retorno = false;
      } else {
        this.retorno = true;
        const par = this.globalService.estadoFind('feriado');
      }
    });
  }

  ngOnInit(): void {
    this.loadParametros();
  }

  ngOnDestroy() {
    this.inscricaoGetAll?.unsubscribe();
    this.inscricaoParametro?.unsubscribe();
    this.inscricaoRota?.unsubscribe();
    this.inscricaoApiBrasil?.unsubscribe();
    this.inscricaoSaveFeriado?.unsubscribe();
  }

  escolha(opcao: number, feriado?: FeriadoModel) {
    if (typeof feriado !== 'undefined') {
      let config = this.parametro.getParametro();
      Object(config).new = false;
      Object(config).id_retorno = feriado.data.toString();
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
        '/feriados/feriado',
        feriado.id_empresa,
        feriado.id_usuario,
        feriado.id_tipo,
        feriado.data,
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
      this.router.navigate([
        '/feriados/feriado',
        this.globalService.getIdEmpresa,
        this.globalService.getUsuario().id,
        0,
        '',
        opcao,
      ]);
    }
  }

  getAcoes() {
    return CadastroAcoes;
  }

  getFeriados() {
    let par = new ParametroFeriado01();

    par.id_empresa = 1;

    par.id_tipo = 1;

    par.orderby = 'Data';

    if (this.parametros.value.campo == 'Data')
      par.data = this.parametros.value.filtro;

    if (this.parametros.value.campo == 'Descrição')
      par.descricao = this.parametros.value.filtro.toUpperCase();

    if (this.parametros.value.campo == 'Ano') {
      par.ano = this.parametros.value.filtro;
    }

    if (this.parametros.value.campo == 'Tipo') {
      par.id_tipo = 0;
    }

    par.orderby = this.parametros.value.ordenacao;

    par.contador = 'N';

    par.tamPagina = this.tamPagina;

    par.pagina = this.controlePaginas.getPaginalAtual();

    this.globalService.setSpin(true);

    this.inscricaoGetAll = this.feriadoService.getFeriados_01(par).subscribe(
      (data: FeriadoModel[]) => {
        this.globalService.setSpin(false);
        this.feriados = data;
        const idx = this.feriados.findIndex(
          (fer) =>
            fer.data ==
            GetValueJsonString(this.parametro.getParametro(), 'id_retorno')
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
        this.feriados = [];
        this.appSnackBar.openFailureSnackBar(
          `Pesquisa Nos Feriados ${messageError(error)}`,
          'OK'
        );
      }
    );
  }

  getFeriadosContador() {
    let par = new ParametroFeriado01();

    par.id_empresa = 1;

    par.id_tipo = 1;

    par.orderby = 'Data';

    if (this.parametros.value.campo == 'Data')
      par.data = this.parametros.value.filtro;

    if (this.parametros.value.campo == 'Descrição')
      par.descricao = this.parametros.value.filtro.toUpperCase();

    if (this.parametros.value.campo == 'Ano') {
      par.ano = this.parametros.value.filtro;
    }

    if (this.parametros.value.campo == 'Tipo') {
      par.id_tipo = 0;
    }

    par.ano = this.parametros.value.filtro;

    par.orderby = this.parametros.value.ordenacao;

    par.contador = 'S';

    par.tamPagina = this.tamPagina;

    this.globalService.setSpin(true);
    this.inscricaoGetAll = this.feriadoService.getFeriados_01(par).subscribe(
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
        this.getFeriados();
      },
      (error: any) => {
        this.globalService.setSpin(false);
        this.controlePaginas = new ControlePaginas(this.tamPagina, 0);
        this.appSnackBar.openFailureSnackBar(
          `Pesquisa Nos Feriados ${messageError(error)}`,
          'OK'
        );
      }
    );
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
          this.getFeriadosContador();
        },
        (error: any) => {
          this.globalService.setSpin(false);
          this.setValues();
          this.getFeriadosContador();
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
    });
  }

  getTexto() {
    return MensagensBotoes;
  }

  onChangePage() {
    this.getFeriados();
  }

  onChangeParametros() {
    this.getFeriadosContador();
  }

  onHome() {
    this.router.navigate(['']);
  }

  onSaveConfig() {
    this.updateParametros();
  }

  onNovoAno() {
    const data: NovoAnoDialogData = new NovoAnoDialogData();
    data.titulo = 'FERIADOS ANUAIS';
    const dialogConfig = new MatDialogConfig();

    // The user can't close the dialog by clicking outside its body
    dialogConfig.disableClose = true;
    dialogConfig.id = 'question-dialog';
    dialogConfig.width = '600px';
    dialogConfig.width = '600px';
    dialogConfig.data = data;
    const modalDialog = this.novoAnoDialog
      .open(NovoAnoDialogComponent, dialogConfig)
      .beforeClosed()
      .subscribe((data: NovoAnoDialogData) => {
        if (typeof data !== 'undefined' && data.processar) {
          this.loadApiBrasilFeriados(data.ano);
        }
      });
  }

  /* rotinas dos parametros */

  loadParametros() {
    this.parametro = new ParametroModel();
    this.parametro.id_empresa = this.globalService.getIdEmpresa();
    this.parametro.modulo = 'feriado';
    this.parametro.assinatura = 'V1.00 21/03/2024';
    this.parametro.id_usuario = this.globalService.usuario.id;
    this.parametro.parametro = `
    {
      "op_ordenacao": 0,
      "ordenacao": ["Data", "Descrição"],
      "op_pesquisar": 1,
      "pesquisar": ["Data", "Descrição", "Ano" , "Tipo"],
      "descricao": "",
      "page": 1,
      "new": false,
      "id_retorno":""
    }`;

    this.opcoesOrdenacao = GetValueJsonStringArray(
      this.parametro.getParametro(),
      'ordenacao'
    );
    this.opcoesCampo = GetValueJsonStringArray(
      this.parametro.getParametro(),
      'pesquisar'
    );
    if (this.retorno && this.globalService.estadoFind('feriado') !== null) {
      const par = this.globalService.estadoFind('feriado');
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
      }
      this.setValues();
      this.getFeriadosContador();
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

  loadApiBrasilFeriados(ano: string) {
    this.globalService.setSpin(true);
    this.inscricaoApiBrasil = this.apiBrasilService.getFeriados(ano).subscribe(
      (data: BrasilApiModel[]) => {
        this.globalService.setSpin(false);
        this.lsFeriadosBrasilApi = data;
        console.log(this.lsFeriadosBrasilApi);
        this.saveFeriados(ano);
      },
      (error: any) => {
        this.globalService.setSpin(false);
        this.appSnackBar.openFailureSnackBar(
          `Pesquisa API BRASIL ${messageError(error)}`,
          'OK'
        );
      }
    );
  }

  saveFeriados(ano: string) {
    let lsFeriadosToSave: FeriadoModel[] = [];
    this.globalService.setSpin(true);
    this.lsFeriadosBrasilApi.forEach((fer) => {
      const feriado = new FeriadoModel();
      feriado.id_empresa = this.globalService.id_empresa;
      feriado.id_usuario = 0;
      feriado.id_tipo = 1;
      feriado.id_nivel = 3;
      feriado.data = aaaammddddmmaaaa(fer.date);
      feriado.descricao = fer.name.toUpperCase();
      feriado.user_insert = this.globalService.usuario.id;

      lsFeriadosToSave.push(feriado);
    });
    //adiciona dia da conciencia negra
    const conciencia = new FeriadoModel();
    conciencia.id_empresa = this.globalService.id_empresa;
    conciencia.id_usuario = 0;
    conciencia.id_tipo = 1;
    conciencia.id_nivel = 1;
    conciencia.data = '20/11/' + ano;
    conciencia.descricao = 'DIA DA CONCIÊNCIA NEGRA';
    conciencia.user_insert = this.globalService.usuario.id;

    lsFeriadosToSave.push(conciencia);

    //adiciona dia da conciencia negra
    const niver = new FeriadoModel();
    niver.id_empresa = this.globalService.id_empresa;
    niver.id_usuario = 0;
    niver.id_tipo = 1;
    niver.id_nivel = 1;
    niver.data = '08/12/' + ano;
    niver.descricao = 'NOSSA SENHARA - PADROEIRA CPS';
    niver.user_insert = this.globalService.usuario.id;

    lsFeriadosToSave.push(niver);

    this.inscricaoSaveFeriado = this.feriadoService
      .FeriadoinsertAllFeriados(lsFeriadosToSave)
      .subscribe(
        (data: any) => {
          this.globalService.setSpin(false);
          this.appSnackBar.openSuccessSnackBar(`${data.message}`, 'OK');
        },
        (error: any) => {
          this.globalService.setSpin(false);
          this.appSnackBar.openFailureSnackBar(
            `Inclusão De Feriados ${messageError(error)}`,
            'OK'
          );
        }
      );
  }
}
