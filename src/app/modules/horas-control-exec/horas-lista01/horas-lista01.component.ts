import { CdkVirtualScrollViewport } from '@angular/cdk/scrolling';
import { Component, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { Lista01Model } from 'src/app/Models/lista01-model';
import { UsuarioQuery01Model } from 'src/app/Models/usuario-query_01-model';
import { ParametroLista01 } from 'src/app/parametros/parametro-lista01';
import { ParametroUsuario01 } from 'src/app/parametros/parametro-usuario01';
import { GlobalService } from 'src/app/services/global.service';
import { UsuariosService } from 'src/app/services/usuarios.service';
import { AppSnackbar } from 'src/app/shared/classes/app-snackbar';
import { ListaMeses } from 'src/app/shared/classes/lista-meses';
import { messageError } from 'src/app/shared/classes/util';

@Component({
  selector: 'app-horas-lista01',
  templateUrl: './horas-lista01.component.html',
  styleUrls: ['./horas-lista01.component.css'],
})
export class HorasLista01Component implements OnInit {
  @ViewChild(CdkVirtualScrollViewport) viewPort!: CdkVirtualScrollViewport;
  parametro: FormGroup;

  inscricaoCoordenador!: Subscription;
  inscricaoAuditor!: Subscription;
  inscricaoLista!: Subscription;

  coordenador: number = 0;
  coordenadores: UsuarioQuery01Model[] = [];

  auditor: number = 0;
  auditores: UsuarioQuery01Model[] = [];
  anos: number[] = [2022, 2023, 2024];
  meses: ListaMeses = new ListaMeses();
  hoje: Date = new Date();

  listUsuariosExec: Lista01Model[] = [];

  constructor(
    formBuilder: FormBuilder,
    private usuariosService: UsuariosService,
    private globalService: GlobalService,
    private router: Router,
    private appSnackBar: AppSnackbar
  ) {
    this.parametro = formBuilder.group({
      coordenadores: [{ value: '' }],
      auditores: [{ value: '' }],
      ano: [{ value: '' }],
      mes: [{ value: '' }],
    });
    this.getCoordenadores();
    this.getAuditores();
    this.setParametro();
  }

  ngOnInit(): void {}

  ngOnDestroy(): void {
    this.inscricaoAuditor?.unsubscribe();
    this.inscricaoCoordenador?.unsubscribe();
    this.inscricaoLista?.unsubscribe();
  }

  setParametro() {
    this.parametro.setValue({
      coordenadores: this.coordenador,
      auditores: this.auditor,
      ano: this.hoje.getFullYear(),
      mes: this.hoje.getMonth(),
    });
  }

  getCoordenadores() {
    const par = new ParametroUsuario01();

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

    if (
      this.usuariosService.isCoordenador(this.globalService.getUsuario().grupo)
    ) {
      par.id = this.globalService.getUsuario().id;
    }

    this.inscricaoCoordenador = this.usuariosService
      .getusuarios_01(par)
      .subscribe(
        (data: UsuarioQuery01Model[]) => {
          this.globalService.setSpin(false);
          this.coordenador = 0;
          const coord = new UsuarioQuery01Model();
          if (par.id == 0) {
            coord.id = 0;
            coord.razao = 'TODOS';
            this.coordenadores.push(coord);
            data.forEach((coordenador) => {
              this.coordenadores.push(coordenador);
            });
          } else {
            this.coordenador = par.id;
            this.coordenadores = data;
          }
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
  onSubmit() {
    this.coordenador = this.parametro.value.coordenadores;
    this.auditor = this.parametro.value.auditores;
    this.getLista();
  }

  getLista() {
    const par = new ParametroLista01();

    par.id_empresa = this.globalService.id_empresa;

    par.id_exec = this.auditor;

    par.id_resp = this.coordenador;

    par.ano = this.parametro.value.ano;

    par.mes = this.adicionaZero(this.parametro.value.mes + 1);

    this.globalService.setSpin(true);
    this.inscricaoLista = this.usuariosService.UsarioHorasExec(par).subscribe(
      (data: any[]) => {
        this.globalService.setSpin(false);
        this.listUsuariosExec = data;
        console.log(data);
      },
      (error: any) => {
        this.globalService.setSpin(false);
        this.listUsuariosExec = [];
        this.appSnackBar.openFailureSnackBar(`${messageError(error)}`, 'OK');
      }
    );
  }

  onRetorno() {
    this.router.navigate(['/']);
  }

  adicionaZero(numero: any): string {
    if (numero <= 9) return '0' + numero;
    else return '' + numero;
  }
}
