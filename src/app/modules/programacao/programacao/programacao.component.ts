import { ProjetoModel } from 'src/app/Models/projeto-model';
import { ClientesService } from 'src/app/services/clientes.service';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { ClientesQuery01Model } from 'src/app/Models/cliente-query_01-model';
import { UsuarioQuery01Model } from 'src/app/Models/usuario-query_01-model';
import { ParametroCliente01 } from 'src/app/parametros/parametro-cliente-01';
import { ParametroUsuario01 } from 'src/app/parametros/parametro-usuario01';
import { GlobalService } from 'src/app/services/global.service';
import { ProjetosService } from 'src/app/services/projetos.service';
import { UsuariosService } from 'src/app/services/usuarios.service';
import { AppSnackbar } from 'src/app/shared/classes/app-snackbar';
import { ListaMeses } from 'src/app/shared/classes/lista-meses';
import { ParametroProjeto01 } from 'src/app/parametros/parametro-projeto01';
import { ProjetoModule } from '../../projeto/projeto.module';
import { getFirstName } from 'src/app/shared/classes/util';

@Component({
  selector: 'app-programacao',
  templateUrl: './programacao.component.html',
  styleUrls: ['./programacao.component.css'],
})
export class ProgramacaoComponent implements OnInit {
  parametro: FormGroup;

  inscricaoDiretor!: Subscription;
  inscricaoCoordenador!: Subscription;
  inscricaoAuditor!: Subscription;
  inscricaoAgenda!: Subscription;
  inscricaoClientes!: Subscription;
  inscricaoProjetos!: Subscription;
  inscricaoContador!: Subscription;

  diretor: number = 0;
  diretores: UsuarioQuery01Model[] = [];

  coordenador: number = 0;
  coordenadores: UsuarioQuery01Model[] = [];

  auditor: number = 0;
  auditores: UsuarioQuery01Model[] = [];

  anos: number[] = [2022, 2023, 2024];
  meses: ListaMeses = new ListaMeses();
  hoje: Date = new Date();

  lsProjetos: ProjetoModel[] = [];
  displayedColumns: string[] = [
    'resexec',
    'id',
    'razao',
    'descricao',
    'periodo',
    'acao',
  ];

  length = 50;
  pageSize = 10;
  pageIndex = 0;
  pageSizeOptions = [5, 10, 25];

  hidePageSize = false;
  showPageSizeOptions = true;
  showFirstLastButtons = true;
  disabled = false;

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
    this.getProjetosContador();
    this.setParametro();
  }

  ngOnInit(): void {}

  ngOnDestroy(): void {
    this.inscricaoDiretor?.unsubscribe();
    this.inscricaoAuditor?.unsubscribe();
    this.inscricaoCoordenador?.unsubscribe();
    this.inscricaoAgenda?.unsubscribe();
    this.inscricaoProjetos?.unsubscribe();
    this.inscricaoContador?.unsubscribe();
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

    this.inscricaoDiretor = this.usuariosService.getusuarios_01(par).subscribe(
      (data: UsuarioQuery01Model[]) => {
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
          this.parametro.patchValue({ diretores: this.diretor });
        }
      },
      (error: any) => {
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

    this.inscricaoCoordenador = this.usuariosService
      .getusuarios_01(par)
      .subscribe(
        (data: UsuarioQuery01Model[]) => {
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

    par.orderby = 'Razão';

    console.log('Coordenadores:', par);
    this.inscricaoAuditor = this.usuariosService.getusuarios_01(par).subscribe(
      (data: UsuarioQuery01Model[]) => {
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
        this.auditor = 0;
        this.appSnackBar.openFailureSnackBar(
          `${error.error.tabela} - ${error.error.erro} - ${error.error.message}`,
          'OK'
        );
      }
    );
  }

  getProjetos() {
    let par = new ParametroProjeto01();

    par.id_empresa = 1;
    par.contador = 'N';
    par.pagina = this.pageIndex + 1;
    par.tamPagina = this.pageSize;

    this.globalService.setSpin(true);
    this.inscricaoProjetos = this.projetosService.getProjetos_01(par).subscribe(
      (data: ProjetoModel[]) => {
        this.globalService.setSpin(false);
        this.lsProjetos = data;
      },
      (error: any) => {
        this.globalService.setSpin(false);
        if (error.error.message == 'Nehuma Informação Para Esta Consulta.') {
          this.lsProjetos = [];
          this.appSnackBar.openSuccessSnackBar(
            'Nenhuma Informação Encontrada Para Esta Consulta!',
            'OK'
          );
        } else {
          this.lsProjetos = [];
          this.appSnackBar.openFailureSnackBar(
            `Pesquisa Nos Projetos ${error.error.tabela} - ${error.error.erro} - ${error.error.message}`,
            'OK'
          );
        }
      }
    );
  }

  getProjetosContador() {
    let par = new ParametroProjeto01();

    par.id_empresa = 1;

    par.contador = 'S';

    this.inscricaoProjetos = this.projetosService.getProjetos_01(par).subscribe(
      (data: any) => {
        this.globalService.setSpin(false);
        this.length = data.total;
        this.getProjetos();
      },
      (error: any) => {
        this.globalService.setSpin(false);
        this.appSnackBar.openWarningnackBar('Nehum Projeto Encontrado!', 'OK');
      }
    );
  }

  handlePageEvent(event: any) {
    console.log();
    this.pageIndex = event.pageIndex;
    this.pageSize = event.pageSize;
    this.getProjetos();
  }

  htmlFirstName(nome: string): string {
    return getFirstName(nome);
  }

  setStyle() {
    let styles = {
      'background-color': 'blue',
    };
    return styles;
  }
}
