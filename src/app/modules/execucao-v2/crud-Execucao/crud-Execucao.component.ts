import { ProdutosModel } from './../../../Models/produto-model';
import { ProjetosService } from 'src/app/services/projetos.service';
import { AponExecucaoService } from 'src/app/services/apon-execucao.service';
import { AponPlanejamentoService } from 'src/app/services/apon-planejamento.service';
import { UsuarioModel } from 'src/app/Models/usuario-model';
import { MotivoApoModel } from 'src/app/Models/motivo-apo-model';
import { AtividadeQuery_01Model } from 'src/app/Models/atividade-query_01-model';
import { ApoExecucaoModel } from 'src/app/Models/apo-execucao-model';
import { MoviData } from 'src/app/Models/movi-data';
import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { Subscription } from 'rxjs';
import { ApoExecucaoModel01 } from 'src/app/Models/apo-execucao-model01';
import { ApoPlanejamentoQuery_01Model } from 'src/app/Models/apo-planejamento-query_01-model';
import { Intervalo } from 'src/app/shared/classes/intervalo';
import { RetornoPesquisa } from 'src/app/shared/classes/retorno-pesquisa';
import {
  FormBuilder,
  FormControl,
  FormGroup,
  Validators,
} from '@angular/forms';
import { UsuariosService } from 'src/app/services/usuarios.service';
import { AtividadesService } from 'src/app/services/atividades.service';
import { GlobalService } from 'src/app/services/global.service';
import { MotivoApoService } from 'src/app/services/motivo-apo.service';
import { ActivatedRoute, Router } from '@angular/router';
import { AppSnackbar } from 'src/app/shared/classes/app-snackbar';
import { CadastroAcoes } from 'src/app/shared/classes/cadastro-acoes';
import {
  aaaammddddmmaaaa,
  DataDDMMYYYY,
  DataYYYYMMDD,
  DataYYYYMMDDTHHMMSSZ,
  ddmmaaaatoaaaammdd,
  DifHoras,
  getFirstName,
  getHora,
  getMinuto,
  MensagensBotoes,
  messageError,
  minutostostohorasexagenal,
  populaIntervalo2,
  setDBtoAngular,
  setDBtoAngularGMT,
  setHorario,
  validaIntervalo,
} from 'src/app/shared/classes/util';
import { ParametroAgendaPlanejamento01 } from 'src/app/parametros/parametro-agenda-planejamento01';
import { ParametroAponExecucao01 } from 'src/app/parametros/parametro-apon-execucao01';
import { ParametroAtividade01 } from 'src/app/parametros/parametro-atividade01';
import { ParametroMotivoApo01 } from 'src/app/parametros/parametro-motivo-apo01';
import { ErrorIntervalo } from 'src/app/shared/classes/error-intervalo';
import { ProjetoModel } from 'src/app/Models/projeto-model';
import { ParametroProjeto01 } from 'src/app/parametros/parametro-projeto01';
import { ParametroEstrutura01 } from 'src/app/parametros/parametro-estrutura01';
import { EstruturasService } from 'src/app/services/estruturas.service';
import { EstruturaModel } from 'src/app/Models/estrutura-model';
import { ParametroLastprojects } from 'src/app/parametros/parametro-lastprojects';
import { ProjetoLastModel } from 'src/app/Models/projeto-last-model';
import { LastRecursivo } from 'src/app/shared/classes/last-recursivo';

@Component({
  selector: 'app-crud-Execucao',
  templateUrl: './crud-Execucao.component.html',
  styleUrls: ['./crud-Execucao.component.css'],
})
export class CrudExecucaoComponent implements OnInit {
  agendamento: MoviData = new MoviData();
  inscricaoGetAll!: Subscription;
  inscricaoAcao!: Subscription;
  inscricaoUsuario!: Subscription;
  inscricaoApontamento!: Subscription;
  inscricaoBancoHoras!: Subscription;
  inscricaoAponExecucao!: Subscription;
  inscricaoAtividades!: Subscription;
  inscricaoMotivos!: Subscription;
  inscricaoCoordenador!: Subscription;
  inscricaoGetContratos!: Subscription;
  inscricaoRota!: Subscription;
  idAcao: number = 0;
  acao: string = '';
  labelCadastro: string = '';
  id_empresa: number = 0;
  apontamentos: ApoExecucaoModel01[] = [];
  apontamento: ApoExecucaoModel = new ApoExecucaoModel();
  apontamentosBanco: ApoExecucaoModel01[] = [];
  agendamentos: ApoPlanejamentoQuery_01Model[] = [];
  atividades: AtividadeQuery_01Model[] = [];
  atividade: AtividadeQuery_01Model = new AtividadeQuery_01Model();
  motivos: MotivoApoModel[] = [];
  dados_projetos: string = 'Olá';
  usuario: UsuarioModel = new UsuarioModel();
  filtro: Boolean = false;
  formulario: FormGroup;
  parametro: FormGroup;
  intervalos: Intervalo[] = [];
  readOnly: boolean = true;
  showAtividades: boolean = false;
  retornoAtividades: RetornoPesquisa = new RetornoPesquisa(0, 0, new Date());

