import { TipoConta } from './../../../shared/classes/tipo-conta';
import { CadastroAcoes } from 'src/app/shared/classes/cadastro-acoes';
import { Component, OnInit } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  MinValidator,
  Validators,
} from '@angular/forms';
import { FeriadoModel } from 'src/app/Models/feriado-model';
import { Subscription } from 'rxjs';
import { FeriadosService } from 'src/app/services/feriados.service';
import { GlobalService } from 'src/app/services/global.service';
import { ActivatedRoute, Router } from '@angular/router';
import { AppSnackbar } from 'src/app/shared/classes/app-snackbar';
import { ValidatorStringLen } from 'src/app/shared/Validators/validator-string-len';
import { TipoData } from 'src/app/shared/classes/tipo-data';
import { NivelData } from 'src/app/shared/classes/nivel-data';
import { messageError } from 'src/app/shared/classes/util';
import { ParametroUsuario01 } from 'src/app/parametros/parametro-usuario01';
import { UsuariosService } from 'src/app/services/usuarios.service';
import { UsuarioModel } from 'src/app/Models/usuario-model';
import { ParametroAtividade01 } from 'src/app/parametros/parametro-atividade01';
import { AtividadesService } from 'src/app/services/atividades.service';
import { ProjetosService } from 'src/app/services/projetos.service';
import { ProjetoModel } from 'src/app/Models/projeto-model';
import { AtividadeQuery_01Model } from 'src/app/Models/atividade-query_01-model';
import { ValidatorDate } from 'src/app/shared/Validators/validator-date';

@Component({
  selector: 'app-especial-view',
  templateUrl: './especial-view.component.html',
  styleUrls: ['./especial-view.component.css'],
})
export class EspecialViewComponent implements OnInit {
  tipos_data: TipoData[] = this.globalService.getlsTiposData();
  niveis_data: NivelData[] = this.globalService.getlsNiveisData();

  formulario: FormGroup;

  feriado: FeriadoModel = new FeriadoModel();

  acao: string = 'Sem Definição';

  idAcao: number = CadastroAcoes.Inclusao;

  readOnly: boolean = true;

  inscricaoGetFeriado!: Subscription;
  inscricaoGetUsuarios!: Subscription;
  inscricaoRota!: Subscription;
  inscricaoAcao!: Subscription;
  inscricaoAtividades!: Subscription;
  inscricaoGetProjeto!: Subscription;

  labelCadastro: string = 'Cadastro De Datas Especiais';

  id_empresa: number = 0;
  id_usuario: number = 0;
  id_tipo: number = 0;
  data: string = '';

  lsUsuarios: UsuarioModel[] = [];

  contrato: ProjetoModel = new ProjetoModel();

  conta: AtividadeQuery_01Model = new AtividadeQuery_01Model();

  grupo: AtividadeQuery_01Model = new AtividadeQuery_01Model();
  grupos: AtividadeQuery_01Model[] = [];

  atividade: AtividadeQuery_01Model = new AtividadeQuery_01Model();
  atividades: AtividadeQuery_01Model[] = [];

  constructor(
    private formBuilder: FormBuilder,
    private feriadosService: FeriadosService,
    private usuariosService: UsuariosService,
    private projetosService: ProjetosService,
    private atividadesService: AtividadesService,
    private globalService: GlobalService,
    private route: ActivatedRoute,
    private router: Router,
    private appSnackBar: AppSnackbar
  ) {
    this.formulario = formBuilder.group({
      data: [{ value: '' }, [ValidatorDate(true)]],
      id_grupo: [{ value: '' }, [Validators.required]],
      id_grupo_: [{ value: '' }],
      id_atividade: [
        { value: '' },
        [Validators.required, ValidatorStringLen(1, 15, true)],
      ],
      id_atividade_: [{ value: '' }],
      usuario: [{ value: '' }, [Validators.min(1)]],
      usuario_: [{ value: '' }],
      descricao: [{ value: '' }, [ValidatorStringLen(1, 50, true)]],
    });
    this.feriado = new FeriadoModel();
    this.inscricaoRota = route.params.subscribe((params: any) => {
      this.id_empresa = params.id_empresa;
      this.id_usuario = params.id_usuario;
      this.id_tipo = params.id_tipo;
      this.data = params.data;
      this.idAcao = params.acao;
      this.setAcao(params.acao);
    });
    this.grupos.push(new AtividadeQuery_01Model());
    this.atividades.push(new AtividadeQuery_01Model());
    this.setValue();
  }

