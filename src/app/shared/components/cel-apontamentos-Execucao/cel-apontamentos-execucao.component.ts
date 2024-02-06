import { GlobalService } from '../../../services/global.service';
import { ParametroAponExecucao01 } from '../../../parametros/parametro-apon-execucao01';
import { AponExecucaoService } from '../../../services/apon-execucao.service';
import { CelulaDia } from 'src/app/shared/classes/celula-dia';
import { Component, Input, OnInit, ViewChild } from '@angular/core';
import { ApoExecucaoModel } from 'src/app/Models/apo-execucao-model';
import { ApoExecucaoModel01 } from 'src/app/Models/apo-execucao-model01';
import { ApoPlanejamentoQuery_01Model } from 'src/app/Models/apo-planejamento-query_01-model';
import { AponPlanejamentoService } from 'src/app/services/apon-planejamento.service';
import { DatePipe } from '@angular/common';
import { Subscription } from 'rxjs/internal/Subscription';
import { ParametroAgendaPlanejamento01 } from 'src/app/parametros/parametro-agenda-planejamento01';
import { getFirstName } from '../../classes/util';
import { ApoExecData } from '../apo-exec-dialog/apo-exec-data';
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';
import { ApoExecDialogComponent } from '../apo-exec-dialog/apo-exec-dialog.component';
import { CadastroAcoes } from '../../classes/cadastro-acoes';

@Component({
  selector: 'app-cel-apontamentos-execucao',
  templateUrl: './cel-apontamentos-execucao.component.html',
  styleUrls: ['./cel-apontamentos-execucao.component.css'],
  providers: [DatePipe],
})
export class CelApontamentosExecucaoComponent implements OnInit {
  @Input('UNICO') Unico: boolean = false;
  cel: CelulaDia = new CelulaDia();
  apontamentos: ApoExecucaoModel01[] = [];
  apontamentosBanco: ApoExecucaoModel01[] = [];

  inscricaoExecutadas!: Subscription;
  inscricaoBancoHoras!: Subscription;

  totalHoras: number = 0;

  totalHorasBanco: number = 0;

  constructor(
    private datePipe: DatePipe,
    private aponExecucaoService: AponExecucaoService,
    private globslService: GlobalService,
    private apoExecDialogComponent: MatDialog
  ) {
    this.globslService.refreshLançamentos.subscribe((dia) => {
      this.cel = dia;
      if (this.cel.tipo == 3 || this.cel.semana == 0) {
        this.apontamentos = [];
      } else {
        this.getExecutados();
        this.getApontamentosBancoHoras();
      }
    });
  }

  ngOnInit() {}

  ngOnDestroy(): void {
    this.inscricaoExecutadas?.unsubscribe();
    this.inscricaoBancoHoras?.unsubscribe();
  }

  showDadosProjetoApontamento(lanca: ApoExecucaoModel): string {
    let retorno = '';

    retorno = `Projeto: ${lanca.id_projeto} Descricao: ${lanca.proj_descricao} Resp.: ${lanca.resp_razao}`;

    return retorno;
  }

  getExecutados() {
    const par = new ParametroAponExecucao01();
    let dt = this.datePipe.transform(this.cel.data, 'yyyy-MM-dd');
    if (!dt) {
      dt = '';
    }
    par.id_empresa = this.globslService.getIdEmpresa();
    par.id_resp = this.cel.id_resp;
    par.id_exec = this.cel.id_exec;
    par.id_dir = this.cel.id_diretor;
    par.data = dt;
    par.orderby = 'Executor';
    par.controle = 'N';
    this.globslService.setSpinApontamentos(true);
    this.inscricaoExecutadas = this.aponExecucaoService
      .getApoExecucoes_01(par)
      .subscribe(
        (data: ApoExecucaoModel01[]) => {
          this.globslService.setSpinApontamentos(false);
          this.apontamentos = data;
          this.totalHoras = 0;
          this.apontamentos.forEach((lan) => {
            this.totalHoras = this.totalHoras + Number(lan.horasapon);
          });
        },
        (error: any) => {
          this.globslService.setSpinApontamentos(false);
          this.apontamentos = [];
        }
      );
  }

  getApontamentosBancoHoras() {
    const par = new ParametroAponExecucao01();
    let dt = this.datePipe.transform(this.cel.data, 'yyyy-MM-dd');
    if (!dt) {
      dt = '';
    }
    par.id_empresa = this.globslService.getIdEmpresa();
    par.id_resp = this.cel.id_resp;
    par.id_exec = this.cel.id_exec;
    par.id_dir = this.cel.id_diretor;
    par.data = dt;
    par.orderby = 'Executor';
    par.controle = 'S';
    this.globslService.setSpinApontamentos(true);
    this.inscricaoExecutadas = this.aponExecucaoService
      .getApoExecucoes_01(par)
      .subscribe(
        (data: ApoExecucaoModel01[]) => {
          this.globslService.setSpinApontamentos(false);
          this.apontamentosBanco = data;
          this.totalHorasBanco = 0;
          this.apontamentosBanco.forEach((lan) => {
            this.totalHorasBanco = this.totalHorasBanco + Number(lan.horasapon);
          });
        },
        (error: any) => {
          this.globslService.setSpinApontamentos(false);
          this.apontamentosBanco = [];
          this.totalHorasBanco = 0;
        }
      );
  }

  getfirstName(name: string): string {
    return getFirstName(name);
  }

  onGoLancamento(opcao: number, lancamento: ApoExecucaoModel01) {
    this.openApoExecDialog(opcao, lancamento);
  }

  getAcoes() {
    return CadastroAcoes;
  }

  openApoExecDialog(opcao: number, lancamento: ApoExecucaoModel01): void {
    const data: ApoExecData = new ApoExecData();

    data.apontamento = lancamento;
    data.opcao = opcao;

    const dialogConfig = new MatDialogConfig();

    dialogConfig.disableClose = true;
    dialogConfig.id = 'apontamento';
    dialogConfig.width = '900px';
    dialogConfig.data = data;
    const modalDialog = this.apoExecDialogComponent
      .open(ApoExecDialogComponent, dialogConfig)
      .beforeClosed()
      .subscribe((data: ApoExecData) => {
        this.getExecutados();
        this.globslService.setRefreshCabec(this.cel);
      });
  }
}
