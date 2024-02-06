import { Component, ElementRef, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { ApoExecucaoModel01 } from 'src/app/Models/apo-execucao-model01';
import { ProjetoModel } from 'src/app/Models/projeto-model';
import { ParametroAponExecucao01 } from 'src/app/parametros/parametro-apon-execucao01';
import { AponExecucaoService } from 'src/app/services/apon-execucao.service';
import { GlobalService } from 'src/app/services/global.service';
import { ProjetosService } from 'src/app/services/projetos.service';
import { AppSnackbar } from 'src/app/shared/classes/app-snackbar';
import { messageError } from 'src/app/shared/classes/util';
import { WorkProject } from 'src/app/shared/classes/work-projet';
import { FirstNamePipe } from 'src/app/shared/pipes/first-name.pipe';
import { HoraSexagenalPipe } from 'src/app/shared/pipes/hora-sexagenal.pipe';

declare var google: any;

@Component({
  selector: 'app-dashboardv1',
  templateUrl: './dashboardv1.component.html',
  styleUrls: ['./dashboardv1.component.css'],
})
export class Dashboardv1Component implements OnInit {
  inscricaoGetProjeto!: Subscription;
  inscricaoAponExecucao!: Subscription;
  inscricaoRota!: Subscription;

  projeto: ProjetoModel = new ProjetoModel();
  id_empresa: number = 0;
  id_projeto: number = 0;
  apontamentos: ApoExecucaoModel01[] = [];
  totalHoras: number = 0;
  responsaveis: WorkProject[] = [];
  executores: WorkProject[] = [];
  id_exec: number = 0;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private appSnackBar: AppSnackbar,
    private globalService: GlobalService,
    private projetosService: ProjetosService,
    private aponExecucaoService: AponExecucaoService,
    private horaSexagenal: HoraSexagenalPipe,
    private firstName: FirstNamePipe
  ) {
    google.charts.load('current', { packages: ['corechart'] });
    this.projeto = new ProjetoModel();
    this.inscricaoRota = route.params.subscribe((params: any) => {
      this.id_empresa = params.id_empresa;
      this.id_projeto = params.id_projeto;
    });
  }

  ngOnInit(): void {
    this.getProjeto();
  }

  ngOnDestroy(): void {
    this.inscricaoRota?.unsubscribe();
    this.inscricaoGetProjeto?.unsubscribe();
    this.inscricaoAponExecucao?.unsubscribe();
  }

  getProjeto() {
    this.globalService.setSpin(true);
    this.inscricaoGetProjeto = this.projetosService
      .getProjeto(this.id_empresa, this.id_projeto)
      .subscribe(
        (data: ProjetoModel) => {
          this.globalService.setSpin(false);
          this.projeto = data;
          this.getApontamentosExecucao();
        },
        (error: any) => {
          this.globalService.setSpin(false);
          this.projeto = new ProjetoModel();
          this.apontamentos = [];
          this.appSnackBar.openFailureSnackBar(
            `Pesquisa  Projeto ${messageError(error)}`,
            'OK'
          );
        }
      );
  }

  getApontamentosExecucao() {
    let para = new ParametroAponExecucao01();
    para.id_empresa = this.globalService.getIdEmpresa();
    para.id_exec = 0;
    para.id_projeto = this.projeto.id;
    para.data = '';
    para.orderby = 'Executor';
    if (this.id_projeto == 900000) para.controle = '';
    this.globalService.setSpin(true);
    this.inscricaoAponExecucao = this.aponExecucaoService
      .getApoExecucoes_01(para)
      .subscribe(
        (data: ApoExecucaoModel01[]) => {
          this.globalService.setSpin(false);
          this.apontamentos = data;
          this.totalHoras = 0;
          console.log(this.apontamentos);
          this.apontamentos.forEach((lan) => {
            this.totalHoras = this.totalHoras + Number(lan.horasapon);
            //responsáveis
            let idx = this.responsaveis.findIndex(
              (resp) => resp.id == lan.id_resp
            );
            if (idx == -1) {
              const resp: WorkProject = new WorkProject();
              resp.id = lan.id_resp;
              resp.nome = lan.resp_razao;
              resp.horas = Number(lan.horasapon);
              this.responsaveis.push(resp);
            } else {
              this.responsaveis[idx].horas =
                this.responsaveis[idx].horas + Number(lan.horasapon);
            }
            //executores
            idx = this.executores.findIndex((exec) => exec.id == lan.id_exec);
            if (idx == -1) {
              const exec: WorkProject = new WorkProject();
              exec.id = lan.id_exec;
              exec.nome = lan.exec_razao;
              exec.horas = Number(lan.horasapon);
              this.executores.push(exec);
            } else {
              this.executores[idx].horas =
                this.executores[idx].horas + Number(lan.horasapon);
            }
          });
          this.Atualizar();
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

  onFiltro(executor: WorkProject) {
    this.id_exec = executor.id;
  }

  onTodos() {
    this.id_exec = 0;
  }
  getApontatamentos(): ApoExecucaoModel01[] {
    if (this.id_exec == 0) return this.apontamentos;
    return this.apontamentos.filter((apo) => apo.id_exec == this.id_exec);
  }

  onRetorno() {
    //this.onTestePDF();
    const par = this.globalService.estadoFind('projeto');
    if (par != null) {
      let config = par.getParametro();
      Object(config).new = false;
      Object(config).id_retorno = this.projeto.id;
      par.parametro = JSON.stringify(config);
      this.globalService.estadoSave(par);
    }
    this.router.navigate(['/projetos/projetos', 'SIM']);
  }

  Atualizar() {
    if (this.globalService.logado) {
      this.buidChartExecutores(this.executores);
    }
  }

  buidChartExecutores(dados: WorkProject[]) {
    var func = (chart: any) => {
      var horas: number = 0;
      var data = new google.visualization.DataTable();
      data.addColumn('string', 'Topping');
      data.addColumn('number', 'Slices');
      dados.forEach((exec) => {
        data.addRows([[this.firstName.transform(exec.nome), exec.horas]]);
        horas += exec.horas;
      });
      var options = {
        title: `Total De Horas Trabalhadas ${this.horaSexagenal.transform(
          horas
        )}`,
        width: 400,
        height: 300,
      };
      chart().draw(data, options);
    };
    var chart = () =>
      new google.visualization.PieChart(document.getElementById('chart_div'));
    var callBack = () => func(chart);
    google.charts.setOnLoadCallback(callBack);
  }
}
