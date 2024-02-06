import { UsuariosService } from './../../../services/usuarios.service';
import { ProjetoModel } from 'src/app/Models/projeto-model';
import {
  ChangeDetectionStrategy,
  Component,
  OnInit,
  ViewEncapsulation,
} from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { Subscription } from 'rxjs';
import { AtividadeQuery_01Model } from 'src/app/Models/atividade-query_01-model';
import { GlobalService } from 'src/app/services/global.service';
import { AtividadesService } from 'src/app/services/atividades.service';
import { ActivatedRoute, Router } from '@angular/router';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ParametroAtividade01 } from 'src/app/parametros/parametro-atividade01';
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';
import { ParametroUsuario01 } from 'src/app/parametros/parametro-usuario01';
import { UsuarioQuery01Model } from 'src/app/Models/usuario-query_01-model';
import { RespExecDialogComponent } from 'src/app/shared/components/resp-exec-dialog/resp-exec-dialog.component';
import { PeriodoDialogComponent } from 'src/app/shared/components/periodo-dialog/periodo-dialog.component';
import { FiltroOperacionalSubconta } from 'src/app/shared/classes/filtro-operacional-subconta';
import { AppSnackbar } from 'src/app/shared/classes/app-snackbar';

export class DisplayAtividade {
  public checked: boolean = false;
  public atividade: AtividadeQuery_01Model = new AtividadeQuery_01Model();
}
@Component({
  selector: 'app-manut-atividade-lote',
  templateUrl: './manut-atividade-lote.component.html',
  styleUrls: ['./manut-atividade-lote.component.css'],
})
export class ManutAtividadeLoteComponent implements OnInit {
  displayAtividades: DisplayAtividade[] = [];

  projeto: ProjetoModel = new ProjetoModel();

  inscricaoGetFiltro!: Subscription;
  inscricaoRota!: Subscription;
  inscricaoSave!: Subscription;
  inscricaoUsuario!: Subscription;

  id_empresa: number = 0;

  conta: string = '';

  id_projeto: number = 0;

  atividades: AtividadeQuery_01Model[] = [];

  durationInSeconds = 2;

  filtro: FiltroOperacionalSubconta = new FiltroOperacionalSubconta();

  usuarios: UsuarioQuery01Model[] = [];

  constructor(
    private respExecDialog: MatDialog,
    private periodoDialog: MatDialog,
    private globalService: GlobalService,
    private atividadesService: AtividadesService,
    private usuariosService: UsuariosService,
    private route: ActivatedRoute,
    private router: Router,
    private appSnackBar: AppSnackbar
  ) {
    this.inscricaoRota = route.params.subscribe((params: any) => {
      this.id_empresa = params.id_empresa;
      this.conta = params.conta;
      this.id_projeto = params.id_projeto;
    });
  }

  ngOnInit() {
    this.getAtividades();
    this.getUsuarios();
  }

  ngOnDestroy(): void {
    this.inscricaoGetFiltro?.unsubscribe();
    this.inscricaoRota?.unsubscribe();
    this.inscricaoSave?.unsubscribe();
    this.inscricaoUsuario?.unsubscribe();
  }

  getAtividades() {
    let par = new ParametroAtividade01();

    par.id_empresa = this.id_empresa;

    par.id_projeto = this.id_projeto;

    par.conta = this.conta;

    par.orderby = 'projeto';

    this.globalService.setSpin(true);
    this.inscricaoGetFiltro = this.atividadesService
      .getAtividades_01(par)
      .subscribe(
        (data: AtividadeQuery_01Model[]) => {
          this.globalService.setSpin(false);
          this.atividades = data;
          this.loadDisplayItens();
        },
        (error: any) => {
          this.globalService.setSpin(false);
          this.atividades = [];
          if (error.error.message == 'Nehuma Informação Para Esta Consulta.') {
            this.appSnackBar.openSuccessSnackBar(
              'Nenhuma Atividade Encontrada Para Este Projeto!',
              'OK'
            );
          } else {
            this.appSnackBar.openFailureSnackBar(
              `${error.error.tabela} - ${error.error.erro} - ${error.error.message}`,
              'OK'
            );
          }
        }
      );
  }

