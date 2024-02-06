import { AppSnackbar } from 'src/app/shared/classes/app-snackbar';
import { GlobalService } from 'src/app/services/global.service';
import { ListaMeses } from '../../../shared/classes/lista-meses';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { UsuariosService } from 'src/app/services/usuarios.service';
import { CalendarLine } from 'src/app/shared/classes/calendar-line';
import { CelulaDia } from 'src/app/shared/classes/celula-dia';
import { UsuarioQuery01Model } from 'src/app/Models/usuario-query_01-model';
import { ParametroUsuario01 } from 'src/app/parametros/parametro-usuario01';
import { AgeHorasModel } from 'src/app/Models/age-horas-model';
import { ProjetosService } from 'src/app/services/projetos.service';
import { ParametroAgeHoras01 } from 'src/app/parametros/parametro-age-horas-01';
import { getFirstName, messageError } from 'src/app/shared/classes/util';

@Component({
  selector: 'app-agenda-view',
  templateUrl: './agenda-view.component.html',
  styleUrls: ['./agenda-view.component.css'],
})
export class AgendaViewComponent implements OnInit {
  parametro: FormGroup;

  inscricaoAuditor!: Subscription;
  inscricaoAgenda!: Subscription;

  auditor: number = 0;
  auditores: UsuarioQuery01Model[] = [];

  agendas: AgeHorasModel[] = [];

  calendario: CelulaDia[] = [];
  linhas: CalendarLine[] = [];
  anos: number[] = [2022, 2023, 2024];
  meses: ListaMeses = new ListaMeses();
  hoje: Date = new Date();
  showLancamento: boolean = false;
  celulaDia: CelulaDia = new CelulaDia();

  constructor(
    formBuilder: FormBuilder,
    private usuariosService: UsuariosService,
    private projetosService: ProjetosService,
    private globalService: GlobalService,
    private router: Router,
    private appSnackBar: AppSnackbar
  ) {
    this.globalService.refreshCabec.subscribe((dia) => {
      this.getAgenda();
    });
    this.parametro = formBuilder.group({
      auditores: [{ value: '' }],
      ano: [{ value: '' }],
      mes: [{ value: '' }],
    });
    this.setParametro();
    this.getAuditores();
  }

  ngOnInit(): void {}

  ngOnDestroy(): void {
    this.inscricaoAuditor?.unsubscribe();
    this.inscricaoAgenda?.unsubscribe();
  }

  onSubmit() {
    this.auditor = this.parametro.value.auditores;
    this.celulaDia = new CelulaDia();
    this.showLancamento = true;
    this.globalService.setRefreshLançamentos(this.celulaDia);
    this.getAgenda();
  }
  setParametro() {
    this.parametro.setValue({
      auditores: this.auditor,
      ano: this.hoje.getFullYear(),
      mes: this.hoje.getMonth(),
    });
  }

  getAuditores() {
    const par = new ParametroUsuario01();

    const coorde = this.usuariosService.getGruposCoordenador();

    const audi = this.usuariosService.getGruposAuditor();

    par.id_empresa = this.globalService.id_empresa;

    par.id = this.globalService.getUsuario().id;

    par.orderby = 'Razão';

    this.globalService.setSpin(true);
    this.inscricaoAuditor = this.usuariosService.getusuarios_01(par).subscribe(
      (data: UsuarioQuery01Model[]) => {
        this.globalService.setSpin(false);
        this.auditor = this.globalService.getUsuario().id;
        this.auditores = data;
        this.auditores.forEach((auditor) => {
          auditor.razao = getFirstName(auditor.razao);
        });
        this.parametro.patchValue({ auditores: par.id });
        this.onSubmit();
      },
      (error: any) => {
        this.globalService.setSpin(false);
        this.auditor = 0;
        this.appSnackBar.openFailureSnackBar(
          `Tabela De Usuários: ${messageError(error)}`,
          'OK'
        );
      }
    );
  }

