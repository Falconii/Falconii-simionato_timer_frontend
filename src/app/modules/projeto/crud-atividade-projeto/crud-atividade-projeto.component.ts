import { TipoConta } from 'src/app/shared/classes/tipo-conta';
import { RespExecDialogComponent } from 'src/app/shared/components/resp-exec-dialog/resp-exec-dialog.component';
import { JustificativaRespexecDialogComponent } from '../../../shared/components/justificativa-respexec-dialog/justificativa-respexec-dialog.component';
import { JustificativaDialogData } from '../../../shared/components/justificativa-periodo-dialog/justificativa-dialog-data';
import { QuestionDialogComponent } from '../../../shared/components/question-dialog/question-dialog.component';
import { QuestionDialogData } from '../../../shared/components/question-dialog/Question-Dialog-Data';
import { GlobalService } from './../../../services/global.service';
import { RespAudiData } from './resp-audi-dialog/resp-audi-data';
import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Subscription } from 'rxjs';
import { UsuarioQuery01Model } from 'src/app/Models/usuario-query_01-model';
import { CadastroAcoes } from 'src/app/shared/classes/cadastro-acoes';
import { DataYYYYMMDD, MensagensBotoes } from 'src/app/shared/classes/util';
import { UsuariosService } from 'src/app/services/usuarios.service';
import {
  ActivatedRoute,
  Event,
  PreloadAllModules,
  Router,
} from '@angular/router';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ParametroUsuario01 } from 'src/app/parametros/parametro-usuario01';
import { AtividadeModel } from 'src/app/Models/atividade-model';
import { AtividadeQuery_01Model } from 'src/app/Models/atividade-query_01-model';
import { ClientesQuery01Model } from 'src/app/Models/cliente-query_01-model';
import { EstruturaModel } from 'src/app/Models/estrutura-model';
import { ProjetoModel } from 'src/app/Models/projeto-model';
import { ParametroAtividade01 } from 'src/app/parametros/parametro-atividade01';
import { ParametroCliente01 } from 'src/app/parametros/parametro-cliente-01';
import { ParametroEstrutura01 } from 'src/app/parametros/parametro-estrutura01';
import { AtividadesService } from 'src/app/services/atividades.service';
import { ClientesService } from 'src/app/services/clientes.service';
import { EstruturasService } from 'src/app/services/estruturas.service';
import { ProjetosService } from 'src/app/services/projetos.service';
import {
  MatDialog,
  MAT_DIALOG_DATA,
  MatDialogRef,
  MatDialogConfig,
} from '@angular/material/dialog';
import { RespAudiDialogComponent } from './resp-audi-dialog/resp-audi-dialog.component';
import { PeriodoDialogData } from 'src/app/shared/components/periodo-dialog/periodo-dialog-data';
import { PeriodoDialogComponent } from 'src/app/shared/components/periodo-dialog/periodo-dialog.component';
import { RespExecDialogData } from 'src/app/shared/components/resp-exec-dialog/resp-exec-dialog-data';
import { FiltroOperacionalSubconta } from 'src/app/shared/classes/filtro-operacional-subconta';
import { AppSnackbar } from 'src/app/shared/classes/app-snackbar';

@Component({
  selector: 'app-crud-atividade-projeto',
  templateUrl: './crud-atividade-projeto.component.html',
  styleUrls: ['./crud-atividade-projeto.component.css'],
})
export class CrudAtividadeProjetoComponent implements OnInit {
  inscricaoAnexar!: Subscription;
  inscricaoGetFiltro!: Subscription;
  inscricaoAcao!: Subscription;
  inscricaoRota!: Subscription;
  inscricaoGetProjeto!: Subscription;
  inscricaoGetEstruturasIn!: Subscription;
  inscricaoGetEstruturasOff!: Subscription;
  inscricaoGetAtividade!: Subscription;
  inscricaoGetSubCliente!: Subscription;

  projeto: ProjetoModel = new ProjetoModel();

