import { AppSnackbar } from 'src/app/shared/classes/app-snackbar';
import { AgeHorasModel } from '../../../Models/age-horas-model';
import { GlobalService } from 'src/app/services/global.service';
import { UsuarioQuery01Model } from './../../../Models/usuario-query_01-model';
import { UsuariosService } from 'src/app/services/usuarios.service';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { Subscription } from 'rxjs';
import { CalendarLine } from 'src/app/shared/classes/calendar-line';
import { CelulaDia } from 'src/app/shared/classes/celula-dia';
import { ListaMeses } from 'src/app/shared/classes/lista-meses';
import { Router } from '@angular/router';
import { ParametroUsuario01 } from 'src/app/parametros/parametro-usuario01';
import { ProjetosService } from 'src/app/services/projetos.service';
import { ParametroAgeHoras01 } from 'src/app/parametros/parametro-age-horas-01';
import { messageError } from 'src/app/shared/classes/util';

@Component({
  selector: 'app-agenda-view',
  templateUrl: './agenda-view.component.html',
  styleUrls: ['./agenda-view.component.css'],
})
export class AgendaViewComponent implements OnInit {
  parametro: FormGroup;
  inscricaoDiretor!: Subscription;
  inscricaoCoordenador!: Subscription;
  inscricaoAuditor!: Subscription;
  inscricaoAgenda!: Subscription;

  diretor: number = 0;
  diretores: UsuarioQuery01Model[] = [];

  coordenador: number = 0;
  coordenadores: UsuarioQuery01Model[] = [];

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
    this.parametro = formBuilder.group({
      diretores: [{ value: '' }],
      coordenadores: [{ value: '' }],
      auditores: [{ value: '' }],
      ano: [{ value: '' }],
      mes: [{ value: '' }],
    });
    this.getDiretores();
    this.getCoordenadores();
    this.getAuditores();
    this.setParametro();
  }

  ngOnInit(): void {}

  ngOnDestroy(): void {
    this.inscricaoDiretor?.unsubscribe();
    this.inscricaoAuditor?.unsubscribe();
    this.inscricaoCoordenador?.unsubscribe();
    this.inscricaoAgenda?.unsubscribe();
  }

  onSubmit() {
    console.log(this.diretores);
    this.diretor = this.parametro.value.diretores;
    this.coordenador = this.parametro.value.coordenadores;
    this.auditor = this.parametro.value.auditores;
    console.log(
      this.parametro.value.diretores,
      this.parametro.value.coordenadores,
      this.parametro.value.auditores
    );
    console.log(this.diretor, this.coordenador, this.auditor);
    this.celulaDia = new CelulaDia();
    this.showLancamento = true;
    this.globalService.setRefreshLançamentos(this.celulaDia);
    this.getAgenda();
  }

  setParametro() {
    this.parametro.setValue({
      diretores: this.diretor,
      coordenadores: this.coordenador,
      auditores: this.auditor,
      ano: this.hoje.getFullYear(),
      mes: this.hoje.getMonth(),
    });
  }

  getDiretores() {
    const par = new ParametroUsuario01();

    par.id_empresa = this.globalService.id_empresa;

    par.grupo = this.usuariosService.getGruposDiretoria();

    par.orderby = 'Razão';
    this.globalService.setSpin(true);
    this.inscricaoDiretor = this.usuariosService.getusuarios_01(par).subscribe(
      (data: UsuarioQuery01Model[]) => {
        this.globalService.setSpin(false);
        this.diretor = 0;
        const dir = new UsuarioQuery01Model();
        dir.id = 0;
        dir.razao = 'TODOS';
        this.diretores.push(dir);
        data.forEach((diretor) => {
          this.diretores.push(diretor);
        });
        if (
          this.usuariosService.isDiretoria(
            this.globalService.getUsuario().grupo
          )
        ) {
          this.parametro.patchValue({
            diretores: this.globalService.getUsuario().id,
          });
        } else {
          this.parametro.patchValue({ diretores: 0 });
        }
      },
      (error: any) => {
        this.globalService.setSpin(false);
        this.diretor = 0;
        this.appSnackBar.openFailureSnackBar(
          `Falha Ao Carregar Tabela Diretores ${messageError(error)}`,
          'OK'
        );
      }
    );
  }

  getCoordenadores() {
    const par = new ParametroUsuario01();

    par.id_empresa = this.globalService.id_empresa;

    par.grupo = this.usuariosService.getGruposCoordenador();

    par.orderby = 'Razão';
    this.globalService.setSpin(true);
    this.inscricaoCoordenador = this.usuariosService
      .getusuarios_01(par)
      .subscribe(
        (data: UsuarioQuery01Model[]) => {
          this.globalService.setSpin(false);
          this.coordenador = 0;
          const coord = new UsuarioQuery01Model();
          coord.id = 0;
          coord.razao = 'TODOS';
          this.coordenadores.push(coord);
          data.forEach((coordenador) => {
            this.coordenadores.push(coordenador);
          });
          this.parametro.patchValue({ coordenadores: this.coordenador });
        },
        (error: any) => {
          this.globalService.setSpin(false);
          this.coordenador = 0;
          this.appSnackBar.openFailureSnackBar(
            `${error.error.tabela} - ${error.error.erro} - ${error.error.message}`,
            'OK'
          );
        }
      );
  }

  getAuditores() {
    const par = new ParametroUsuario01();

    const coorde = this.usuariosService.getGruposCoordenador();

    const audi = this.usuariosService.getGruposAuditor();

    par.id_empresa = this.globalService.id_empresa;

    coorde.forEach((value) => {
      par.grupo.push(value);
    });

    audi.forEach((value) => {
      par.grupo.push(value);
    });
    this.globalService.setSpin(true);
    this.inscricaoAuditor = this.usuariosService.getusuarios_01(par).subscribe(
      (data: UsuarioQuery01Model[]) => {
        this.globalService.setSpin(false);
        this.auditor = 0;
        const audi = new UsuarioQuery01Model();
        audi.id = 0;
        audi.razao = 'TODOS';
        this.auditores.push(audi);
        data.forEach((auditor) => {
          this.auditores.push(auditor);
        });
        this.parametro.patchValue({ auditores: this.auditor });
      },
      (error: any) => {
        this.globalService.setSpin(false);
        this.auditor = 0;
        this.appSnackBar.openFailureSnackBar(
          `${error.error.tabela} - ${error.error.erro} - ${error.error.message}`,
          'OK'
        );
      }
    );
  }

  getAgenda() {
    const par = new ParametroAgeHoras01();

    par.id_empresa = this.globalService.id_empresa;

    par.id_exec = this.auditor;

    par.id_resp = this.coordenador;

    par.id_dir = this.diretor;

    par.ano = this.parametro.value.ano;

    par.mes = this.adicionaZero(this.parametro.value.mes + 1);

    console.log('ParametroAgeHoras01 ==>', par);
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
      dia.id_resp = this.coordenador;
      dia.id_exec = this.auditor;
      dia.id_diretor = this.diretor;
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
      dia.id_resp = this.coordenador;
      dia.id_exec = this.auditor;
      dia.id_diretor = this.diretor;
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
        dia.id_resp = this.coordenador;
        dia.id_exec = this.auditor;
        dia.id_diretor = this.diretor;
        dia.id_projeto = 0;
        this.calendario.push(dia);
        inicio.setDate(inicio.getDate() + 1);
        car.line.push(dia);
        controle++;
      }
      this.linhas.push(car);
    }

    console.log('Linha:', this.linhas);
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
}
