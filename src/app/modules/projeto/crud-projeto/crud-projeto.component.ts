import { AppSnackbar } from 'src/app/shared/classes/app-snackbar';
import { Component, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { Subscription } from 'rxjs';
import { ActivatedRoute, Router } from '@angular/router';
import { CadastroAcoes } from 'src/app/shared/classes/cadastro-acoes';
import {
  GetValueJsonBoolean,
  GetValueJsonNumber,
  GetValueJsonString,
  GetValueJsonStringArray,
  MensagensBotoes,
  getFirstName,
  messageError,
} from 'src/app/shared/classes/util';
import { ControlePaginas } from 'src/app/shared/classes/controle-paginas';
import { ProjetoModel } from 'src/app/Models/projeto-model';
import { ParametroProjeto01 } from 'src/app/parametros/parametro-projeto01';
import { ProjetosService } from 'src/app/services/projetos.service';
import { GlobalService } from 'src/app/services/global.service';
import { ParametroModel } from 'src/app/Models/parametro-model';
import { ParametroParametro01 } from 'src/app/parametros/parametro-parametro01';
import { ParametrosService } from 'src/app/services/parametros.service';
import { CdkVirtualScrollViewport } from '@angular/cdk/scrolling';

@Component({
  selector: 'app-crud-projeto',
  templateUrl: './crud-projeto.component.html',
  styleUrls: ['./crud-projeto.component.css'],
})
export class CrudProjetoComponent implements OnInit {
  @ViewChild(CdkVirtualScrollViewport) viewPort!: CdkVirtualScrollViewport;
  inscricaoGetAll!: Subscription;
  inscricaoGetFiltro!: Subscription;
  inscricaoGetGrupo!: Subscription;
  inscricaoParametro!: Subscription;
  inscricaoRota!: Subscription;

  projetos: ProjetoModel[] = [];

  parametros: FormGroup;

  //inclusao: ProjetoModel;

  erro: string = '';

  opcoesOrdenacao = ['Código', 'Descrição', 'Fantasia'];

  opcoesCampo = ['Código', 'Descrição', 'Fantasia'];

  controlePaginas: ControlePaginas = new ControlePaginas(0, 0);

  tamPagina: number = 50;

  retorno: boolean = false;

  parametro: ParametroModel = new ParametroModel();

  autorizado: boolean = false;

  constructor(
    private formBuilder: FormBuilder,
    private projetosServices: ProjetosService,
    private globalService: GlobalService,
    private parametrosService: ParametrosService,
    private route: ActivatedRoute,
    private router: Router,
    private appSnackBar: AppSnackbar
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
        const par = this.globalService.estadoFind('projetos');
      }
    });
    this.autorizado = this.globalService.okDirAdm();
  }

  ngOnInit(): void {
    this.loadParametros();
  }

  ngOnDestroy() {
    this.inscricaoGetAll?.unsubscribe();
    this.inscricaoGetFiltro?.unsubscribe();
    this.inscricaoGetGrupo?.unsubscribe();
    this.inscricaoParametro?.unsubscribe();
    this.inscricaoRota?.unsubscribe();
  }

  escolha(opcao: number, projeto?: ProjetoModel) {
    if (opcao == 99) {
      if (typeof projeto !== 'undefined') {
        let config = this.parametro.getParametro();
        Object(config).new = false;
        Object(config).id_retorno = projeto.id;
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
      }
      this.router.navigate([
        'projetos/anexaratividade',
        projeto?.id_empresa,
        projeto?.id,
        'NULL',
      ]);
    }
    if (opcao == 98) {
      let config = this.parametro.getParametro();
      Object(config).new = false;
      Object(config).id_retorno = projeto?.id;
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
        'projetos/dashboardv1',
        projeto?.id_empresa,
        projeto?.id,
      ]);
    }
    if (opcao == 97) {
      let config = this.parametro.getParametro();
      Object(config).new = false;
      Object(config).id_retorno = projeto?.id;
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
        'projetos/financeiro',
        projeto?.id_empresa,
        projeto?.id,
      ]);
    }
    if (opcao < 97) {
      if (typeof projeto !== 'undefined') {
        let config = this.parametro.getParametro();
        Object(config).new = false;
        Object(config).id_retorno = projeto.id;
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
          'projetos/projeto',
          projeto.id_empresa,
          projeto.id,
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
        this.router.navigate(['/projetos/projeto', 1, 0, opcao]);
      }
    }
  }

  getAcoes() {
    return CadastroAcoes;
  }

  getProjetos() {
    let par = new ParametroProjeto01();

    par.id_empresa = this.globalService.getIdEmpresa();

    if (this.parametros.value.campo == 'Código') {
      let key = parseInt(this.parametros.value.filtro, 10);
      if (isNaN(key)) {
        par.id = 0;
      } else {
        par.id = key;
      }
    }

    if (this.parametros.value.campo == 'Descrição')
      par.descricao = this.parametros.value.filtro.toUpperCase();

    if (this.parametros.value.campo == 'Fantasia')
      par.cli_razao = this.parametros.value.filtro.toUpperCase();

    par.orderby = this.parametros.value.ordenacao;

    par.pagina = this.controlePaginas.getPaginalAtual();

    par.contador = 'N';

    if (this.globalService.getUsuario().id == 16) par.controle = '';

    this.globalService.setSpin(true);
    this.inscricaoGetFiltro = this.projetosServices
      .getProjetos_01(par)
      .subscribe(
        (data: ProjetoModel[]) => {
          this.globalService.setSpin(false);
          this.projetos = data;
          const idx = this.projetos.findIndex(
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
          this.globalService.setSpin(false);
          if (error.error.message == 'Nehuma Informação Para Esta Consulta.') {
            this.projetos = [];
            this.appSnackBar.openSuccessSnackBar(
              'Nenhuma Informação Encontrada Para Esta Consulta!',
              'OK'
            );
          }
        }
      );
  }

  getProjetosContador() {
    let par = new ParametroProjeto01();

    par.id_empresa = this.globalService.getIdEmpresa();

    if (this.parametros.value.campo == 'Código') {
      let key = parseInt(this.parametros.value.filtro, 10);
      if (isNaN(key)) {
        par.id = 0;
      } else {
        par.id = key;
      }
    }

    if (this.parametros.value.campo == 'Descrição')
      par.descricao = this.parametros.value.filtro.toUpperCase();

    if (this.parametros.value.campo == 'Fantasia')
      par.cli_razao = this.parametros.value.filtro.toUpperCase();

    par.orderby = this.parametros.value.ordenacao;

    par.contador = 'S';

    par.tamPagina = this.tamPagina;

    if (this.globalService.getUsuario().id == 16) par.controle = '';

    this.globalService.setSpin(true);
    this.inscricaoGetFiltro = this.projetosServices
      .getProjetos_01(par)
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
          this.getProjetos();
        },
        (error: any) => {
          this.globalService.setSpin(false);
          this.projetos = [];
          this.controlePaginas = new ControlePaginas(this.tamPagina, 0);
          this.appSnackBar.openFailureSnackBar(
            `Pesquisa Nos Projetos ${messageError(error)}`,
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
    this.getProjetos();
  }

  onHome() {
    this.router.navigate(['']);
  }

  onChangeParametros() {
    this.getProjetosContador();
  }

  onSaveConfig() {
    this.updateParametros();
  }

  loadParametros() {
    this.parametro = new ParametroModel();
    this.parametro.id_empresa = this.globalService.getIdEmpresa();
    this.parametro.modulo = 'projeto';
    this.parametro.assinatura = 'V1.00 29/08/23';
    this.parametro.id_usuario = this.globalService.usuario.id;
    this.parametro.parametro = `
    {
      "op_ordenacao": 0,
      "ordenacao": ["Código", "Descrição", "Fantasia"],
      "op_pesquisar": 1,
      "pesquisar": ["Código", "Descrição", "Fantasia"],
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
    if (this.retorno && this.globalService.estadoFind('projeto') !== null) {
      const par = this.globalService.estadoFind('projeto');
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
      this.getProjetosContador();
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
          this.getProjetosContador();
        },
        (error: any) => {
          this.globalService.setSpin(false);
          this.setValues();
          this.getProjetosContador();
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

  getTipo(idx: number): string {
    return this.globalService.getTipoContrato(idx);
  }
}
