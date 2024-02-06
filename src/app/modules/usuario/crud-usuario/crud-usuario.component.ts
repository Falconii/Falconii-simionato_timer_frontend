import { GlobalService } from 'src/app/services/global.service';
import {
  GetValueJsonBoolean,
  GetValueJsonNumber,
  GetValueJsonString,
  GetValueJsonStringArray,
  MensagensBotoes,
  messageError,
} from 'src/app/shared/classes/util';
import { UsuariosService } from 'src/app/services/usuarios.service';
import { Component, OnInit, ViewChild } from '@angular/core';
import { Subscription } from 'rxjs';
import { FormBuilder, FormGroup } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { MatSnackBar } from '@angular/material/snack-bar';
import { GrupoUserService } from 'src/app/services/grupo-user.service';
import { CadastroAcoes } from 'src/app/shared/classes/cadastro-acoes';
import { UsuarioQuery01Model } from 'src/app/Models/usuario-query_01-model';
import { GruUserModel } from 'src/app/Models/gru-user-model';
import { ParametroUsuario01 } from 'src/app/parametros/parametro-usuario01';
import { UsuarioModel } from 'src/app/Models/usuario-model';
import { AppSnackbar } from 'src/app/shared/classes/app-snackbar';
import { ControlePaginas } from 'src/app/shared/classes/controle-paginas';
import { ParametroModel } from 'src/app/Models/parametro-model';
import { ParametrosService } from 'src/app/services/parametros.service';
import { ParametroParametro01 } from 'src/app/parametros/parametro-parametro01';
import { CdkVirtualScrollViewport } from '@angular/cdk/scrolling';

@Component({
  selector: 'app-crud-usuario',
  templateUrl: './crud-usuario.component.html',
  styleUrls: ['./crud-usuario.component.css'],
})
export class CrudUsuarioComponent implements OnInit {
  @ViewChild(CdkVirtualScrollViewport) viewPort!: CdkVirtualScrollViewport;
  inscricaoGetAll!: Subscription;
  inscricaoGetFiltro!: Subscription;
  inscricaoGetGrupo!: Subscription;
  inscricaoParametro!: Subscription;
  inscricaoRota!: Subscription;

  usuarios: UsuarioQuery01Model[] = [];

  grupos: GruUserModel[] = [];

  parametros: FormGroup;

  erro: string = '';

  opcoesOrdenacao: string[] = [];

  opcoesCampo: string[] = [];

  controlePaginas: ControlePaginas = new ControlePaginas(0, 0);

  tamPagina: number = 50;

  retorno: boolean = false;

  parametro: ParametroModel = new ParametroModel();

  constructor(
    private formBuilder: FormBuilder,
    private usuariosService: UsuariosService,
    private grupoUserService: GrupoUserService,
    private parametrosService: ParametrosService,
    private globalService: GlobalService,
    private route: ActivatedRoute,
    private router: Router,
    private appSnackBar: AppSnackbar
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
        const par = this.globalService.estadoFind('usuario');
      }
    });
    this.loadParametros();
    this.getGrupos();
  }

  ngOnInit(): void {
    this.getUsuariosContador();
  }

  ngOnDestroy() {
    this.inscricaoGetAll?.unsubscribe();
    this.inscricaoGetFiltro?.unsubscribe();
    this.inscricaoGetGrupo?.unsubscribe();
    this.inscricaoParametro?.unsubscribe();
    this.inscricaoRota?.unsubscribe();
  }

  escolha(opcao: number, usuario?: UsuarioQuery01Model) {
    if (typeof usuario !== 'undefined') {
      let config = this.parametro.getParametro();
      Object(config).new = false;
      Object(config).id_retorno = usuario.id;
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
        '/usuarios/usuario',
        usuario.id_empresa,
        usuario.id,
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
      this.router.navigate(['/usuarios/usuario', 1, 0, opcao]);
    }
  }

  onHome() {
    this.router.navigate(['']);
  }

  getAcoes() {
    return CadastroAcoes;
  }

  getUsuarios() {
    let par = new ParametroUsuario01();

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
      par.grupo.push(this.parametros.value.grupo);

    par.orderby = this.parametros.value.ordenacao;

    par.pagina = this.controlePaginas.getPaginalAtual();

    this.globalService.setSpin(true);
    this.inscricaoGetFiltro = this.usuariosService
      .getusuarios_01(par)
      .subscribe(
        (data: UsuarioQuery01Model[]) => {
          this.globalService.setSpin(false);
          this.usuarios = data;
          const idx = this.usuarios.findIndex(
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
          this.usuarios = [];
          this.appSnackBar.openSuccessSnackBar(
            `Pesquisa Nos Usuários ${messageError(error)}`,
            'OK'
          );
        }
      );
  }

  getUsuariosContador() {
    let par = new ParametroUsuario01();

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
      par.grupo.push(this.parametros.value.grupo);

    par.orderby = this.parametros.value.ordenacao;

    par.contador = 'S';

    this.globalService.setSpin(true);
    this.inscricaoGetFiltro = this.usuariosService
      .getusuarios_01(par)
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
          this.getUsuarios();
        },
        (error: any) => {
          this.globalService.setSpin(false);
          this.controlePaginas = new ControlePaginas(this.tamPagina, 0);
          this.usuarios = [];
          this.appSnackBar.openFailureSnackBar(
            `Pesquisa Nos Usuários ${messageError(error)}`,
            'OK'
          );
        }
      );
  }

  getGrupos() {
    this.globalService.setSpin(true);
    this.inscricaoGetGrupo = this.grupoUserService.getGrupoUsers().subscribe(
      (data: GruUserModel[]) => {
        this.globalService.setSpin(false);
        this.grupos = data;
      },
      (error: any) => {
        this.globalService.setSpin(false);
        this.erro = error;
        this.grupos = [];
        console.log('this.erro', this.erro);
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
      grupo: 900,
    });
  }

  getTexto() {
    return MensagensBotoes;
  }

  onChangePage() {
    this.getUsuariosContador();
  }

  onChangeParametros() {
    this.getUsuariosContador();
  }

  onSaveConfig() {
    this.updateParametros();
  }

  loadParametros() {
    this.parametro = new ParametroModel();
    this.parametro.id_empresa = this.globalService.getIdEmpresa();
    this.parametro.modulo = 'usuario';
    this.parametro.assinatura = 'V1.00 29/08/23';
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
    if (this.retorno && this.globalService.estadoFind('usuario') !== null) {
      const par = this.globalService.estadoFind('usuario');
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