  executores: UsuarioQuery01Model[] = [];

  subclientes: ClientesQuery01Model[] = [];

  atividades: AtividadeQuery_01Model[] = [];

  estruturasIn: EstruturaModel[] = [];

  estruturasOff: EstruturaModel[] = [];

  atividade: AtividadeModel = new AtividadeModel();

  formulario: FormGroup;

  parametros: FormGroup;

  erro: string = '';

  id_empresa = 0;

  id_projeto = 0;

  durationInSeconds = 3;

  acao: string = 'Sem Definição';

  idAcao: number = CadastroAcoes.Inclusao;

  readOnly: boolean = true;

  readOnlyKey: boolean = true;

  labelCadastro: string = '';

  conta: string = '';

  versao: string = '';

  id_atividade_conta = '';

  filtro: FiltroOperacionalSubconta = new FiltroOperacionalSubconta();

  id_exec: number = 0;

  id_resp: number = 0;

  constructor(
    public questionDialog: MatDialog,
    public respAudiDialog: MatDialog,
    public jusPeriodoDialog: MatDialog,
    public jusRespExecDialog: MatDialog,
    private formBuilder: FormBuilder,
    private estruturasService: EstruturasService,
    private atividadesService: AtividadesService,
    private usuariosService: UsuariosService,
    private projetosService: ProjetosService,
    private clientesService: ClientesService,
    private route: ActivatedRoute,
    private router: Router,
    private appSnackBar: AppSnackbar,
    private globalService: GlobalService
  ) {
    this.formulario = formBuilder.group({
      descricao: [{ value: '' }],
      subconta: [{ value: '' }],
      inicial: [],
      final: [],
      id_resp: [{ value: '' }, [Validators.required, Validators.min(1)]],
      status: [],
      id_exec: [{ value: '' }],
      id_subcliente: [{ value: '' }, [Validators.required, Validators.min(1)]],
      obs: [{ value: '' }],
    });
    this.parametros = formBuilder.group({
      conta: [{ value: '' }],
      atividade: [{ value: '' }],
    });
    this.projeto = new ProjetoModel();
    this.inscricaoRota = route.params.subscribe((params: any) => {
      this.id_empresa = params.id_empresa;
      this.id_projeto = params.id_projeto;
      this.id_atividade_conta = params.id_atividade;
      this.idAcao = 99;
      this.setAcao(99);
    });
    this.getProjeto();
  }

  ngOnInit(): void {
    this.setParamentos();
    this.getExecutores();
  }

  ngOnDestroy(): void {
    this.inscricaoAnexar?.unsubscribe();
    this.inscricaoGetFiltro?.unsubscribe();
    this.inscricaoAcao?.unsubscribe();
    this.inscricaoRota?.unsubscribe();
    this.inscricaoGetProjeto?.unsubscribe();
    this.inscricaoGetEstruturasIn?.unsubscribe();
    this.inscricaoGetEstruturasOff?.unsubscribe();
    this.inscricaoGetAtividade?.unsubscribe();
    this.inscricaoGetSubCliente?.unsubscribe();
  }

  openQuestionDialog(atividade: AtividadeQuery_01Model, tipo: string): void {
    const data: QuestionDialogData = new QuestionDialogData();
    if (tipo == 'all') {
      data.mensagem01 = 'Deseja Excluir TODA ATIVIDADE ?';
    }
    if (tipo == 'one') {
      data.mensagem01 = 'Deseja Excluir A Atividade ?';
    }
    if (tipo == 'partial') {
      data.mensagem01 = 'Deseja Excluir A SubAtividade ?';
    }

    data.mensagem02 = atividade.estru_descri;
    const dialogConfig = new MatDialogConfig();

    dialogConfig.disableClose = true;
    dialogConfig.id = 'question';
    dialogConfig.width = '600px';
    dialogConfig.data = data;
    const modalDialog = this.questionDialog
      .open(QuestionDialogComponent, dialogConfig)
      .beforeClosed()
      .subscribe((data: QuestionDialogData) => {
        console.log('data', data);
        if (data.resposta == 'S') {
          if (tipo == 'all') {
            this.Desanexar(atividade);
          }
          if (tipo == 'one') {
            this.excluir(
              atividade.id_empresa,
              atividade.id_projeto,
              atividade.conta,
              atividade.versao,
              atividade.subconta
            );
          }
          if (tipo == 'partial') {
            this.excluirPartial(
              atividade.id_empresa,
              atividade.id_projeto,
              atividade.conta,
              atividade.versao,
              atividade.subconta,
              atividade.nivel
            );
          }
        }
      });
  }

