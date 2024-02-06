import { Component, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { ProjetoModel } from 'src/app/Models/projeto-model';
import { UsuarioQuery01Model } from 'src/app/Models/usuario-query_01-model';
import { ParametroProjeto01 } from 'src/app/parametros/parametro-projeto01';
import { ParametroUsuario01 } from 'src/app/parametros/parametro-usuario01';
import { GlobalService } from 'src/app/services/global.service';
import { ProjetosService } from 'src/app/services/projetos.service';
import { UsuariosService } from 'src/app/services/usuarios.service';
import { AppSnackbar } from 'src/app/shared/classes/app-snackbar';
import { ControlePaginas } from 'src/app/shared/classes/controle-paginas';
import {
  SituacaoProjeto,
  getSituacoesProjeto,
  messageError,
} from 'src/app/shared/classes/util';

@Component({
  selector: 'app-visaoa',
  templateUrl: './visaoa.component.html',
  styleUrls: ['./visaoa.component.css'],
})
export class VisaoaComponent implements OnInit {
  inscricaoDiretor!: Subscription;
  inscricaoProjetos!: Subscription;
  inscricaoProjetosCt!: Subscription;

  diretor: number = 0;
  diretores: UsuarioQuery01Model[] = [];
  situacao: string = '';
  situacoes: SituacaoProjeto[] = getSituacoesProjeto();

  projetos: ProjetoModel[] = [];

  controlePaginas: ControlePaginas = new ControlePaginas(50, 1);

  tamPagina: number = 50;

  constructor(
    private globalService: GlobalService,
    private usuariosService: UsuariosService,
    private projetosServices: ProjetosService,
    private appSnackBar: AppSnackbar
  ) {
    this.getDiretores();
  }

  ngOnInit(): void {
    this.getProjetosContador();
    this.getProjetos();
  }

  ngOnDestroy(): void {
    this.inscricaoDiretor?.unsubscribe();
    this.inscricaoProjetos?.unsubscribe();
    this.inscricaoProjetosCt?.unsubscribe();
  }

  onChangeDiretor(event: number) {
    this.diretor = event;
    this.onAtualizar();
  }

  onChangeSituacao(event: number) {
    this.situacao = event.toString();
    this.onAtualizar();
  }

  onAtualizar() {
    this.getProjetosContador();
  }

  onChangePage() {
    this.getProjetos();
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

  getProjetosContador() {
    let par = new ParametroProjeto01();

    par.id_empresa = 1;

    if (this.situacao != '-1') {
      par.status = this.situacao.toString();
    }

    par.id_diretor = this.diretor;

    par.orderby = '';

    par.contador = 'S';
    this.globalService.setSpin(true);
    this.inscricaoProjetosCt = this.projetosServices
      .getProjetos_01(par)
      .subscribe(
        (data: any) => {
          this.globalService.setSpin(false);
          this.controlePaginas = new ControlePaginas(
            this.tamPagina,
            data.total == 0 ? 1 : data.total
          );
          this.getProjetos();
        },
        (error: any) => {
          this.globalService.setSpin(false);
          if (error.error.message == 'Nehuma Informação Para Esta Consulta.') {
            this.controlePaginas = new ControlePaginas(this.tamPagina, 0);
            this.appSnackBar.openSuccessSnackBar(
              'Nenhuma Informação Encontrada Para Esta Consulta!',
              'OK'
            );
          } else {
            this.controlePaginas = new ControlePaginas(this.tamPagina, 0);
            this.appSnackBar.openFailureSnackBar(
              `Pesquisa Nos Projetos ${error.error.tabela} - ${error.error.erro} - ${error.error.message}`,
              'OK'
            );
          }
        }
      );
  }

  getProjetos() {
    let par = new ParametroProjeto01();

    par.id_empresa = 1;

    if (this.situacao != '-1') {
      par.status = this.situacao.toString();
    }

    par.id_diretor = this.diretor;

    par.orderby = 'Descrição';

    par.pagina = this.controlePaginas.getPaginalAtual();
    this.globalService.setSpin(true);
    this.inscricaoProjetos = this.projetosServices
      .getProjetos_01(par)
      .subscribe(
        (data: ProjetoModel[]) => {
          this.globalService.setSpin(false);
          this.projetos = data;
        },
        (error: any) => {
          this.globalService.setSpin(false);
          if (error.error.message == 'Nehuma Informação Para Esta Consulta.') {
            this.projetos = [];
            this.appSnackBar.openSuccessSnackBar(
              'Nenhuma Informação Encontrada Para Esta Consulta!',
              'OK'
            );
          } else {
            this.projetos = [];
            this.appSnackBar.openFailureSnackBar(
              `Pesquisa Nos Projetos ${messageError(error)}`,
              'OK'
            );
          }
        }
      );
  }
}
