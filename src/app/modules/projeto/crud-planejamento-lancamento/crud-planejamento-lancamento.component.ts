import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Component, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { ActivatedRoute, Router } from '@angular/router';
import { MatSnackBar } from '@angular/material/snack-bar';
import { AtividadesService } from 'src/app/services/atividades.service';
import { MoviData } from 'src/app/Models/movi-data';
import {
  DataYYYYMMDD,
  DataYYYYMMDDTHHMMSSZ,
  DiasUteisV2,
  DifHoras,
  getHora,
  getMinuto,
  MensagensBotoes,
  minutostostohorasexagenal,
  populaIntervalo,
  setDBtoAngular,
  setDBtoAngularGMT,
  setHorario,
  validaIntervalo,
} from 'src/app/shared/classes/util';
import { CadastroAcoes } from 'src/app/shared/classes/cadastro-acoes';
import { ApoPlanejamentoMoldel } from 'src/app/Models/apo-planejamento-moldel';
import { ParametroAgendaPlanejamento03 } from 'src/app/parametros/parametro-agenda-planejamento03';
import { ErrorIntervalo } from 'src/app/shared/classes/error-intervalo';
import { AtividadeModel } from 'src/app/Models/atividade-model';
import { Movimento } from 'src/app/Models/movimento';
import { AponPlanejamentoService } from 'src/app/services/apon-planejamento.service';
import { Intervalo } from 'src/app/shared/classes/intervalo';
import { GlobalService } from 'src/app/services/global.service';
import { DatePipe } from '@angular/common';
import { AppSnackbar } from 'src/app/shared/classes/app-snackbar';

@Component({
  selector: 'app-crud-planejamento-lancamento',
  templateUrl: './crud-planejamento-lancamento.component.html',
  styleUrls: ['./crud-planejamento-lancamento.component.css'],
})
export class CrudPlanejamentoLancamentoComponent implements OnInit {
  durationInSeconds: number = 2;
  parametroAgendaPlanejamento03: ParametroAgendaPlanejamento03 =
    new ParametroAgendaPlanejamento03();
  agendamento: MoviData = new MoviData();
  inscricaoGetAll!: Subscription;
  inscricaoAcao!: Subscription;
  inscricaoRota!: Subscription;
  inscricaoAtividade!: Subscription;
  inscricaoApontamento!: Subscription;
  inscricaoAponAgendas!: Subscription;
  idAcao: number = 0;
  acao: string = '';
  labelCadastro: string = '';
  id_empresa: number = 0;
  id_atividade: number = 0;
  atividade: AtividadeModel = new AtividadeModel();
  apontamento: ApoPlanejamentoMoldel = new ApoPlanejamentoMoldel();
  dados_projetos: string = ``;
  intervalos: Intervalo[] = [];
  filtro: Boolean = false;
  filtroData: Boolean = false;
  formulario: FormGroup;
  dataFiltro: string = '';

  constructor(
    formBuilder: FormBuilder,
    private atividadesService: AtividadesService,
    private aponPlanejamentoService: AponPlanejamentoService,
    private route: ActivatedRoute,
    private globalService: GlobalService,
    private router: Router,
    private appSnackBar: AppSnackbar,
    private datePipe: DatePipe
  ) {
    this.formulario = formBuilder.group({
      entrada: [{ value: '' }],
      saida: [],
      encerra: [],
      obs: [{ value: '' }],
    });
    this.setValue();
    this.inscricaoRota = this.route.params.subscribe((params: any) => {
      this.id_empresa = params.id_empresa;
      this.id_atividade = params.id_atividade;
    });
    this.idAcao = 99;
    this.setAcao(this.idAcao);
    this.setValue();
    this.getAtividade();
  }

  ngOnInit(): void {}

  ngOnDestroy(): void {
    this.inscricaoGetAll?.unsubscribe();
    this.inscricaoAcao?.unsubscribe();
    this.inscricaoRota?.unsubscribe();
    this.inscricaoAtividade?.unsubscribe();
    this.inscricaoApontamento?.unsubscribe();
    this.inscricaoAponAgendas?.unsubscribe();
  }

  setAcao(op: number) {
    switch (+op) {
      case CadastroAcoes.Inclusao:
        this.acao = 'Gravar';
        break;
      case CadastroAcoes.Edicao:
        this.acao = 'Gravar';
        break;
      case CadastroAcoes.Consulta:
        this.acao = 'Voltar';
        break;
      case CadastroAcoes.Exclusao:
        this.acao = 'Excluir';
        break;
      default:
        this.acao = '';
        this.labelCadastro = '';
        break;
    }
  }