  contrato: ProjetoModel = new ProjetoModel();
  contratos: ProjetoModel[] = [];
  tempoContratos: ProjetoModel[] = [];
  lastContratosFiltrados: ProjetoLastModel[] = [];
  lastContratos: ProjetoLastModel[] = [];
  last: number = 0;
  grupo: AtividadeQuery_01Model = new AtividadeQuery_01Model();
  grupos: AtividadeQuery_01Model[] = [];

  estrutura: AtividadeQuery_01Model = new AtividadeQuery_01Model();
  estruturas: AtividadeQuery_01Model[] = [];

  focusEntrada: boolean = false;
  focusCancelar: boolean = false;

  gravando: boolean = false;

  totalHoras: number = 0;

  totalHorasBanco: number = 0;

  parData: string = '';

  loaded: boolean = false;

  constructor(
    formBuilder: FormBuilder,
    private usuariosService: UsuariosService,
    private aponExecucaoService: AponExecucaoService,
    private atividadesService: AtividadesService,
    private motivoApoService: MotivoApoService,
    private projetosServices: ProjetosService,
    private globalService: GlobalService,
    private router: Router,
    private route: ActivatedRoute,
    private appSnackBar: AppSnackbar
  ) {
    this.formulario = formBuilder.group({
      entrada: [{ value: '' }, [Validators.required]],
      saida: [{ value: '' }, [Validators.required]],
      grupo: [{ value: '' }, [Validators.required]],
      atividade: [{ value: '' }, [Validators.required]],
      cliente: [{ value: '' }, [Validators.required]],
      id_motivo: [{ value: '' }, [Validators.required]],
      encerra: [{ value: '' }, [Validators.required]],
      obs: [{ value: '' }, [Validators.maxLength(150)]],
    });
    this.parametro = formBuilder.group({
      usuario: [{ value: '' }],
      data: [{ value: '' }],
      id_estrutura: [{ value: '' }, [Validators.required, Validators.min(1)]],
      id_contrato: [{ value: '' }, [Validators.required, Validators.min(1)]],
      id_grupo: [{ value: '' }, [Validators.required, Validators.min(1)]],
      id_atividade: [{ value: '' }, [Validators.required, Validators.min(1)]],
    });
    this.inscricaoRota = route.params.subscribe((params: any) => {
      if (typeof params.data == 'undefined') {
        this.parData = '';
      } else {
        this.parData = params.data;
      }
    });
    //this.parametro.get('opcoes')?.valueChanges.subscribe((value) => {
    //  this.filtroContratos(value);
    //});
    this.getUsuario();
    this.setValue();
    this.idAcao = 99;
    this.setAcao(this.idAcao);
    this.setValue();
    this.setParametro();
  }

  ngOnInit(): void {
    this.getApontamentosExecucao();
    this.getApontamentosBancoHoras();
  }

  ngOnDestroy(): void {
    this.inscricaoGetAll?.unsubscribe();
    this.inscricaoAcao?.unsubscribe();
    this.inscricaoUsuario?.unsubscribe();
    this.inscricaoApontamento?.unsubscribe();
    this.inscricaoAponExecucao?.unsubscribe();
    this.inscricaoAtividades?.unsubscribe();
    this.inscricaoMotivos?.unsubscribe();
    this.inscricaoCoordenador?.unsubscribe();
    this.inscricaoGetContratos?.unsubscribe();
    this.inscricaoRota?.unsubscribe();
    this.inscricaoBancoHoras?.unsubscribe();
  }

