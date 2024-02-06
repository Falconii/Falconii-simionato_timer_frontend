import { DatePipe } from '@angular/common';
import { CdkVirtualScrollViewport } from '@angular/cdk/scrolling';
import { Component, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';
import { ActivatedRoute, Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { FeriadoModel } from 'src/app/Models/feriado-model';
import { FeriadoPonteModel } from 'src/app/Models/feriado-ponte-model';
import { ParametroModel } from 'src/app/Models/parametro-model';
import { ParametroFeriado01 } from 'src/app/parametros/parametro-feriado01';
import { ParametroParametro01 } from 'src/app/parametros/parametro-parametro01';
import { FeriadosService } from 'src/app/services/feriados.service';
import { GlobalService } from 'src/app/services/global.service';
import { ParametrosService } from 'src/app/services/parametros.service';
import { ValidatorDate } from 'src/app/shared/Validators/validator-date';
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
import { QuestionDialogData } from 'src/app/shared/components/question-dialog/Question-Dialog-Data';
import { QuestionDialogComponent } from 'src/app/shared/components/question-dialog/question-dialog.component';
import { ViewDialogData } from '../alter-descricao-dialog/view-dialog-data';
import { AlterDescricaoDialogComponent } from '../alter-descricao-dialog/alter-descricao-dialog.component';

@Component({
  selector: 'app-crud-ponte',
  templateUrl: './crud-ponte.component.html',
  styleUrls: ['./crud-ponte.component.css'],
})
export class CrudPonteComponent implements OnInit {
  @ViewChild(CdkVirtualScrollViewport) viewPort!: CdkVirtualScrollViewport;
  inscricaoGetAll!: Subscription;
  inscricaoParametro!: Subscription;
  inscricaoRota!: Subscription;
  inscricaoCrud!: Subscription;

  feriados: FeriadoPonteModel[] = [];

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
    public questionDialog: MatDialog,
    public alterDialog: MatDialog
  ) {
    this.parametros = formBuilder.group({
      ordenacao: [null],
      campo: [null],
      filtro: [null],
      data: [{ value: '' }, [ValidatorDate(false)]],
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
    this.inscricaoCrud?.unsubscribe();
  }

  escolha(opcao: number, feriado?: FeriadoPonteModel) {
    if (opcao == 10) opcao = 98;
    if (opcao == this.getAcoes().Consulta) opcao = 97;
    if (typeof feriado !== 'undefined') {
      if (opcao == this.getAcoes().Exclusao) {
        this.onDelete(feriado);
        return;
      }
      if (opcao == this.getAcoes().Edicao) {
        this.onUpdate(feriado);
        return;
      }
      this.router.navigate([
        '/pontes/ponte',
        feriado.id_empresa,
        feriado.data,
        opcao,
      ]);
    } else {
      this.router.navigate([
        '/pontes/ponte',
        this.globalService.id_empresa,
        '',
        99,
      ]);
    }
  }

  getAcoes() {
    return CadastroAcoes;
  }

  getFeriados() {
    let par = new ParametroFeriado01();

    par.id_empresa = 1;

    par.id_tipo = 2; //só ponte

    par.formato = 'P';

    if (this.parametros.value.campo == 'Data')
      par.data = this.parametros.value.data;

    if (this.parametros.value.campo == 'Descrição')
      par.descricao = this.parametros.value.filtro.toUpperCase();

    par.orderby = this.parametros.value.ordenacao;

    par.contador = 'N';

    par.tamPagina = this.tamPagina;

    par.pagina = this.controlePaginas.getPaginalAtual();

    this.globalService.setSpin(true);

    this.inscricaoGetAll = this.feriadoService.getPontes_01(par).subscribe(
      (data: FeriadoPonteModel[]) => {
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
        this.appSnackBar.openWarningnackBar(
          `Pesquisa Nos Feriados ${messageError(error)}`,
          'OK'
        );
      }
    );
  }

  getFeriadosContador() {
    let par = new ParametroFeriado01();

    par.id_empresa = 1;

    par.id_tipo = 2; //só ponte

    par.formato = 'P';

    if (this.parametros.value.campo == 'Data')
      par.data = this.parametros.value.data;

    if (this.parametros.value.campo == 'Descrição')
      par.descricao = this.parametros.value.filtro.toUpperCase();

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
        this.appSnackBar.openWarningnackBar(
          `Pesquisa Em Pontes ${messageError(error)}`,
          'OK'
        );
      }
    );
  }

  deletePonte(ponte: FeriadoPonteModel) {
    const searchRegExp = /\//g;
    this.globalService.setSpin(true);
    this.inscricaoCrud = this.feriadoService
      .PonteDelete(ponte.id_empresa, ponte.data.replace(searchRegExp, '_'))
      .subscribe(
        (data: any) => {
          this.globalService.setSpin(false);
          this.getFeriadosContador();
        },
        (error: any) => {
          this.globalService.setSpin(false);
          this.appSnackBar.openWarningnackBar(
            `Falha Na Exclusão ${messageError(error)}`,
            'OK'
          );
        }
      );
  }

  updatePonte(ponte: FeriadoPonteModel) {
    this.globalService.setSpin(true);
    this.inscricaoCrud = this.feriadoService
      .FeriadoAlterPonteDescricao(ponte)
      .subscribe(
        (data: any) => {
          this.globalService.setSpin(false);
          this.getFeriadosContador();
        },
        (error: any) => {
          this.globalService.setSpin(false);
          this.appSnackBar.openWarningnackBar(
            `Falha Na Atualizacao ${messageError(error)}`,
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
          this.appSnackBar.openWarningnackBar(
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
      data: '',
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

  /* rotinas dos parametros */

  loadParametros() {
    this.parametro = new ParametroModel();
    this.parametro.id_empresa = this.globalService.getIdEmpresa();
    this.parametro.modulo = 'conta';
    this.parametro.assinatura = 'V1.00 19/10/2023';
    this.parametro.id_usuario = this.globalService.usuario.id;
    this.parametro.parametro = `
      {
        "op_ordenacao": 0,
        "ordenacao": ["Data","Descrição"],
        "op_pesquisar": 1,
        "pesquisar": ["Data","Descrição"],
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
        this.setValues();
        this.getFeriadosContador();
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

  NoValidtouchedOrDirtyCd(campo: string): boolean {
    if (
      !this.parametros.get(campo)?.valid &&
      (this.parametros.get(campo)?.touched || this.parametros.get(campo)?.dirty)
    ) {
      return true;
    }
    return false;
  }

  isData(): Boolean {
    if (this.parametros.value.campo == 'Data') {
      return true;
    } else {
      return false;
    }
  }

  onDelete(ponte: FeriadoPonteModel) {
    const data: QuestionDialogData = new QuestionDialogData();
    data.mensagem01 = 'Confirma A Exclusão Da Ponte';
    data.mensagem02 = `${ponte.data} ${ponte.descricao}`;
    const dialogConfig = new MatDialogConfig();

    // The user can't close the dialog by clicking outside its body
    dialogConfig.disableClose = true;
    dialogConfig.id = 'question-dialog';
    dialogConfig.width = '600px';
    dialogConfig.data = data;
    const modalDialog = this.questionDialog
      .open(QuestionDialogComponent, dialogConfig)
      .beforeClosed()
      .subscribe((data: QuestionDialogData) => {
        if (typeof data !== 'undefined' && data.resposta === 'S') {
          this.deletePonte(ponte);
        }
      });
  }

  onUpdate(ponte: FeriadoPonteModel) {
    const data: ViewDialogData = new ViewDialogData();
    data.texto = 'Alteração Da Descrição';
    data.descricao = ponte.descricao;
    const dialogConfig = new MatDialogConfig();

    dialogConfig.disableClose = true;
    dialogConfig.id = 'descri-dialog';
    dialogConfig.width = '600px';
    dialogConfig.data = data;
    const modalDialog = this.questionDialog
      .open(AlterDescricaoDialogComponent, dialogConfig)
      .beforeClosed()
      .subscribe((data: ViewDialogData) => {
        if (typeof data !== 'undefined' && data.processar) {
          ponte.descricao = data.descricao;
          this.updatePonte(ponte);
        }
      });
  }

  onRefresh() {
    if (this.parametros.valid) {
      this.getFeriadosContador();
    } else {
      this.parametros.markAllAsTouched();
      this.appSnackBar.openSuccessSnackBar(
        `Formulário Com Campos Inválidos.`,
        'OK'
      );
    }
  }
}