  openDialogRespAudi(acao: string): void {
    const data: RespAudiData = new RespAudiData();
    data.executores = this.executores;
    const dialogConfig = new MatDialogConfig();

    // The user can't close the dialog by clicking outside its body
    dialogConfig.disableClose = true;
    dialogConfig.id = 'modal-component';
    dialogConfig.height = '430px';
    dialogConfig.width = '600px';
    dialogConfig.data = data;
    const modalDialog = this.respAudiDialog
      .open(RespAudiDialogComponent, dialogConfig)
      .beforeClosed()
      .subscribe((data: RespAudiData) => {
        console.log('data', data);
        this.id_resp = data.id_resp;
        this.id_exec = data.id_exec;
        if (data.processar) {
          if (acao == 'INCLUSAO') {
            this.conta = this.parametros.value.conta?.trim();
            this.versao = '0101';
            this.filtro = new FiltroOperacionalSubconta();
            this.router.navigate([
              '/projetos/anexarv2',
              this.conta,
              this.versao,
              this.id_projeto,
              this.id_resp,
              this.id_exec,
            ]);
          } else {
            this.conta = this.atividades[0].conta;
            this.versao = this.atividades[0].versao;
            this.id_projeto = this.atividades[0].id_projeto;
            this.id_resp = data.id_resp;
            this.id_exec = data.id_exec;
            this.router.navigate([
              '/projetos/anexarv2',
              this.conta,
              this.versao,
              this.id_projeto,
              this.id_resp,
              this.id_exec,
            ]);
          }
        }
      });
  }
  getProjeto() {
    this.globalService.setSpin(true);
    this.inscricaoGetProjeto = this.projetosService
      .getProjeto(this.id_empresa, this.id_projeto)
      .subscribe(
        (data: ProjetoModel) => {
          this.globalService.setSpin(false);
          this.projeto = data;
          this.id_atividade_conta = '';
          this.getEstruturasIn();
        },
        (error: any) => {
          this.globalService.setSpin(false);
          this.appSnackBar.openFailureSnackBar(
            `Pesquisa  Projeto ${error.error.tabela} - ${error.error.erro} - ${error.error.message}`,
            'OK'
          );
        }
      );
  }

  getSubClientes() {
    console.log('Olha o projeto', this.projeto);

    let par = new ParametroCliente01();

    par.id_empresa = this.id_empresa;

    par.grupo = this.projeto.cliente_gru_econo;

    par.orderby = 'Razão';

    this.globalService.setSpin(true);

    this.inscricaoGetSubCliente = this.clientesService
      .getClientes_01(par)
      .subscribe(
        (data: ClientesQuery01Model[]) => {
          this.globalService.setSpin(false);
          this.subclientes = data;
        },
        (error: any) => {
          this.globalService.setSpin(false);
          this.atividades = [];
          this.appSnackBar.openFailureSnackBar(
            `${error.error.tabela} - ${error.error.erro} - ${error.error.message}`,
            'OK'
          );
        }
      );
  }

  getAtividade(id_empresa: number, id_atividade: number) {
    this.globalService.setSpin(true);
    this.inscricaoGetAtividade = this.atividadesService
      .getAtividade(id_empresa, id_atividade)
      .subscribe(
        (data: AtividadeModel) => {
          this.globalService.setSpin(false);
          this.atividade = data;
          this.setValue();
        },
        (error: any) => {
          this.globalService.setSpin(false);
          this.atividade = new AtividadeModel();
          this.appSnackBar.openFailureSnackBar(
            `${error.error.tabela} - ${error.error.erro} - ${error.error.message}`,
            'OK'
          );
        }
      );
  }