  ngOnInit(): void {
    this.getProjeto();
  }

  ngOnDestroy(): void {
    this.inscricaoGetFeriado?.unsubscribe();
    this.inscricaoGetUsuarios?.unsubscribe();
    this.inscricaoRota?.unsubscribe();
    this.inscricaoAcao?.unsubscribe();
    this.inscricaoAtividades?.unsubscribe();
    this.inscricaoGetProjeto?.unsubscribe();
  }

  onSubmit() {
    if (this.formulario.valid || this.idAcao == CadastroAcoes.Exclusao) {
      this.executaAcao();
    } else {
      this.formulario.markAllAsTouched();
      this.appSnackBar.openSuccessSnackBar(
        `Formulário Com Campos Inválidos.`,
        'OK'
      );
    }
  }

  setValue() {
    this.formulario.setValue({
      data: this.feriado.data,
      id_grupo: this.feriado.subconta.substring(0, 4).trim(),
      id_grupo_:
        this.idAcao == CadastroAcoes.Consulta ||
        this.idAcao == CadastroAcoes.Exclusao
          ? this.feriado.subconta_descricao
          : '',
      id_atividade: this.feriado.subconta.trim(),
      id_atividade_:
        this.idAcao == CadastroAcoes.Consulta ||
        this.idAcao == CadastroAcoes.Exclusao
          ? this.feriado.atividade_descricao
          : '',
      usuario: this.feriado.id_usuario,
      usuario_:
        this.idAcao == CadastroAcoes.Consulta ||
        this.idAcao == CadastroAcoes.Exclusao ||
        this.idAcao == CadastroAcoes.Edicao
          ? this.feriado.usu_nome
          : '',
      descricao: this.feriado.descricao,
    });
  }

  getLabelCancel() {
    if (this.idAcao == CadastroAcoes.Consulta) {
      return 'Voltar';
    } else {
      return 'Cancelar';
    }
  }

  onRetorno() {
    const par = this.globalService.estadoFind('feriado');
    if (par != null) {
      let config = par.getParametro();
      Object(config).new = this.idAcao == CadastroAcoes.Inclusao ? true : false;
      Object(config).id_retorno = this.feriado.data;
      par.parametro = JSON.stringify(config);
      this.globalService.estadoSave(par);
    }
    this.router.navigate(['/especiais/especiais', 'SIM']);
  }

  onCancel() {
    const par = this.globalService.estadoFind('grupo-user');
    if (par != null) {
      let config = par.getParametro();
      Object(config).new = false;
      Object(config).id_retorno =
        this.idAcao == CadastroAcoes.Consulta ? this.feriado.data : '';
      par.parametro = JSON.stringify(config);
      this.globalService.estadoSave(par);
    }
    this.router.navigate(['/especiais/especiais', 'SIM']);
  }

  getFeriado() {
    this.globalService.setSpin(true);
    this.inscricaoGetFeriado = this.feriadosService
      .getFeriado(this.id_empresa, this.id_usuario, this.id_tipo, this.data)
      .subscribe(
        (data: FeriadoModel) => {
          this.globalService.setSpin(false);
          this.feriado = data;
          this.setValue();
        },
        (error: any) => {
          this.globalService.setSpin(false);
          console.log(error);
          this.appSnackBar.openFailureSnackBar(
            `Pesquisa Nos Feriados ${messageError(error)}`,
            'OK'
          );
        }
      );
  }

