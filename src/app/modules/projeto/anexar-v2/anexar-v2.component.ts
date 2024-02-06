import { DisplayAtividade } from './../manut-atividade-lote/manut-atividade-lote.component';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { ActivatedRoute, Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { AtividadeModel } from 'src/app/Models/atividade-model';
import { AtividadeQuery_01Model } from 'src/app/Models/atividade-query_01-model';
import { ClientesQuery01Model } from 'src/app/Models/cliente-query_01-model';
import { EstruturaModel } from 'src/app/Models/estrutura-model';
import { ProjetoModel } from 'src/app/Models/projeto-model';
import { UsuarioQuery01Model } from 'src/app/Models/usuario-query_01-model';
import { AtividadesService } from 'src/app/services/atividades.service';
import { ClientesService } from 'src/app/services/clientes.service';
import { EstruturasService } from 'src/app/services/estruturas.service';
import { GlobalService } from 'src/app/services/global.service';
import { ProjetosService } from 'src/app/services/projetos.service';
import { UsuariosService } from 'src/app/services/usuarios.service';
import { AppSnackbar } from 'src/app/shared/classes/app-snackbar';
import { CadastroAcoes } from 'src/app/shared/classes/cadastro-acoes';
import { FiltroOperacionalSubconta } from 'src/app/shared/classes/filtro-operacional-subconta';
import { ParametroAtividade01 } from 'src/app/parametros/parametro-atividade01';
import { ParametroUsuario01 } from 'src/app/parametros/parametro-usuario01';
import { DisplayAtividadeV2 } from 'src/app/shared/classes/DisplayAtividadeV2';
import { LastRecursivo } from 'src/app/shared/classes/last-recursivo';
import { ParametroAtividade02 } from 'src/app/parametros/parametro-atividade02';

@Component({
  selector: 'app-anexar-v2',
  templateUrl: './anexar-v2.component.html',
  styleUrls: ['./anexar-v2.component.css'],
})
export class AnexarV2Component implements OnInit {
  displayAtividades: DisplayAtividadeV2[] = [];

  projeto: ProjetoModel = new ProjetoModel();

  inscricaoGetFiltro!: Subscription;
  inscricaoRota!: Subscription;
  inscricaoSave!: Subscription;
  inscricaoUsuario!: Subscription;

  conta: string = '';

  conta_versao: string = '';

  id_projeto: number = 0;

  id_resp: number = 0;

  id_exec: number = 0;

  atividades: AtividadeQuery_01Model[] = [];

  durationInSeconds = 2;

  filtro: FiltroOperacionalSubconta = new FiltroOperacionalSubconta();

  usuarios: UsuarioQuery01Model[] = [];

  constructor(
    private globalService: GlobalService,
    private atividadesService: AtividadesService,
    private usuariosService: UsuariosService,
    private route: ActivatedRoute,
    private router: Router,
    private appSnackBar: AppSnackbar
  ) {
    this.inscricaoRota = route.params.subscribe((params: any) => {
      this.conta = params.conta;
      this.conta_versao = params.conta_versao;
      this.id_projeto = params.id_projeto;
      this.id_resp = params.id_resp;
      this.id_exec = params.id_exec;
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
    let par = new ParametroAtividade02();

    par.id_empresa = this.globalService.id_empresa;

    par.id_projeto = this.id_projeto;

    par.conta = this.conta;

    par.versao = this.conta_versao;

    par.id_resp = this.id_resp;

    par.id_exec = this.id_exec;

    if (this.globalService.getUsuario().id == 16) par.controle = '';

    this.globalService.setSpin(true);
    this.inscricaoGetFiltro = this.atividadesService
      .getAtividades_02(par)
      .subscribe(
        (data: AtividadeQuery_01Model[]) => {
          this.globalService.setSpin(false);
          this.loadDisplayItens(data);
          this.displayAtividades[0].expandido = true;
          this.expandeContrair(this.displayAtividades[0]);
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
            console.log(error);
            this.appSnackBar.openFailureSnackBar(`${error}`, 'OK');
          }
        }
      );
  }

  getUsuarios() {
    let par = new ParametroUsuario01();

    par.id_empresa = this.globalService.id_empresa;

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
    this.router.navigate([
      'projetos/anexaratividade',
      this.globalService.getIdEmpresa(),
      this.id_projeto,
      'NULL',
    ]);
  }

  setAllItens(value: boolean, atividade: AtividadeQuery_01Model): void {
    let novoStatus: boolean;

    this.displayAtividades.forEach((obj) => {
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
    novoStatus = this.setStatusRecursivo(
      1,
      this.displayAtividades[0].atividade.conta
    ).status;
    if (this.displayAtividades[0].vazia) {
      this.displayAtividades[0].checked = novoStatus;
    }
  }

  setStyle(atividade: AtividadeQuery_01Model) {
    let margem = { 'margin-left': '5px' };
    switch (atividade.nivel) {
      case 1:
        margem = { 'margin-left': '5px' };
        break;
      case 2:
        margem = { 'margin-left': '0px' };
        break;
      case 3:
        margem = { 'margin-left': '62px' };
        break;
      default:
        margem = { 'margin-left': '5px' };
        break;
    }
    return margem;
  }

  loadDisplayItens(data: AtividadeQuery_01Model[]): void {
    this.displayAtividades = [];
    data.forEach((obj) => {
      const disp: DisplayAtividadeV2 = new DisplayAtividadeV2();
      disp.checked = obj.vazia == 'N' ? true : false;
      disp.show = true;
      disp.expandido = false;
      disp.vazia = obj.vazia == 'S' ? true : false;
      disp.atividade = obj;
      this.displayAtividades.push(disp);
    });
  }

  getVisiblesAtividades(): DisplayAtividadeV2[] {
    return this.displayAtividades.filter((disp) =>
      disp.atividade.nivel == 1 ? true : disp.show
    );
  }

  expandeContrair(atividade: DisplayAtividadeV2) {
    atividade.expandido = !atividade.expandido;
    this.displayAtividades.forEach((obj) => {
      if (
        (atividade.atividade.nivel == 1 &&
          obj.atividade.subconta.substring(0, 2) ==
            atividade.atividade.subconta.substring(0, 2)) ||
        (obj.atividade.conta == atividade.atividade.conta &&
          obj.atividade.subconta.trim() == atividade.atividade.subconta.trim())
      ) {
        obj.expandido = atividade.expandido;
        this.setSubConta(
          obj.atividade.subconta.trim(),
          obj.expandido,
          obj.atividade.nivel
        );
      }
    });
  }

  setSubConta(subconta: string, value: boolean, nivel: number) {
    this.displayAtividades.forEach((obj) => {
      if (
        obj.atividade.nivel > nivel &&
        obj.atividade.subconta.trim().substring(0, nivel * 2) == subconta
      ) {
        if (obj.atividade.tipo == 'O') {
          obj.show = value;
        }
        obj.expandido = value;
      }
    });
  }

  setStatusRecursivo(idx: number, subconta: string): LastRecursivo {
    let retorno: LastRecursivo = new LastRecursivo();
    let ct: number = 0;
    for (let x: number = idx; x < this.displayAtividades.length; x++) {
      if (
        this.displayAtividades[x].atividade.tipo == 'C' ||
        this.displayAtividades[x].atividade.tipo == 'S'
      ) {
        let ret = this.setStatusRecursivo(
          x + 1,
          this.displayAtividades[x].atividade.subconta
        );
        this.displayAtividades[x].checked = ret.status;
        x = ret.last;
        if (ret.status) {
          retorno.status = true;
        }
        continue;
      }
      retorno.last = x;
      if (this.displayAtividades[x].checked) {
        retorno.status = true;
      }
      if (
        x < this.displayAtividades.length - 1 &&
        this.displayAtividades[x + 1].atividade.tipo != 'O'
      ) {
        return retorno;
      }
    }
    return retorno;
  }

  onSave() {
    this.displayAtividades.forEach((disp) => {
      disp.atividade.id_resp = this.id_resp;
      disp.atividade.id_exec = this.id_exec;
    });
    this.globalService.setSpin(true);
    this.inscricaoSave = this.atividadesService
      .anexaatividadev2(this.displayAtividades)
      .subscribe(
        (data: any) => {
          this.globalService.setSpin(false);
          this.appSnackBar.openSuccessSnackBar(data.message, 'OK');
          this.onRetorno();
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
            this.appSnackBar.openFailureSnackBar(`${error}`, 'OK');
          }
        }
      );
  }
}