  getAgenda() {
    const par = new ParametroAgeHoras01();

    par.id_empresa = this.globalService.id_empresa;

    par.id_exec = this.auditor;

    par.id_resp = 0;

    par.ano = this.parametro.value.ano;

    par.mes = this.adicionaZero(this.parametro.value.mes + 1);

    console.log('Parametros da Agenda:', this.auditor);

    console.log(par);

    this.globalService.setSpin(true);
    this.inscricaoAgenda = this.projetosService
      .getParametroAgeHorasAgeHoras01(par)
      .subscribe(
        (data: any[]) => {
          this.globalService.setSpin(false);
          this.agendas = [];
          data.forEach((dt) => {
            const age = new AgeHorasModel();
            age.dia = parseInt(dt.dia);
            age.horas_plan = Number(dt.horas_plan);
            age.horas_exec = Number(dt.horas_exec);
            this.agendas.push(age);
          });
          this.loadCalendario();
          if (this.agendas.length == 0) {
            this.appSnackBar.openSuccessSnackBar(
              'Nenhuma Informação Para Esta Consulta!',
              'OK'
            );
          }
        },
        (error: any) => {
          this.globalService.setSpin(false);
          this.agendas = [];
          this.loadCalendario();
          this.appSnackBar.openFailureSnackBar(
            `${error.error.tabela} - ${error.error.erro} - ${error.error.message}`,
            'OK'
          );
        }
      );
  }

  onRetorno() {
    this.router.navigate(['/']);
  }
  loadCalendario() {
    var inicio: Date = new Date(
      this.parametro.value.ano,
      this.parametro.value.mes,
      1,
      0
    );
    var mes: number = inicio.getMonth();
    var controle: number = 0;
    var car: CalendarLine;
    const first: number = inicio.getDay();
    this.calendario = [];
    inicio.setDate(inicio.getDate() - inicio.getDay());
    while (inicio.getDay() < first) {
      const dia: CelulaDia = new CelulaDia();
      dia.dia = inicio.getDate();
      dia.data = new Date(inicio);
      dia.semana = inicio.getDay();
      dia.tipo = 3;
      dia.horasplanejadas = 60;
      dia.horasexecutadas = 70;
      dia.descricao = 'Antes';
      dia.id_resp = 0;
      dia.id_exec = this.auditor;
      dia.id_projeto = 0;
      this.calendario.push(dia);
      inicio.setDate(inicio.getDate() + 1);
    }
    inicio = new Date(this.parametro.value.ano, this.parametro.value.mes, 1, 0);

    while (mes == inicio.getMonth()) {
      const dia: CelulaDia = new CelulaDia();
      dia.dia = inicio.getDate();
      const agenda = this.agendas.find((age) => age.dia === dia.dia);
      dia.data = new Date(inicio);
      dia.semana = inicio.getDay();
      dia.tipo = inicio.getDay() == 0 ? 0 : 1;
      if (agenda == null) {
        dia.horasplanejadas = 0;
        dia.horasexecutadas = 0;
      } else {
        dia.horasplanejadas = agenda.horas_plan;
        dia.horasexecutadas = agenda.horas_exec;
      }
      dia.descricao = 'Dias do mês';
      dia.id_resp = 0;
      dia.id_exec = this.auditor;
      dia.id_projeto = 0;
      this.calendario.push(dia);
      inicio.setDate(inicio.getDate() + 1);
    }

    this.linhas = [];

    car = new CalendarLine();

    controle = 0;

    this.calendario.forEach((obj) => {
      if (controle > 6) {
        this.linhas.push(car);
        controle = 0;
        car = new CalendarLine();
      }
      car.line.push(obj);
      controle++;
    });
    if (controle > 0) {
      while (controle < 7) {
        const dia: CelulaDia = new CelulaDia();
        dia.dia = inicio.getDate();
        dia.data = new Date(inicio);
        dia.semana = inicio.getDay();
        dia.tipo = 3;
        dia.horasplanejadas = 90;
        dia.horasexecutadas = 70;
        dia.descricao = 'Depois';
        dia.id_resp = 0;
        dia.id_exec = this.auditor;
        dia.id_projeto = 0;
        this.calendario.push(dia);
        inicio.setDate(inicio.getDate() + 1);
        car.line.push(dia);
        controle++;
      }
      this.linhas.push(car);
    }
  }

  onDay(evento: CelulaDia) {
    console.log('onDay', evento);
    this.celulaDia = evento;
    this.globalService.setRefreshLançamentos(this.celulaDia);
    this.showLancamento = true;
  }

  adicionaZero(numero: any): string {
    if (numero <= 9) return '0' + numero;
    else return '' + numero;
  }

  onChangeParametros() {
    this.onSubmit();
  }
}