  getAtividades() {
    let par = new ParametroAtividade01();

    par.id_empresa = this.id_empresa;

    par.conta = this.id_atividade_conta;

    par.versao = this.versao;

    par.id_projeto = this.id_projeto;

    if (this.globalService.getUsuario().id == 16) par.controle = '';

    par.orderby = 'projeto';

    this.globalService.setSpin(true);
    this.inscricaoGetFiltro = this.atividadesService
      .getAtividades_01(par)
      .subscribe(
        (data: AtividadeQuery_01Model[]) => {
          this.globalService.setSpin(false);
          this.atividades = data;
          console.log('atividades', this.atividades);
        },
        (error: any) => {
          this.globalService.setSpin(false);
          this.atividades = [];
          this.appSnackBar.openFailureSnackBar(
            `${error.error.tabela} - ${error.error.erro} - ${error.error.message}`,
            'OK'
          );
        }
      );
  }

  getExecutores() {
    let par = new ParametroUsuario01();

    par.id_empresa = this.globalService.id_empresa;

    const dire = this.usuariosService.getGruposDiretoria();

    const coorde = this.usuariosService.getGruposCoordenador();

    const audi = this.usuariosService.getGruposAuditor();

    par.id_empresa = this.globalService.id_empresa;

    dire.forEach((value) => {
      par.grupo.push(value);
    });

    coorde.forEach((value) => {
      par.grupo.push(value);
    });

    audi.forEach((value) => {
      par.grupo.push(value);
    });

    par.orderby = 'Razão';

    this.globalService.setSpin(true);
    this.inscricaoGetFiltro = this.usuariosService
      .getusuarios_01(par)
      .subscribe(
        (data: UsuarioQuery01Model[]) => {
          this.globalService.setSpin(false);
          this.executores = data;
        },
        (error: any) => {
          this.globalService.setSpin(false);
          this.executores = [];
          this.appSnackBar.openFailureSnackBar(
            `${error.error.tabela} - ${error.error.erro} - ${error.error.message}`,
            'OK'
          );
        }
      );
  }

  /*
  anexarAtividades() {
    this.globalService.setSpin(true);
    this.inscricaoAnexar = this.atividadesService
      .anexaatividade(
        this.id_empresa,
        this.conta,
        this.versao,
        this.id_projeto,
        this.id_exec,
        this.id_resp
      )
      .subscribe(
        (data: any) => {
          this.globalService.setSpin(false);
          this.appSnackBar.openSuccessSnackBar(
            `Estrutura Anexada Com Sucesso!`,
            'OK'
          );
          this.atividades = [];
          this.conta = '';
          this.getProjeto();
          this.parametros.reset();
          this.appSnackBar.openSuccessSnackBar(
            `Estrutura Anexada Com Sucesso!`,
            'OK'
          );
        },

        (error: any) => {
          this.globalService.setSpin(false);
          this.appSnackBar.openFailureSnackBar(
            `${error.error.tabela} - ${error.error.erro} - ${error.error.message}`,
            'OK'
          );
        }
      );
  }
*/

  desanexarAtividades(
    id_empresa: number,
    conta: string,
    versao: string,
    id_projeto: number
  ) {
    this.globalService.setSpin(false);
    this.inscricaoAnexar = this.atividadesService
      .desanexaatividade(id_empresa, conta, versao, id_projeto)
      .subscribe(
        (data: any) => {
          this.globalService.setSpin(false);
          this.atividades = [];
          this.conta = '';
          this.getProjeto();
          this.appSnackBar.openSuccessSnackBar(
            `Estrutura Excluída Com Sucesso!`,
            'OK'
          );
        },
        (error: any) => {
          this.globalService.setSpin(false);
          this.appSnackBar.openFailureSnackBar(
            `${error.error.tabela} - ${error.error.erro} - ${error.error.message}`,
            'OK'
          );
        }
      );
  }