  adicao(opcao: number, agendamento: MoviData) {
    this.apontamento = new ApoPlanejamentoMoldel();
    this.agendamento = agendamento;
    this.intervalos = populaIntervalo(
      agendamento.movimentos,
      this.apontamento.id
    );
    const date1 = new Date(setDBtoAngularGMT(agendamento.data_ + ' 00:00:00'));
    this.apontamento.id_empresa = this.id_empresa;
    this.apontamento.id_empresa = 0;
    this.apontamento.id = 0;
    this.apontamento.id_projeto = this.atividade.id_projeto;
    this.apontamento.id_conta = this.atividade.conta;
    this.apontamento.id_subconta = this.atividade.subconta;
    this.apontamento.id_resp = this.atividade.id_resp;
    this.apontamento.id_exec = this.atividade.id_exec;
    this.apontamento.inicial = setDBtoAngularGMT(
      DataYYYYMMDD(date1) + ' 00:00:00'
    );
    this.apontamento.final = setDBtoAngularGMT(
      DataYYYYMMDD(date1) + ' 00:00:00'
    );
    this.apontamento.horasapon = 0;
    this.apontamento.obs = '';
    this.apontamento.encerra = '';
    this.apontamento.user_insert = 1;
    this.apontamento.user_update = 0;
    this.apontamento.resp_razao = '';
    this.apontamento.exec_razao = '';
    this.apontamento.ativ_descricao = '';
    this.idAcao = opcao;
    this.setAcao(this.idAcao);
    this.labelCadastro = (
      this.datePipe.transform(agendamento.data, 'dd-MM-yyyy') || ''
    ).toString();
    this.setValue();
  }