  getUsuario() {
    this.globalService.setSpin(true);
    this.inscricaoUsuario = this.usuariosService
      .getUsuario(
        this.globalService.getIdEmpresa(),
        this.globalService.getUsuario().id
      )
      .subscribe(
        (data: UsuarioModel) => {
          this.globalService.setSpin(false);
          this.usuario = data;
          this.parametro.patchValue({ usuario: this.usuario.razao });
          this.getProjetos();
          this.getMotivos();
        },
        (error: any) => {
          this.globalService.setSpin(false);
          this.usuario = new UsuarioModel();
          console.log(error);
          this.appSnackBar.openFailureSnackBar(
            `${error.error.tabela} - ${error.error.erro} - ${error.error.message}`,
            'OK'
          );
        }
      );
  }

  getApontamentosExecucao() {
    let para = new ParametroAponExecucao01();
    para.id_empresa = this.globalService.getIdEmpresa();
    para.id_exec = this.globalService.getUsuario().id;
    para.id_projeto = 0;
    para.data = DataYYYYMMDD(this.parametro.value.data);
    para.controle = 'N';
    para.orderby = 'Executor';
    this.globalService.setSpin(true);
    this.inscricaoAponExecucao = this.aponExecucaoService
      .getApoExecucoes_01(para)
      .subscribe(
        (data: ApoExecucaoModel01[]) => {
          this.globalService.setSpin(false);
          this.apontamentos = data;
          this.totalHoras = 0;
          this.apontamentos.forEach((lan) => {
            this.totalHoras = this.totalHoras + Number(lan.horasapon);
          });
        },
        (error: any) => {
          this.globalService.setSpin(false);
          this.apontamentos = [];
          this.totalHoras = 0;
          if (error.error.message != 'Nehuma Informação Para Esta Consulta.') {
            this.appSnackBar.openFailureSnackBar(
              `Pesquisa Nos Apontamentos ${messageError(error)}`,
              'OK'
            );
          }
        }
      );
  }

  getApontamentosBancoHoras() {
    let para = new ParametroAponExecucao01();
    para.id_empresa = this.globalService.getIdEmpresa();
    para.id_exec = this.globalService.getUsuario().id;
    para.id_projeto = 0;
    para.data = DataYYYYMMDD(this.parametro.value.data);
    para.controle = 'S';
    para.orderby = 'Executor';
    this.globalService.setSpin(true);
    this.inscricaoBancoHoras = this.aponExecucaoService
      .getApoExecucoes_01(para)
      .subscribe(
        (data: ApoExecucaoModel01[]) => {
          this.globalService.setSpin(false);
          this.apontamentosBanco = data;
          this.totalHorasBanco = 0;
          this.apontamentosBanco.forEach((lan) => {
            this.totalHorasBanco = this.totalHorasBanco + Number(lan.horasapon);
          });
        },
        (error: any) => {
          this.globalService.setSpin(false);
          this.apontamentosBanco = [];
          this.totalHorasBanco = 0;
          if (error.error.message != 'Nehuma Informação Para Esta Consulta.') {
            this.appSnackBar.openFailureSnackBar(
              `Pesquisa Nos Apontamentos ${messageError(error)}`,
              'OK'
            );
          }
        }
      );
  }