  excluir(
    id_empresa: number,
    id_projeto: number,
    conta: string,
    versao: string,
    subconta: string
  ) {
    this.globalService.setSpin(true);
    this.inscricaoAnexar = this.atividadesService
      .atividadeDelete(id_empresa, id_projeto, conta, versao, subconta)
      .subscribe(
        (data: any) => {
          this.globalService.setSpin(false);
          this.atividades = [];
          this.conta = '';
          this.getProjeto();
          this.appSnackBar.openSuccessSnackBar(
            `Atividade Excluída Com Sucesso!`,
            'OK'
          );
        },
        (error: any) => {
          this.globalService.setSpin(false);
          console.log(error);
          this.appSnackBar.openFailureSnackBar(
            `${error.error.tabela} - ${error.error.erro} - ${error.error.message}`,
            'OK'
          );
        }
      );
  }

  excluirPartial(
    id_empresa: number,
    id_projeto: number,
    id_conta: string,
    id_conta_versao: string,
    id_subconta: string,
    nivel: number
  ) {
    this.globalService.setSpin(true);
    this.inscricaoAnexar = this.atividadesService
      .desanexasubconta(
        id_empresa,
        id_projeto,
        id_conta,
        id_conta_versao,
        id_subconta,
        nivel
      )
      .subscribe(
        (data: any) => {
          this.globalService.setSpin(false);
          this.atividades = [];
          this.conta = '';
          this.getProjeto();
          this.appSnackBar.openSuccessSnackBar(
            `SubAtividade Excluída Com Sucesso!`,
            'OK'
          );
        },
        (error: any) => {
          this.globalService.setSpin(false);
          console.log(error);
          this.appSnackBar.openFailureSnackBar(
            `${error.error.tabela} - ${error.error.erro} - ${error.error.message}`,
            'OK'
          );
        }
      );
  }

  getEstruturasOff() {
    let par = new ParametroEstrutura01();

    par.id_empresa = this.id_empresa;

    par.nivel = 1;

    par.projeto_off = 'S';

    par.id_projeto = this.id_projeto;

    par.orderby = 'Conta';

    if (this.globalService.getUsuario().id == 16) par.controle = '';

    this.globalService.setSpin(true);
    this.inscricaoGetEstruturasOff = this.estruturasService
      .getEstruturas(par)
      .subscribe(
        (data: EstruturaModel[]) => {
          this.globalService.setSpin(false);
          this.estruturasOff = data;
        },
        (error: any) => {
          this.globalService.setSpin(false);
          this.estruturasOff = [];
        }
      );
  }

  getEstruturasIn() {
    let par = new ParametroEstrutura01();

    par.id_empresa = this.id_empresa;

    par.nivel = 1;

    par.projeto_in = 'S';

    par.id_projeto = this.id_projeto;

    par.orderby = 'Conta';

    if (this.globalService.getUsuario().id == 16) par.controle = '';

    this.globalService.setSpin(true);
    this.inscricaoGetEstruturasIn = this.estruturasService
      .getEstruturas(par)
      .subscribe(
        (data: EstruturaModel[]) => {
          this.globalService.setSpin(false);
          this.estruturasIn = data;
          if (this.id_atividade_conta == '' && this.estruturasIn.length > 0) {
            this.id_atividade_conta = this.estruturasIn[0].conta;
            this.setParametrosPath();
            this.onVisualizar();
          }
          this.getSubClientes();
          this.getEstruturasOff();
        },
        (error: any) => {
          this.globalService.setSpin(false);
          this.estruturasIn = [];
          this.getSubClientes();
          this.getEstruturasOff();
          console.log('erro in', error);
        }
      );
  }