  outras(opcao: number, agendamento: MoviData, lanca: Movimento) {
    this.getApontamento(lanca.id_empresa, lanca.id, agendamento);
    this.agendamento = agendamento;
    this.labelCadastro = (
      this.datePipe.transform(this.agendamento.data, 'dd-MM-yyyy') || ''
    ).toString();
    this.idAcao = opcao;
    this.setAcao(this.idAcao);
  }
  executaAcao() {
    let dataDia: Date = new Date(this.agendamento.data);
    this.apontamento.id_empresa = this.id_empresa;
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
    this.apontamento.encerra = this.formulario.value.encerra ? 'S' : 'N';
    this.apontamento.obs = this.formulario.value.obs;
    switch (+this.idAcao) {
      case CadastroAcoes.Inclusao:
        this.apontamento.user_insert = this.globalService.getUsuario().id;
        this.inscricaoAcao = this.aponPlanejamentoService
          .ApoPlanejamentoInsert(this.apontamento)
          .subscribe(
            async (data: ApoPlanejamentoMoldel) => {
              this.getAponAgendas();
              this.onCancel();
            },
            (error: any) => {
              this.appSnackBar.openFailureSnackBar(
                `${error.error.tabela} - ${error.error.erro} - ${error.error.message}`,
                'OK'
              );
            }
          );
        break;
      case CadastroAcoes.Edicao:
        this.apontamento.user_update = this.globalService.getUsuario().id;
        this.inscricaoAcao = this.aponPlanejamentoService
          .ApoPlanejamentoUpdate(this.apontamento)
          .subscribe(
            async (data: any) => {
              this.getAponAgendas();
              await this.appSnackBar.openSuccessSnackBar(data.message, 'OK');
              this.onCancel();
            },
            (error: any) => {
              console.log('Error', error.error);
              this.appSnackBar.openFailureSnackBar(
                `${error.error.tabela} - ${error.error.erro} - ${error.error.message}`,
                'OK'
              );
            }
          );
        break;
      case CadastroAcoes.Exclusao:
        this.inscricaoAcao = this.aponPlanejamentoService
          .ApoPlanejamentoDelete(
            this.apontamento.id_empresa,
            this.apontamento.id
          )
          .subscribe(
            async (data: any) => {
              this.getAponAgendas();
              await this.appSnackBar.openSuccessSnackBar(data.message, 'OK');
              this.onCancel();
            },
            (error: any) => {
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
      encerra: this.apontamento.encerra == 'S' ? true : false,
      obs: this.apontamento.obs,
    });
  }

  getAtividade() {
    this.inscricaoAtividade = this.atividadesService
      .getAtividade(this.id_empresa, this.id_atividade)
      .subscribe(
        (data: AtividadeModel) => {
          console.log('atividade==>', data);
          this.atividade = data;
          let agendamentos: MoviData[] = [];
          this.parametroAgendaPlanejamento03 =
            new ParametroAgendaPlanejamento03();
          this.parametroAgendaPlanejamento03.id_empresa =
            this.atividade.id_empresa;
          this.parametroAgendaPlanejamento03.id_projeto = this.atividade.id;
          this.parametroAgendaPlanejamento03.id_conta = this.atividade.conta;
          this.parametroAgendaPlanejamento03.id_subconta =
            this.atividade.subconta;
          if (this.dataFiltro !== '') {
            agendamentos = DiasUteisV2(
              this.dataFiltro,
              this.dataFiltro,
              this.atividade.id_exec
            );
          } else {
            agendamentos = DiasUteisV2(
              DataYYYYMMDD(this.atividade.inicial),
              DataYYYYMMDD(this.atividade.final),
              this.atividade.id_exec
            );
          }
          console.log('Agendamentos..', agendamentos);
          this.parametroAgendaPlanejamento03.agenda = agendamentos;
          console.log(
            'parametroAgendaPlanejamento03',
            this.parametroAgendaPlanejamento03
          );
          this.getAponAgendas();
        },
        (error: any) => {
          this.atividade = new AtividadeModel();
          this.appSnackBar.openFailureSnackBar(
            `${error.error.tabela} - ${error.error.erro} - ${error.error.message}`,
            'OK'
          );
        }
      );
  }

  getApontamento(id_empresa: number, id_apon: number, agendamento: MoviData) {
    this.inscricaoApontamento = this.aponPlanejamentoService
      .getApoPlanejamento(id_empresa, id_apon)
      .subscribe(
        (data: ApoPlanejamentoMoldel) => {
          this.apontamento = data;
          this.intervalos = populaIntervalo(agendamento.movimentos, id_apon);
          this.setValue();
        },
        (error: any) => {
          this.atividade = new AtividadeModel();
          this.appSnackBar.openFailureSnackBar(
            `${error.error.tabela} - ${error.error.erro} - ${error.error.message}`,
            'OK'
          );
        }
      );
  }

  getAponAgendas() {
    this.inscricaoAponAgendas = this.aponPlanejamentoService
      .getAponAgendaPlanejamentosV2(this.parametroAgendaPlanejamento03)
      .subscribe(
        (data: ParametroAgendaPlanejamento03) => {
          this.parametroAgendaPlanejamento03 = data;
        },
        (error: any) => {
          this.atividade = new AtividadeModel();
          this.appSnackBar.openFailureSnackBar(
            `${error.error.tabela} - ${error.error.erro} - ${error.error.message}`,
            'OK'
          );
        }
      );
  }

  onSubmit() {
    try {
      if (
        this.idAcao == CadastroAcoes.Inclusao ||
        this.idAcao == CadastroAcoes.Edicao
      ) {
        validaIntervalo(
          this.intervalos,
          this.formulario.value.entrada,
          this.formulario.value.saida
        );
      }
      if (this.formulario.valid) {
        this.executaAcao();
      } else {
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

  onCancel() {
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

  onRetorno() {
    this.router.navigate([
      'projetos/anexaratividade',
      this.atividade.id_empresa,
      this.atividade.id_projeto,
      this.atividade.conta,
    ]);
  }

  setFiltro() {
    this.filtro = !this.filtro;
  }

  setFiltroData(agendamento: MoviData) {
    console.log('Filtro Entrando', DataYYYYMMDD(agendamento.data));
    this.filtroData = !this.filtroData;
    if (this.filtroData) {
      console.log('Filtro Ativado', agendamento);
      this.dataFiltro = agendamento.data_;
      this.getAtividade();
    } else {
      this.dataFiltro = '';
      this.getAtividade();
    }
  }

  exibir(lanca: Movimento): Boolean {
    let retorno: Boolean = true;

    if (this.filtro && lanca.id_projeto !== this.atividade.id_projeto) {
      retorno = false;
    }

    return retorno;
  }

  showDadosProjeto(lanca: Movimento): string {
    let retorno = '';

    retorno = `Projeto: ${lanca.id_projeto} Descrição: ${lanca.proj_descricao} Resp.: ${lanca.resp_razao}`;

    return retorno;
  }

  onManha() {
    this.apontamento.inicial =
      this.apontamento.inicial.substring(
        0,
        this.apontamento.final.indexOf(' ') + 1
      ) + '07:45';
    this.apontamento.final =
      this.apontamento.final.substring(
        0,
        this.apontamento.final.indexOf(' ') + 1
      ) + '12:00';
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
    this.apontamento.inicial =
      this.apontamento.inicial.substring(
        0,
        this.apontamento.inicial.indexOf(' ') + 1
      ) + '13:00';
    this.apontamento.final =
      this.apontamento.final.substring(
        0,
        this.apontamento.final.indexOf(' ') + 1
      ) + '17:45';
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
}