  getUsuarios() {
    let par = new ParametroUsuario01();

    par.id_empresa = this.globalService.getIdEmpresa();

    par.orderby = 'Razão';

    par.contador = 'N';

    par.pagina = 0;

    this.globalService.setSpin(true);
    this.inscricaoGetUsuarios = this.usuariosService
      .getusuarios_01(par)
      .subscribe(
        (data: any) => {
          this.globalService.setSpin(false);
          this.lsUsuarios = data;
          if (this.idAcao == CadastroAcoes.Inclusao) {
            this.feriado = new FeriadoModel();
            this.feriado.id_empresa = this.globalService.getIdEmpresa();
            this.feriado.id_usuario = this.globalService.getUsuario().id;
            this.feriado.id_tipo = 2;
            this.feriado.id_nivel = 0;
            this.setValue();
          } else {
            this.getFeriado();
          }
        },
        (error: any) => {
          this.globalService.setSpin(false);
          this.appSnackBar.openFailureSnackBar(
            `Pesquisa Nos Usuários ${messageError(error)}`,
            'OK'
          );
        }
      );
  }

  setAcao(op: number) {
    switch (+op) {
      case CadastroAcoes.Inclusao:
        this.acao = 'Gravar';
        this.labelCadastro = 'Datas Especiais - Inclusão.';
        this.readOnly = false;
        break;
      case CadastroAcoes.Edicao:
        this.acao = 'Gravar';
        this.labelCadastro = 'Datas Especiais - Alteração.';
        this.readOnly = false;
        break;
      case CadastroAcoes.Consulta:
        this.acao = 'Voltar';
        this.labelCadastro = 'Datas Especiais - Consulta.';
        this.readOnly = true;
        break;
      case CadastroAcoes.Exclusao:
        this.acao = 'Excluir';
        this.labelCadastro = 'Datas Especiais - Exclusão.';
        this.readOnly = true;
        break;
      default:
        break;
    }
  }

  executaAcao() {
    this.feriado.data = this.formulario.value.data;
    this.feriado.descricao = this.formulario.value.descricao;
    this.feriado.conta = this.conta.conta;
    this.feriado.versao = this.conta.versao;
    this.feriado.subconta = this.formulario.value.id_atividade;
    switch (+this.idAcao) {
      case CadastroAcoes.Inclusao:
        this.globalService.setSpin(false);
        this.feriado.user_insert = this.globalService.getUsuario().id;
        this.inscricaoAcao = this.feriadosService
          .FeriadoInsert(this.feriado)
          .subscribe(
            async (data: FeriadoModel) => {
              this.globalService.setSpin(false);
              this.onRetorno();
            },
            (error: any) => {
              this.globalService.setSpin(false);
              this.appSnackBar.openFailureSnackBar(
                `Erro Na INclusão ${messageError(error)}`,
                'OK'
              );
            }
          );
        break;
      case CadastroAcoes.Edicao:
        this.globalService.setSpin(true);
        this.feriado.user_update = this.globalService.getUsuario().id;
        this.inscricaoAcao = this.feriadosService
          .FeriadoUpdate(this.feriado)
          .subscribe(
            async (data: any) => {
              this.globalService.setSpin(false);
              this.onRetorno();
            },
            (error: any) => {
              this.globalService.setSpin(false);
              this.appSnackBar.openFailureSnackBar(
                `Erro Na Alteração ${messageError(error)}`,
                'OK'
              );
            }
          );
        break;
      case CadastroAcoes.Exclusao:
        this.globalService.setSpin(true);
        this.inscricaoAcao = this.feriadosService
          .FeriadoDelete(
            this.feriado.id_empresa,
            this.feriado.id_usuario,
            this.feriado.id_tipo,
            this.feriado.data
          )
          .subscribe(
            async (data: any) => {
              this.globalService.setSpin(false);
              this.onRetorno();
            },
            (error: any) => {
              this.globalService.setSpin(false);
              this.appSnackBar.openFailureSnackBar(
                `Erro Na Exclusao ${messageError(error)}`,
                'OK'
              );
            }
          );
        break;
      default:
        break;
    }
  }

  getAcoes() {
    return CadastroAcoes;
  }

  touchedOrDirty(campo: string): boolean {
    if (
      this.formulario.get(campo)?.touched ||
      this.formulario.get(campo)?.dirty
    ) {
      return true;
    }
    return false;
  }

