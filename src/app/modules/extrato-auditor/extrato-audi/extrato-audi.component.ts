import { Component, OnInit } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { UsuarioQuery01Model } from 'src/app/Models/usuario-query_01-model';
import { ParametroUsuario01 } from 'src/app/parametros/parametro-usuario01';
import { GlobalService } from 'src/app/services/global.service';
import { UsuariosService } from 'src/app/services/usuarios.service';
import { AppSnackbar } from 'src/app/shared/classes/app-snackbar';

@Component({
  selector: 'app-extrato-audi',
  templateUrl: './extrato-audi.component.html',
  styleUrls: ['./extrato-audi.component.css'],
})
export class ExtratoAudiComponent implements OnInit {
  inscricaoDiretor!: Subscription;
  inscricaoCoordenador!: Subscription;
  inscricaoAuditor!: Subscription;

  diretor: number = 0;
  diretores: UsuarioQuery01Model[] = [];

  coordenador: number = 0;
  coordenadores: UsuarioQuery01Model[] = [];

  auditor: number = 0;
  auditores: UsuarioQuery01Model[] = [];

  constructor(
    formBuilder: FormBuilder,
    private usuariosService: UsuariosService,
    private globalService: GlobalService,
    private router: Router,
    private appSnackBar: AppSnackbar
  ) {}

  ngOnInit(): void {
    this.getDiretores();
    this.getCoordenadores();
    this.getAuditores();
  }

  ngOnDestroy(): void {
    this.inscricaoDiretor?.unsubscribe();
    this.inscricaoAuditor?.unsubscribe();
    this.inscricaoCoordenador?.unsubscribe();
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
        this.diretores = [];
        this.diretores.push(dir);
        data.forEach((diretor) => {
          this.diretores.push(diretor);
        });
      },
      (error: any) => {
        this.globalService.setSpin(false);
        this.diretor = 0;
        this.appSnackBar.openFailureSnackBar(
          `${error.error.tabela} - ${error.error.erro} - ${error.error.message}`,
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
          this.coordenadores = [];
          this.coordenadores.push(coord);
          data.forEach((coordenador) => {
            this.coordenadores.push(coordenador);
          });
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
        this.auditores = [];
        this.auditores.push(audi);
        data.forEach((auditor) => {
          this.auditores.push(auditor);
        });
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

  onChangeAuditor(id_auditor: number) {
    this.auditor = id_auditor;
  }

  onChangeCoordenador(id_coordenador: number) {
    this.coordenador = id_coordenador;
  }

  onChangeDiretor(id_diretor: number) {
    this.diretor = id_diretor;
  }

  onRetorno() {
    this.router.navigate(['/']);
  }
}