  escolha(atividade: AtividadeQuery_01Model, opcao: number) {
    if (opcao == 98) {
      if (atividade.id_exec == 0 || atividade.id_resp == 0) {
        this.appSnackBar.openSuccessSnackBar(
          `Responsável e Executor são abrigatorios, para agendamento.`,
          'OK'
        );
      } else {
        this.router.navigate([
          '/projetos/planejamentoagenda',
          atividade.id_empresa,
          atividade.id,
        ]);
      }
    } else {
      this.idAcao = opcao;
      this.setAcao(this.idAcao);
      this.getAtividade(atividade.id_empresa, atividade.id);
    }
  }

  setAcao(op: number) {
    switch (+op) {
      case CadastroAcoes.Inclusao:
        this.acao = 'Gravar';
        this.labelCadastro = 'Atividade - Inclusão.';
        this.readOnly = false;
        break;
      case CadastroAcoes.Edicao:
        this.acao = 'Gravar';
        this.labelCadastro = 'Atividade - Alteração.';
        this.readOnly = false;
        break;
      case CadastroAcoes.Consulta:
        this.acao = 'Voltar';
        this.labelCadastro = 'Atividade - Consulta.';
        this.readOnly = true;
        break;
      case CadastroAcoes.Exclusao:
        this.acao = 'Excluir';
        this.labelCadastro = 'Atividade - Exclusão.';
        this.readOnly = true;
        break;
      default:
        this.acao = '';
        this.labelCadastro = '';
        this.readOnly = true;
        break;
    }
  }

  executaAcao() {
    this.atividade.inicial = this.formulario.value.inicial;
    this.atividade.final = this.formulario.value.final;
    this.atividade.id_resp = this.formulario.value.id_resp;
    this.atividade.id_exec = this.formulario.value.id_exec;
    this.atividade.id_subcliente = this.formulario.value.id_subcliente;
    this.atividade.obs = this.formulario.value.obs;
    switch (+this.idAcao) {
      case CadastroAcoes.Edicao:
        this.globalService.setSpin(true);
        this.inscricaoAcao = this.atividadesService
          .atividadeUpdate(this.atividade)
          .subscribe(
            async (data: any) => {
              this.globalService.setSpin(false);
              this.onCancel();
              this.refreshAtividade(this.atividade);
            },
            (error: any) => {
              this.globalService.setSpin(false);
              this.appSnackBar.openFailureSnackBar(
                `Erro Na Alteração ${error.error.tabela} - ${error.error.erro} - ${error.error.message}`,
                'OK'
              );
            }
          );
        break;
      default:
        break;
    }
  }

  onSubmit() {
    if (this.formulario.valid) {
      this.executaAcao();
    } else {
      this.appSnackBar.openFailureSnackBar(
        `Formulário Com Campos Inválidos.`,
        'OK'
      );
    }
  }

  onAnexar() {
    if (this.parametros.value.conta?.trim() != '') {
      this.openDialogRespAudi('INCLUSAO');
    } else {
      this.appSnackBar.openSuccessSnackBar(
        `Informe Uma Estrutura Primeiro`,
        'OK'
      );
    }
  }

  onVisualizar() {
    if (this.parametros.value.atividade?.trim() != '') {
      this.id_atividade_conta = this.parametros.value.atividade?.trim();
      this.versao = '0101';
      this.setParamentos();
      this.filtro = new FiltroOperacionalSubconta();
      this.getAtividades();
    } else {
      this.appSnackBar.openSuccessSnackBar(
        `Informe Uma Atividade Primeiro`,
        'OK'
      );
    }
  }

  setValue() {
    this.formulario.setValue({
      descricao: this.atividade.descricao_estru,
      subconta: this.atividade.subconta,
      inicial: this.atividade.inicial,
      final: this.atividade.final,
      id_resp: this.atividade.id_resp,
      id_exec: this.atividade.id_exec,
      id_subcliente: this.atividade.id_subcliente,
      obs: this.atividade.obs,
      status: '',
    });
  }