  getLastProjects() {
    let par = new ParametroLastprojects();

    par.id_empresa = this.globalService.getIdEmpresa();

    par.id_exec = this.globalService.getUsuario().id;

    par.orderby = '';

    par.so_ativos = 'S';

    par.tem_atividade = 'S';

    par.nro_retorno = 20;

    this.globalService.setSpin(true);
    this.inscricaoGetContratos = this.projetosServices
      .getLastProjects(par)
      .subscribe(
        (data: ProjetoLastModel[]) => {
          this.lastContratos = data;
          this.lastContratosFiltrados = [];
          this.lastContratos.forEach((contrato) => {
            const idx: number = this.lastContratosFiltrados.findIndex(
              (filtro) =>
                filtro.id_empresa == contrato.id_empresa &&
                filtro.id_projeto == contrato.id_projeto
            );
            if (idx < 0) {
              this.lastContratosFiltrados.push(contrato);
            }
          });

          this.last = this.lastContratosFiltrados.length;

          this.lastContratosFiltrados = this.lastContratosFiltrados.sort(
            (a, b) => {
              if (a.cli_fantasia < b.cli_fantasia) {
                return 1;
              }
              if (a.cli_fantasia > b.cli_fantasia) {
                return -1;
              }
              return 0;
            }
          );
          this.lastContratosFiltrados.forEach((filtro) => {
            const projeto = this.tempoContratos.find(
              (contr) =>
                contr.id_empresa == filtro.id_empresa &&
                contr.id == filtro.id_projeto
            );
            if (projeto !== null && typeof projeto !== 'undefined') {
              this.tempoContratos.splice(0, 0, projeto as ProjetoModel);
            }
          });
          this.contratos = this.tempoContratos;
          this.parametro.patchValue({ id_contrato: this.contratos[0].id });
          this.tempoContratos = [];
          this.lastContratosFiltrados = [];
          this.lastContratos = [];
          this.globalService.setSpin(false);
          this.onChangeContrato();
        },
        (error: any) => {
          this.globalService.setSpin(false);
          this.appSnackBar.openSuccessSnackBar(
            `Pesquisa Último Contratos ${messageError(error)}`,
            'OK'
          );
          this.lastContratos = [];
        }
      );
  }

  getProjetos() {
    let par = new ParametroProjeto01();

    par.id_empresa = 1;

    par.orderby = 'Fantasia';

    par.so_ativos = 'S';

    par.tem_atividade = 'S';

    this.globalService.setSpin(true);
    this.inscricaoGetContratos = this.projetosServices
      .getProjetos_01(par)
      .subscribe(
        (data: ProjetoModel[]) => {
          this.globalService.setSpin(false);
          this.tempoContratos = data;
          this.getLastProjects();
        },
        (error: any) => {
          this.globalService.setSpin(false);
          this.appSnackBar.openSuccessSnackBar(
            `Pesquisa Contratos ${messageError(error)}`,
            'OK'
          );
          this.contratos = [];
          this.tempoContratos = [];
        }
      );
  }

  getAtividades(op: string) {
    let para = new ParametroAtividade01();
    para.id_empresa = this.globalService.getIdEmpresa();
    para.id_projeto = this.contrato.id;
    para.orderby = 'projeto';
    if (op == 'C') {
      para.so_abertas_ex = 'S';
      para.nivel = 1;
      para.tipo = 'C';
    } else {
      if (op == 'G') {
        para.so_abertas_ex = 'S';
        para.conta = this.estrutura.conta;
        para.nivel = 2;
        para.tipo = 'S';
      } else {
        para.so_abertas_ex = 'S';
        para.conta = this.grupo.conta;
        para.subconta = this.grupo.subconta.trim();
        para.subconta_nivel = 'S';
        para.nivel_filtro = this.grupo.nivel;
        para.nivel = 3;
        para.tipo = 'O';
      }
    }
    this.globalService.setSpin(true);
    this.inscricaoAtividades = this.atividadesService
      .getAtividades_01(para)
      .subscribe(
        (data: AtividadeQuery_01Model[]) => {
          this.globalService.setSpin(false);
          this.atividades = data;
          if (op == 'C') {
            this.estruturas = data;
            this.parametro.patchValue({ id_estrutura: this.estruturas[0].id });
            this.onChangeEstruturas();
          } else {
            if (op == 'G') {
              this.grupos = data;
              this.parametro.patchValue({ id_grupo: this.grupos[0].id });
              this.onChangeGrupos();
            } else {
              this.atividades = data;
              this.parametro.patchValue({
                id_atividade: this.atividades[0].id,
              });
              this.atividade = this.atividades.filter(
                (ativ) => ativ.id === this.parametro.value.id_atividade
              )[0];
              this.loaded = true;
            }
          }
        },
        (error: any) => {
          this.globalService.setSpin(false);
          if (op == 'C') {
            this.estruturas = [];
          } else {
            if (op == 'G') {
              this.grupos = [];
            } else {
              this.atividades = [];
            }
          }
        }
      );
  }