  getValidfield(field: string): boolean {
    return (
      this.formulario.get(field)?.errors?.ValidatorStringLen &&
      this.touchedOrDirty(field)
    );
  }

  getMensafield(field: string): string {
    return this.formulario.get(field)?.errors?.message;
  }

  getConta() {
    let para = new ParametroAtividade01();
    para.id_empresa = this.globalService.getIdEmpresa();
    para.id_projeto = this.contrato.id;
    para.controle = 'S';
    para.orderby = 'projeto';
    para.conta = '90';
    para.nivel = 1;
    para.tipo = 'C';
    this.globalService.setSpin(true);
    console.log(para);
    this.inscricaoAtividades = this.atividadesService
      .getAtividades_01(para)
      .subscribe(
        (data: AtividadeQuery_01Model[]) => {
          this.globalService.setSpin(false);
          this.conta = data[0];
          this.getGrupos();
        },
        (error: any) => {
          this.globalService.setSpin(false);
          this.conta = new AtividadeQuery_01Model();
          this.grupos = [];
          this.atividades = [];
        }
      );
  }

  getGrupos() {
    let para = new ParametroAtividade01();
    para.id_empresa = this.globalService.getIdEmpresa();
    para.id_projeto = this.contrato.id;
    para.controle = 'S';
    para.orderby = 'projeto';
    para.conta = this.conta.conta;
    para.nivel = 2;
    para.tipo = 'S';
    this.globalService.setSpin(true);
    console.log(para);
    this.inscricaoAtividades = this.atividadesService
      .getAtividades_01(para)
      .subscribe(
        (data: AtividadeQuery_01Model[]) => {
          this.globalService.setSpin(false);
          console.log('grupos', data);
          this.grupos = data;
          this.getAtividades();
        },
        (error: any) => {
          this.globalService.setSpin(false);
          console.log('retornei com erro', error);
          this.grupos = [];
        }
      );
  }

  getAtividades() {
    let para = new ParametroAtividade01();
    para.id_empresa = this.globalService.getIdEmpresa();
    para.id_projeto = this.contrato.id;
    para.controle = 'S';
    para.orderby = 'projeto';
    para.conta = this.grupo.conta;
    para.subconta = this.grupo.subconta.trim();
    para.subconta_nivel = 'S';
    para.nivel_filtro = this.grupo.nivel;
    para.nivel = 3;
    para.tipo = 'O';
    this.globalService.setSpin(true);
    console.log(para);
    this.inscricaoAtividades = this.atividadesService
      .getAtividades_01(para)
      .subscribe(
        (data: AtividadeQuery_01Model[]) => {
          this.globalService.setSpin(false);
          this.atividades = data;
          this.getUsuarios();
          /*
          console.log('atividades:', data);
          this.formulario.patchValue({
            id_atividade: this.atividades[0].subconta,
          });
          */
          /*
              this.atividade = this.atividades.filter(
                (ativ) => ativ.id === this.parametro.value.id_atividade
              )[0];
              this.loaded = true;
              */
        },
        (error: any) => {
          this.globalService.setSpin(false);
          this.atividades = [];
        }
      );
  }

  getProjeto() {
    this.globalService.setSpin(true);
    this.inscricaoGetProjeto = this.projetosService
      .getProjeto(this.globalService.getIdEmpresa(), 900000)
      .subscribe(
        (data: ProjetoModel) => {
          this.globalService.setSpin(false);
          this.contrato = data;
          this.getConta();
        },
        (error: any) => {
          this.globalService.setSpin(false);
          this.appSnackBar.openSuccessSnackBar(
            `Pesquisa Contrato ${messageError(error)}`,
            'OK'
          );
          this.contrato = new ProjetoModel();
        }
      );
  }

  onChangeGrupos() {
    let idx: number = this.grupos.findIndex(
      (obj) => obj.subconta === this.formulario.value?.id_grupo
    );
    if (idx >= 0) {
      this.atividades = [];
      this.grupo = this.grupos[idx];
      this.getAtividades();
    }
  }

  readOnlyKey() {
    if (this.idAcao == CadastroAcoes.Inclusao) {
      return false;
    } else {
      return true;
    }
  }
}