  setParametrosPath() {
    this.parametros.patchValue({
      atividade: this.id_atividade_conta,
    });
  }

  setParamentos() {
    this.parametros.setValue({
      conta: this.conta,
      atividade: this.id_atividade_conta,
    });
  }

  getLabelCancel() {
    if (this.idAcao == CadastroAcoes.Consulta) {
      return 'Voltar';
    } else {
      return 'Cancelar';
    }
  }

  onCancel() {
    this.idAcao = 99;
    this.setAcao(99);
  }

  onRetorno() {
    const par = this.globalService.estadoFind('projeto');
    if (par != null) {
      let config = par.getParametro();
      Object(config).new = this.idAcao == CadastroAcoes.Inclusao ? true : false;
      Object(config).id_retorno = this.projeto.id;
      par.parametro = JSON.stringify(config);
      this.globalService.estadoSave(par);
    }
    this.router.navigate(['/projetos/projetos', 'SIM']);
  }

  onDesanexar(atividade: AtividadeQuery_01Model) {
    this.openQuestionDialog(atividade, 'all');
  }

  Desanexar(atividade: AtividadeQuery_01Model): void {
    this.desanexarAtividades(
      atividade.id_empresa,
      atividade.conta,
      atividade.versao,
      atividade.id_projeto
    );
  }