  getMotivos() {
    let para = new ParametroMotivoApo01();
    para.id_empresa = 1;
    para.analitico = 'S';
    para.orderby = 'Código';
    if (this.globalService.getUsuario().id == 16) para.controle = '';
    this.globalService.setSpin(true);
    this.inscricaoMotivos = this.motivoApoService
      .getMotivoApos_01(para)
      .subscribe(
        (data: MotivoApoModel[]) => {
          this.globalService.setSpin(false);
          this.motivos = data;
        },
        (error: any) => {
          this.globalService.setSpin(false);
          this.motivos = [];
          this.appSnackBar.openFailureSnackBar(
            `Pesquisa Motivos Apontamentos ${messageError(error)}`,
            'OK'
          );
        }
      );
  }

  setValue() {
    this.formulario.setValue({
      entrada: this.apontamento.inicial.substring(
        this.apontamento.inicial.indexOf(' ') + 1,
        16
      ),
      saida: this.apontamento.final.substring(
        this.apontamento.final.indexOf(' ') + 1,
        16
      ),
      grupo: `${this.apontamento.conta_descricao}/${this.apontamento.grupo_descricao}`,
      atividade: this.apontamento.estru_descricao,
      cliente: `${this.apontamento.cli_razao}(${this.apontamento.id_projeto}) ${this.apontamento.proj_descricao} `,
      id_motivo: this.apontamento.id_motivo,
      encerra: this.apontamento.encerramento == 'S' ? true : false,
      obs: this.apontamento.obs,
    });
  }

  setParametro() {
    this.parametro.setValue({
      usuario: this.usuario.razao,
      data:
        this.parData == ''
          ? new Date()
          : new Date(`${ddmmaaaatoaaaammdd(this.parData)}T00:00:00`),
      id_estrutura: 0,
      id_contrato: 0,
      id_grupo: 0,
      id_atividade: 0,
    });
  }

  setAcao(op: number) {
    this.focusEntrada = false;
    this.focusCancelar = false;
    switch (+op) {
      case CadastroAcoes.Inclusao:
        this.acao = 'Gravar';
        this.labelCadastro = `Inclusão - ${aaaammddddmmaaaa(
          this.apontamento.inicial
        )}`;
        this.readOnly = false;
        this.focusEntrada = true;
        break;
      case CadastroAcoes.Edicao:
        this.acao = 'Gravar';
        this.labelCadastro = `Alteração - ${aaaammddddmmaaaa(
          this.apontamento.inicial
        )}`;
        this.readOnly = false;
        this.focusEntrada = true;
        break;
      case CadastroAcoes.Consulta:
        this.acao = 'Voltar';
        this.labelCadastro = `Consulta - ${aaaammddddmmaaaa(
          this.apontamento.inicial
        )}`;
        this.readOnly = true;
        this.focusCancelar = true;
        break;
      case CadastroAcoes.Exclusao:
        this.acao = 'Excluir';
        this.labelCadastro = `Exclusão - ${aaaammddddmmaaaa(
          this.apontamento.inicial
        )}`;
        this.readOnly = true;
        break;
      default:
        this.acao = '';
        this.labelCadastro = '';
        break;
    }
  }

  setFiltro() {
    this.filtro = !this.filtro;
  }

  onSubmit() {
    this.gravando = true;
    try {
      if (
        this.idAcao == CadastroAcoes.Inclusao ||
        this.idAcao == CadastroAcoes.Edicao
      ) {
        /*
        Estou fazendo no BackEnd
        console.log(
          'Edição =>',
          this.intervalos,
          this.formulario.value.entrada,
          this.formulario.value.saida
        );

        validaIntervalo(
          this.intervalos,
          this.formulario.value.entrada,
          this.formulario.value.saida
        );
        */
      }
      if (this.formulario.valid) {
        this.executaAcao();
      } else {
        this.formulario.markAllAsTouched();
        this.gravando = false;
        this.appSnackBar.openSuccessSnackBar(
          `Formulário Com Campos Inválidos.`,
          'OK'
        );
      }
    } catch (err) {
      if (err instanceof ErrorIntervalo) {
        this.appSnackBar.openSuccessSnackBar(
          `Lançamento Conflitando: ${err.message}`,
          'OK'
        );
      } else {
        console.log(err);
      }
    }
  }

  onRefresh() {
    if (this.parametro.valid) {
      this.atividade = this.atividades.filter(
        (ativ) => ativ.id === this.parametro.value.id_atividade
      )[0];
    } else {
      this.appSnackBar.openSuccessSnackBar(
        `Formulário Com Campos Inválidos.`,
        'OK'
      );
    }
  }