  getUsuarios() {
    let par = new ParametroUsuario01();

    par.id_empresa = this.id_empresa;

    par.orderby = 'Razão';

    this.globalService.setSpin(true);
    this.inscricaoUsuario = this.usuariosService.getusuarios_01(par).subscribe(
      (data: UsuarioQuery01Model[]) => {
        this.globalService.setSpin(false);
        const semUsuario: UsuarioQuery01Model = new UsuarioQuery01Model();
        semUsuario.id = 0;
        semUsuario.razao = 'Não Especificar.';
        this.usuarios = [];
        this.usuarios.push(semUsuario);
        data.forEach((obj) => this.usuarios.push(obj));
      },
      (error: any) => {
        this.globalService.setSpin(false);
        this.usuarios = [];
        this.appSnackBar.openFailureSnackBar(
          `${error.error.tabela} - ${error.error.erro} - ${error.error.message}`,
          'OK'
        );
      }
    );
  }

  onRetorno(): void {
    this.router.navigate(['/projetos']);
  }

  setAllItens(value: boolean, atividade: AtividadeQuery_01Model): void {
    this.displayAtividades.forEach((obj) => {
      console.log(
        atividade.subconta.substring(0, atividade.nivel * 2),
        obj.atividade.subconta.substring(0, atividade.nivel * 2),
        atividade.subconta.substring(0, atividade.nivel * 2) ==
          obj.atividade.subconta.substring(0, atividade.nivel * 2),
        atividade.nivel,
        obj.atividade.nivel
      );
      if (
        atividade.subconta.substring(0, atividade.nivel * 2) ==
          obj.atividade.subconta.substring(0, atividade.nivel * 2) &&
        obj.atividade.nivel >= atividade.nivel
      ) {
        if (atividade.tipo == 'O') {
          obj.checked = !obj.checked;
        } else {
          obj.checked = value;
        }
      }
    });
  }

  loadDisplayItens(): void {
    this.displayAtividades = [];
    this.atividades.forEach((obj) => {
      if (this.getFiltro(obj)) {
        const disp: DisplayAtividade = new DisplayAtividade();
        disp.checked = false;
        disp.atividade = obj;
        this.displayAtividades.push(disp);
      }
    });
  }

  onFiltro(conta: string, nivel: number): void {
    this.SetFiltroSubConta(conta, nivel);

    this.loadDisplayItens();
  }
  SetFiltroSubConta(conta: string, nivel: number) {
    if (this.filtro.subconta == conta) {
      this.filtro.subconta = '';
      this.filtro.nivel = 0;
    } else {
      this.filtro.subconta = conta;
      this.filtro.nivel = nivel;
    }
    console.log('Filtro Conta:', this.filtro.subconta, this.filtro.nivel);
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

  onResponsavel() {
    this.openRespExecDialog('Responsável', 'Defina O Responsável');
  }

  onExecutor() {
    this.openRespExecDialog('Executor', 'Defina O Executor');
  }

  openRespExecDialog(titulo: string, texto: string) {
    /*
    const data: RespExecData = new RespExecData();
    data.usuarios = this.usuarios;
    data.titulo = titulo;
    data.texto = texto;
    data.id_usuario = 0;
    const dialogConfig = new MatDialogConfig();

    dialogConfig.disableClose = true;
    dialogConfig.id = 'modal-resp-exec';
    dialogConfig.width = '600px';
    dialogConfig.data = data;
    const modalDialog = this.respExecDialog
      .open(RespExecDialogComponent, dialogConfig)
      .beforeClosed()
      .subscribe((data: RespExecData) => {
        console.log('data', data);
        if (data.processar) {
          alert('Pode Processar');
        }
      });
      */
  }

  onPeriodo() {
    this.openPeriodoDialog();
  }

  openPeriodoDialog() {
    /*
    const data: PeriodoData = new PeriodoData();
    data.texto = 'Defino Novo Periodo';

    const dialogConfig = new MatDialogConfig();

    dialogConfig.disableClose = true;
    dialogConfig.id = 'modal-periodo';
    dialogConfig.width = '600px';
    dialogConfig.data = data;
    const modalDialog = this.respExecDialog
      .open(PeriodoDialogComponent, dialogConfig)
      .beforeClosed()
      .subscribe((data: PeriodoData) => {
        console.log('data', data);
        if (data.processar) {
          alert('Pode Processar');
        }
      });
      */
  }
}