  onExcluir(atividade: AtividadeQuery_01Model) {
    this.openQuestionDialog(
      atividade,
      atividade.tipo == 'S' ? 'partial' : 'one'
    );
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

  getTexto() {
    return MensagensBotoes;
  }

  getFiltro(atividade: AtividadeQuery_01Model): Boolean {
    var filtroSubConta: boolean = false;
    if (this.filtro.subconta == '') {
      return true;
    }
    if (
      this.filtro.subconta.trim() ==
      atividade.subconta.substring(0, this.filtro.nivel * 2)
    ) {
      filtroSubConta = true;
    } else {
      filtroSubConta = false;
    }
    return filtroSubConta;
  }

  refreshAtividade(atividade: AtividadeModel) {
    this.atividades.forEach((ativ) => {
      if (ativ.id == atividade.id) {
        ativ.inicial = DataYYYYMMDD(this.formulario.value.inicial);
        ativ.final = DataYYYYMMDD(this.formulario.value.final);
        ativ.id_resp = this.formulario.value.id_resp;
        ativ.resp_razao = this.getRazao(this.formulario.value.id_resp);
        ativ.id_exec = this.formulario.value.id_exec;
        ativ.exec_razao = this.getRazao(this.formulario.value.id_exec);
        ativ.id_subcliente = this.formulario.value.id_subcliente;
        ativ.obs = this.formulario.value.obs;
      }
    });
  }

  getRazao(value: number): string {
    let retorno: string = '';
    this.executores.forEach((exec) => {
      if (exec.id == value) retorno = exec.razao;
    });
    return retorno;
  }

  onSetFiltroSubConta(conta: string, nivel: number) {
    if (this.filtro.subconta == conta) {
      this.filtro.subconta = '';
      this.filtro.nivel = 0;
    } else {
      this.filtro.subconta = conta;
      this.filtro.nivel = nivel;
    }
    console.log('Filtro Conta:', this.filtro.subconta, this.filtro.nivel);
  }

  onHorasDiretoria(): void {
    this.router.navigate([
      '/projetos/horasdiretoria',
      this.id_empresa,
      this.id_projeto,
    ]);
  }

  onManutencaoLote(): void {
    console.log('this.id_atividade_conta)', this.id_atividade_conta);
    if (
      this.id_atividade_conta == 'NULL' ||
      this.id_atividade_conta.trim() == ''
    ) {
      this.appSnackBar.openSuccessSnackBar(
        'Selecione A Atividade Primeiro!',
        'OK'
      );
    } else {
      this.router.navigate([
        '/projetos/manuemlote',
        this.id_empresa,
        this.id_atividade_conta,
        this.id_projeto,
      ]);
    }
  }

  onPeriodo() {
    this.openJusPeriodoDialog();
  }

  onResponsavel() {
    this.openJusRespExecDialog('R');
  }

  onExecutor() {
    this.openJusRespExecDialog('E');
  }

  openJusPeriodoDialog(): void {
    const data: PeriodoDialogData = new PeriodoDialogData();
    data.titulo = `ALTERAÇÃO DO PERÍODO`;
    data.titulo_data1 = 'Data Inicial';
    data.dataInicial = '01/01/2023'; //this.atividade.inicial;
    data.titulo_data2 = 'Data Final';
    data.dataFinal = '01/01/2023'; //this.atividade.final;
    data.justificativa = '';
    data.dataHota = new Date();
    data.usuarioNome = this.globalService.getNomeusuarioLogado();

    const dialogConfig = new MatDialogConfig();

    dialogConfig.disableClose = true;
    dialogConfig.id = 'jus-Periodo';
    dialogConfig.width = '600px';
    dialogConfig.data = data;
    const modalDialog = this.jusPeriodoDialog
      .open(PeriodoDialogComponent, dialogConfig)
      .beforeClosed()
      .subscribe((data: PeriodoDialogData) => {
        console.log('Retorno data', data);
        if (typeof data !== 'undefined' && data.processar) {
          this.formulario.patchValue({ inicial: data.dataInicial });
          this.formulario.patchValue({ final: data.dataFinal });
          console.log('Fui....', this.formulario);
          this.onSubmit();
        }
      });
  }

  openJusRespExecDialog(tipo: string) {
    const data: RespExecDialogData = new RespExecDialogData();
    data.titulo = `${tipo == 'R' ? 'Responsável' : 'Executor'}`;
    data.texto = `ALTERAÇÃO DO ${tipo == 'R' ? 'RESPONSÁVEL' : 'EXECUTOR'}`;
    data.usuarios = this.executores;
    data.id_usuario =
      tipo == 'R' ? this.atividade.id_resp : this.atividade.id_exec;
    data.justificativa = '';
    data.dataHota = new Date();
    data.usuarioNome = this.globalService.getNomeusuarioLogado();

    const dialogConfig = new MatDialogConfig();

    dialogConfig.disableClose = true;
    dialogConfig.id = 'jus-Person';
    dialogConfig.width = '600px';
    dialogConfig.data = data;
    const modalDialog = this.jusRespExecDialog
      .open(RespExecDialogComponent, dialogConfig)
      .beforeClosed()
      .subscribe((data: RespExecDialogData) => {
        console.log('Retorno data', data);
        if (typeof data !== 'undefined' && data.processar) {
          if ((tipo = 'R')) {
            this.formulario.patchValue({ id_resp: data.id_usuario });
          } else {
            this.formulario.patchValue({ id_exec: data.id_usuario });
          }
          console.log('Fui....', this.formulario);
          this.onSubmit();
        }
      });
  }

  /*
  setStyle(atividade: AtividadeQuery_01Model, tipo: string) {
    let cor = { 'background-color': 'white' };
    if (tipo == 'P') {
      if (atividade.nivelplan == 1) cor = { 'background-color': 'green' };
      if (atividade.nivelplan == 2) cor = { 'background-color': 'yellow' };
      if (atividade.nivelplan == 3) cor = { 'background-color': 'red' };
      if (atividade.nivelplan == 4) cor = { 'background-color': 'black' };
    } else {
      if (atividade.nivelexec == 1) cor = { 'background-color': 'green' };
      if (atividade.nivelexec == 2) cor = { 'background-color': 'yellow' };
      if (atividade.nivelexec == 3) cor = { 'background-color': 'red' };
      if (atividade.nivelexec == 4) cor = { 'background-color': 'black' };
    }
    return cor;
  }
  */

  onIncluirNovaAtividade(atividade: AtividadeQuery_01Model) {
    this.openDialogRespAudi('EDICAO');
  }
}