  adicao(opcao: number) {
    this.gravando = false;
    let lastTime: string = '';
    if (this.apontamentos.length == 0) {
      lastTime = this.globalService.getUsuario().man_hora_entrada;
    } else {
      lastTime = this.apontamentos[
        this.apontamentos.length - 1
      ].final.substring(
        this.apontamentos[this.apontamentos.length - 1].final.indexOf(' ') + 1,
        16
      );
      if (lastTime === this.globalService.getUsuario().man_hora_saida) {
        lastTime = this.globalService.getUsuario().tard_hora_entrada;
      }
    }

    if (!this.parametro.valid) {
      this.parametro.markAllAsTouched();
      this.appSnackBar.openSuccessSnackBar(
        `Favor Preencher Os Parâmetros`,
        'OK'
      );
    } else {
      this.atividade = this.atividades.filter(
        (ativ) => ativ.id === this.parametro.value.id_atividade
      )[0];
      this.idAcao = opcao;
      this.setAcao(this.idAcao);
      this.apontamento = new ApoExecucaoModel();
      const date1 = new Date(
        setDBtoAngularGMT(
          `${DataYYYYMMDD(this.parametro.value.data)} ${lastTime}`
        )
      );
      this.apontamento.id_empresa = this.usuario.id_empresa;
      this.apontamento.id = 0;
      this.apontamento.id_projeto = this.atividade.id_projeto;
      this.apontamento.id_conta = this.atividade.conta;
      this.apontamento.id_subconta = this.atividade.subconta;
      this.apontamento.id_conta_versao = this.atividade.versao;
      this.apontamento.id_subcliente = this.atividade.id_subcliente;
      this.apontamento.proj_descricao = this.atividade.proj_descri;
      this.apontamento.cli_razao = this.atividade.subcliente_razao;
      this.apontamento.id_resp = this.atividade.id_resp;
      this.apontamento.id_exec = this.usuario.id;
      this.apontamento.inicial = setDBtoAngularGMT(
        `${DataYYYYMMDD(this.parametro.value.data)} ${lastTime}`
      ); //DataYYYYMMDDTHHMMSSZ(date1);
      this.apontamento.final = setDBtoAngularGMT(
        DataYYYYMMDD(this.parametro.value.data) + ' 00:00:00'
      ); //DataYYYYMMDDTHHMMSSZ(date1);
      this.apontamento.horasapon = 0;
      this.apontamento.id_motivo = this.globalService.codigoMotivo;
      this.apontamento.produtivo = 'S';
      this.apontamento.obs = '';
      this.apontamento.encerramento = 'N';
      this.apontamento.user_insert = this.usuario.id;
      this.apontamento.user_update = 0;
      this.apontamento.resp_razao = this.atividade.resp_razao;
      this.apontamento.exec_razao = this.atividade.exec_razao;
      this.apontamento.conta_descricao = this.estrutura.estru_descri;
      this.apontamento.grupo_descricao = this.grupo.estru_descri;
      this.apontamento.estru_descricao = this.atividade.estru_descri;
      this.idAcao = opcao;
      this.setAcao(this.idAcao);
      this.setValue();
    }
  }

  outras(opcao: number, lanca: ApoExecucaoModel01) {
    this.gravando = false;
    this.apontamento = new ApoExecucaoModel();
    this.apontamento.id_empresa = this.usuario.id_empresa;
    this.apontamento.id = lanca.id;
    this.apontamento.id_projeto = lanca.id_projeto;
    this.apontamento.id_conta = lanca.id_conta;
    this.apontamento.id_subconta = lanca.id_subconta;
    this.apontamento.id_conta_versao = lanca.id_conta_versao;
    this.apontamento.id_subcliente = lanca.id_subcliente;
    this.apontamento.cli_razao = lanca.cli_razao;
    this.apontamento.id_resp = lanca.id_resp;
    this.apontamento.id_exec = lanca.id_exec;
    this.apontamento.inicial = lanca.inicial;
    this.apontamento.final = lanca.final;
    this.apontamento.horasapon = 0;
    this.apontamento.id_motivo =
      opcao == CadastroAcoes.Inclusao
        ? this.globalService.codigoMotivo
        : lanca.id_motivo;
    this.apontamento.produtivo = 'S';
    this.apontamento.obs = lanca.obs;
    this.apontamento.encerramento = lanca.encerramento;
    this.apontamento.user_insert = lanca.user_insert;
    this.apontamento.user_update = lanca.user_update;
    this.apontamento.resp_razao = lanca.resp_razao;
    this.apontamento.exec_razao = lanca.exec_razao;
    this.apontamento.conta_descricao = lanca.conta_descricao;
    this.apontamento.grupo_descricao = lanca.grupo_descricao;
    this.apontamento.estru_descricao = lanca.estru_descricao;
    this.idAcao = opcao;
    this.setAcao(this.idAcao);
    this.setValue();
  }

