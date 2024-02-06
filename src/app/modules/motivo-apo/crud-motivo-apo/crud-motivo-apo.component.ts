import { GlobalService } from 'src/app/services/global.service';
import { ParametroMotivoApo01 } from '../../../parametros/parametro-motivo-apo01';
import { MotivoApoService } from '../../../services/motivo-apo.service';
import { MotivoApoModel } from '../../../Models/motivo-apo-model';
import { Component, OnInit, ViewChild } from '@angular/core';
import { Subscription, Subscriber } from 'rxjs';
import { FormBuilder, FormGroup } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { CadastroAcoes } from 'src/app/shared/classes/cadastro-acoes';
import {
  GetValueJsonBoolean,
  GetValueJsonNumber,
  GetValueJsonString,
  GetValueJsonStringArray,
  MensagensBotoes,
  messageError,
} from 'src/app/shared/classes/util';
import { AppSnackbar } from 'src/app/shared/classes/app-snackbar';
import { ControlePaginas } from 'src/app/shared/classes/controle-paginas';
import { ParametroModel } from 'src/app/Models/parametro-model';
import { ParametrosService } from 'src/app/services/parametros.service';
import { ParametroParametro01 } from 'src/app/parametros/parametro-parametro01';
import { CdkVirtualScrollViewport } from '@angular/cdk/scrolling';

@Component({
  selector: 'app-crud-motivo-apo',
  templateUrl: './crud-motivo-apo.component.html',
  styleUrls: ['./crud-motivo-apo.component.css'],
})
export class CrudMotivoApoComponent implements OnInit {
  @ViewChild(CdkVirtualScrollViewport) viewPort!: CdkVirtualScrollViewport;
  inscricaoGetAll!: Subscription;
  inscricaoGetFiltro!: Subscription;
  inscricaoParametro!: Subscription;
  inscricaoRota!: Subscription;

  motivos: MotivoApoModel[] = [];

  parametros: FormGroup;

  opcoesOrdenacao: string[] = [];

  opcoesCampo: string[] = [];

  tamPagina = 50;

  controlePaginas: ControlePaginas = new ControlePaginas(this.tamPagina, 0);

  retorno: boolean = false;

  parametro: ParametroModel = new ParametroModel();

  constructor(
    private formBuilder: FormBuilder,
    private motivoApoService: MotivoApoService,
    private router: Router,
    private appSnackBar: AppSnackbar,
    private globalService: GlobalService,
    private parametrosService: ParametrosService,
    private route: ActivatedRoute
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
        const par = this.globalService.estadoFind('economico');
      }
    });
    this.loadParametros();
  }

  ngOnInit(): void {
    this.getmotivosContador();
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

  ngOnDestroy() {
    this.inscricaoGetAll?.unsubscribe();
    this.inscricaoGetFiltro?.unsubscribe();
    this.inscricaoParametro?.unsubscribe();
    this.inscricaoRota?.unsubscribe();
  }

  escolha(opcao: number, motivo?: MotivoApoModel) {
    if (typeof motivo != 'undefined') {
      let config = this.parametro.getParametro();
      Object(config).new = false;
      Object(config).id_retorno = motivo.codigo;
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
        '/motivos/motivo',
        motivo.id_empresa,
        motivo.codigo,
        opcao,
      ]);
    } else {
      let config = this.parametro.getParametro();
      Object(config).new = false;
      Object(config).id_retorno = '';
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
      this.router.navigate(['/motivos/motivo', 1, '', opcao]);
    }
  }

  getAcoes() {
    return CadastroAcoes;
  }

  getmotivos() {
    let par = new ParametroMotivoApo01();

    par.id_empresa = 1;

    if (this.parametros.value.campo == 'Código')
      par.codigo = this.parametros.value.filtro.toUpperCase();

    if (this.parametros.value.campo == 'Motivo')
      par.motivo = this.parametros.value.filtro.toUpperCase();

    par.orderby = this.parametros.value.ordenacao;

    par.pagina = this.controlePaginas.getPaginalAtual();

    par.contador = 'N';

    par.tamPagina = this.tamPagina;

    if (this.globalService.getUsuario().id == 16) par.controle = '';

    this.globalService.setSpin(true);
    this.inscricaoGetFiltro = this.motivoApoService
      .getMotivoApos_01(par)
      .subscribe(
        (data: MotivoApoModel[]) => {
          this.globalService.setSpin(false);
          this.motivos = data;
          const idx = this.motivos.findIndex(
            (cli) =>
              cli.codigo ==
              GetValueJsonString(this.parametro.getParametro(), 'id_retorno')
          );
          setTimeout(() => this.viewPort.scrollToIndex(idx), 10);
          this.retorno = false;
          let config = this.parametro.getParametro();
          Object(config).id_retorno = '';
          Object(config).new = false;
          this.parametro.parametro = JSON.stringify(config);
        },
        (error: any) => {
          let config = this.parametro.getParametro();
          Object(config).id_retorno = '';
          Object(config).new = false;
          this.retorno = false;
          this.globalService.setSpin(false);
          this.motivos = [];
          this.appSnackBar.openFailureSnackBar(
            `Pesquisa Nos Motivos De Lançamento ${messageError(error)}`,
            'OK'
          );
        }
      );
  }

  getmotivosContador() {
    let par = new ParametroMotivoApo01();

    par.id_empresa = 1;

    if (this.parametros.value.campo == 'Código')
      par.codigo = this.parametros.value.filtro.toUpperCase();

    if (this.parametros.value.campo == 'Motivo')
      par.motivo = this.parametros.value.filtro.toUpperCase();

    par.orderby = this.parametros.value.ordenacao;

    par.contador = 'S';

    par.tamPagina = this.tamPagina;

    this.globalService.setSpin(true);
    this.inscricaoGetFiltro = this.motivoApoService
      .getMotivoApos_01(par)
      .subscribe(
        (data: any) => {
          console.log('retorno do contador: ', data);
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
          this.getmotivos();
        },
        (error: any) => {
          this.globalService.setSpin(false);
          this.motivos = [];
          this.controlePaginas = new ControlePaginas(this.tamPagina, 0);
          this.appSnackBar.openFailureSnackBar(
            `Pesquisa Nos Motivos De Lançmento ${messageError(error)}`,
            'OK'
          );
        }
      );
  }

  getTexto() {
    return MensagensBotoes;
  }

  onChangePage() {
    this.getmotivos();
  }

  onChangeParametros() {
    this.getmotivosContador();
  }

  onHome() {
    this.router.navigate(['']);
  }

  onSaveConfig() {
    this.updateParametros();
  }

  /* rotinas dos parametros */

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
          console.log('achei...', data);
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

  loadParametros() {
    this.parametro = new ParametroModel();
    this.parametro.id_empresa = this.globalService.getIdEmpresa();
    this.parametro.modulo = 'motivo';
    this.parametro.assinatura = 'V1.00 30/08/23';
    this.parametro.id_usuario = this.globalService.usuario.id;
    this.parametro.parametro = `
    {
      "op_ordenacao": 0,
      "ordenacao": ["Código", "Motivo"],
      "op_pesquisar": 1,
      "pesquisar": ["Código", "Motivo"],
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
    if (this.retorno && this.globalService.estadoFind('motivo') !== null) {
      const par = this.globalService.estadoFind('motivo');
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
}