  executaAcao() {
    let dataDia: Date = new Date();
    dataDia.setTime(Date.parse(this.apontamento.inicial));
    this.apontamento.inicial = setHorario(
      dataDia,
      getHora(this.formulario.value.entrada),
      getMinuto(this.formulario.value.entrada)
    );
    this.apontamento.final = setHorario(
      dataDia,
      getHora(this.formulario.value.saida),
      getMinuto(this.formulario.value.saida)
    );
    this.apontamento.horasapon = minutostostohorasexagenal(
      DifHoras(this.apontamento.inicial, this.apontamento.final)
    );
    this.apontamento.id_motivo = this.formulario.value.id_motivo;
    this.apontamento.obs = this.formulario.value.obs;
    this.apontamento.encerramento = this.formulario.value.encerra ? 'S' : 'N';
    switch (+this.idAcao) {
      case CadastroAcoes.Inclusao:
        this.apontamento.user_insert = this.globalService.getUsuario().id;
        this.apontamento.id_conta_versao = '0101';
        this.inscricaoAcao = this.aponExecucaoService
          .ApoExecucaoInsert(this.apontamento)
          .subscribe(
            async (data: ApoExecucaoModel) => {
              this.onCancel();
            },
            (error: any) => {
              this.gravando = false;
              console.log('erro=>', error);
              this.appSnackBar.openFailureSnackBar(
                `${error.error.tabela} - ${error.error.erro} - ${error.error.message}`,
                'OK'
              );
            }
          );
        break;
      case CadastroAcoes.Edicao:
        this.apontamento.user_update = this.globalService.getUsuario().id;
        this.inscricaoAcao = this.aponExecucaoService
          .ApoExecucaoUpdate(this.apontamento)
          .subscribe(
            async (data: any) => {
              this.onCancel();
            },
            (error: any) => {
              this.gravando = false;
              this.appSnackBar.openFailureSnackBar(
                `${error.error.tabela} - ${error.error.erro} - ${error.error.message}`,
                'OK'
              );
            }
          );
        break;
      case CadastroAcoes.Exclusao:
        this.inscricaoAcao = this.aponExecucaoService
          .ApoExecucaoDelete(this.apontamento.id_empresa, this.apontamento.id)
          .subscribe(
            async (data: any) => {
              this.onCancel();
            },
            (error: any) => {
              this.gravando = false;
              this.appSnackBar.openFailureSnackBar(
                `Erro Na Exclusao ${error.error.tabela} - ${error.error.erro} - ${error.error.message}`,
                'OK'
              );
            }
          );
        break;
      default:
        break;
    }
  }

  onCancel() {
    if (this.idAcao != this.getAcoes().Consulta) {
      this.getApontamentosExecucao();
      this.getApontamentosBancoHoras();
    }
    this.idAcao = 99;
    this.setAcao(99);
  }

  getLabelCancel() {
    if (this.idAcao == CadastroAcoes.Consulta) {
      return 'Voltar';
    } else {
      return 'Cancelar';
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

  getTexto() {
    return MensagensBotoes;
  }

  onChangeData() {
    this.getApontamentosExecucao();
    this.getApontamentosBancoHoras();
  }

  onParametrosChange() {
    this.onRefresh();
  }

  getTitulo(): string {
    return 'Apontamentos de execução ';
  }

  showDadosProjetoAgendamento(lanca: ApoPlanejamentoQuery_01Model): string {
    let retorno = '';

    retorno = `Projeto: ${lanca.id_projeto} Diretor: ${lanca.diretor_razao} Resp.: ${lanca.resp_razao}`;

    return retorno;
  }

  showDadosProjetoApontamento(lanca: ApoExecucaoModel): string {
    let retorno = '';

    retorno = `Projeto: ${lanca.id_projeto} Descricao: ${lanca.proj_descricao} Resp.: ${lanca.resp_razao}`;

    return retorno;
  }

  onShowAtividades() {
    this.showAtividades = !this.showAtividades;
  }

  onCancelarAtividades() {
    this.onShowAtividades();
  }

  onOkAtividades() {
    this.onShowAtividades();
  }

  onChangeContrato() {
    let idx: number = this.contratos.findIndex(
      (obj) => obj.id === this.parametro.value?.id_contrato
    );
    if (idx >= 0) {
      this.contrato = this.contratos[idx];
      this.estruturas = [];
      this.grupos = [];
      this.atividades = [];
      this.getAtividades('C');
    }
  }

  onChangeEstruturas() {
    let idx: number = this.estruturas.findIndex(
      (obj) => obj.id === this.parametro.value?.id_estrutura
    );
    if (idx >= 0) {
      this.grupos = [];
      this.atividades = [];
      this.estrutura = this.estruturas[idx];
      this.getAtividades('G');
    }
  }

  onChangeGrupos() {
    let idx: number = this.grupos.findIndex(
      (obj) => obj.id === this.parametro.value?.id_grupo
    );
    if (idx >= 0) {
      this.atividades = [];
      this.grupo = this.grupos[idx];
      this.getAtividades('');
    }
  }

  onManha() {
    this.apontamento.inicial =
      this.apontamento.inicial.substring(
        0,
        this.apontamento.final.indexOf(' ') + 1
      ) + this.globalService.getUsuario().man_hora_entrada;
    this.apontamento.final =
      this.apontamento.final.substring(
        0,
        this.apontamento.final.indexOf(' ') + 1
      ) + this.globalService.getUsuario().man_hora_saida;
    this.formulario.patchValue({
      entrada: this.apontamento.inicial.substring(
        this.apontamento.inicial.indexOf(' ') + 1,
        16
      ),
      saida: this.apontamento.final.substring(
        this.apontamento.final.indexOf(' ') + 1,
        16
      ),
    });
  }
  onTarde() {
    let lastTime = '';
    let hoje: Date = new Date(this.apontamento.inicial);
    if (hoje.getDay() == 5) {
      lastTime = '16:33';
    } else {
      lastTime = this.globalService.getUsuario().tard_hora_saida;
    }
    this.apontamento.inicial =
      this.apontamento.inicial.substring(
        0,
        this.apontamento.inicial.indexOf(' ') + 1
      ) + this.globalService.getUsuario().tard_hora_entrada;
    this.apontamento.final =
      this.apontamento.final.substring(
        0,
        this.apontamento.final.indexOf(' ') + 1
      ) + lastTime;
    this.formulario.patchValue({
      entrada: this.apontamento.inicial.substring(
        this.apontamento.inicial.indexOf(' ') + 1,
        16
      ),
      saida: this.apontamento.final.substring(
        this.apontamento.final.indexOf(' ') + 1,
        16
      ),
    });
  }

  onAlmoco() {
    this.apontamento.inicial =
      this.apontamento.inicial.substring(
        0,
        this.apontamento.inicial.indexOf(' ') + 1
      ) + '12:00';
    this.apontamento.final =
      this.apontamento.final.substring(
        0,
        this.apontamento.final.indexOf(' ') + 1
      ) + '13:00';
    this.formulario.patchValue({
      entrada: this.apontamento.inicial.substring(
        this.apontamento.inicial.indexOf(' ') + 1,
        16
      ),
      saida: this.apontamento.final.substring(
        this.apontamento.final.indexOf(' ') + 1,
        16
      ),
    });
  }

  onDiaTodo() {}

  getfirstName(name: string): string {
    return getFirstName(name);
  }

  /* Rotinas para autocomplete */
  filtroContratos(value: string) {
    //this.contratosFiltrados = this.contratos.filter((ct) => {
    //  return ct.descricao.indexOf(value) > -1;
    // }
    // );
  }

  onChangeContrato2(event: any) {
    console.log(event);
  }

  onRetorno() {
    this.router.navigate(['/']);
  }

  onLancaMulti() {
    console.log('Chamando componente!', this.parametro.value.data);
    this.router.navigate([
      '/execucao/execucoesv2multi',
      DataDDMMYYYY(this.parametro.value.data),
    ]);
  }
}
