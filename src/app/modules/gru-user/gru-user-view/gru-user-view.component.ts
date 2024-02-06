import { GlobalService } from './../../../services/global.service';
import { GrupoUserService } from 'src/app/services/grupo-user.service';
import { GruUserModel } from './../../../Models/gru-user-model';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { CadastroAcoes } from 'src/app/shared/classes/cadastro-acoes';
import { Subscription } from 'rxjs';
import { ActivatedRoute, Router } from '@angular/router';
import { ValidatorStringLen } from 'src/app/shared/Validators/validator-string-len';
import { AppSnackbar } from 'src/app/shared/classes/app-snackbar';

@Component({
  selector: 'app-gru-user-view',
  templateUrl: './gru-user-view.component.html',
  styleUrls: ['./gru-user-view.component.css'],
})
export class GruUserViewComponent implements OnInit {
  formulario: FormGroup;

  grupo: GruUserModel = new GruUserModel();

  erro: any;

  acao: string = 'Sem Definição';

  idAcao: number = CadastroAcoes.Inclusao;

  readOnly: boolean = true;

  inscricaoGetGrupo!: Subscription;
  inscricaoRota!: Subscription;
  inscricaoAcao!: Subscription;

  durationInSeconds = 2;

  labelCadastro: string = 'Agenda Do Auditor';

  constructor(
    private formBuilder: FormBuilder,
    private grupoEconomicoService: GrupoUserService,
    private globalService: GlobalService,
    private route: ActivatedRoute,
    private router: Router,
    private appSnackBar: AppSnackbar
  ) {
    this.formulario = formBuilder.group({
      id: [{ value: '', disabled: true }],
      grupo: [{ value: '' }, [ValidatorStringLen(3, 20, true)]],
    });
    this.grupo = new GruUserModel();
    this.inscricaoRota = route.params.subscribe((params: any) => {
      this.grupo.id_empresa = params.id_empresa;
      this.grupo.id = params.id;
      this.idAcao = params.acao;
      this.setAcao(params.acao);
    });
  }

  ngOnInit(): void {
    if (this.idAcao == CadastroAcoes.Inclusao) {
      this.grupo = new GruUserModel();
      this.grupo.id_empresa = 1;
    } else {
      this.getGrupo();
    }

    this.setValue();
  }

  ngOnDestroy(): void {
    this.inscricaoGetGrupo?.unsubscribe();
    this.inscricaoRota?.unsubscribe();
    this.inscricaoAcao?.unsubscribe();
  }

  onSubmit() {
    if (this.formulario.valid) {
      this.executaAcao();
    } else {
      this.appSnackBar.openFailureSnackBar(
        `Formulário Com Campos Inválidos.`,
        'OK'
      );
    }
  }

  setValue() {
    this.formulario.setValue({
      id: this.grupo.id,
      grupo: this.grupo.grupo,
    });
  }

  getLabelCancel() {
    if (this.idAcao == CadastroAcoes.Consulta) {
      return 'Voltar';
    } else {
      return 'Cancelar';
    }
  }

  onRetorno() {
    const par = this.globalService.estadoFind('grupo-user');
    if (par != null) {
      let config = par.getParametro();
      Object(config).new = this.idAcao == CadastroAcoes.Inclusao ? true : false;
      Object(config).id_retorno = this.grupo.id;
      par.parametro = JSON.stringify(config);
      this.globalService.estadoSave(par);
    }
    this.router.navigate(['/users/users', 'SIM']);
  }

  onCancel() {
    const par = this.globalService.estadoFind('grupo-user');
    if (par != null) {
      let config = par.getParametro();
      Object(config).new = false;
      Object(config).id_retorno =
        this.idAcao == CadastroAcoes.Consulta ? this.grupo.id : 0;
      par.parametro = JSON.stringify(config);
      this.globalService.estadoSave(par);
    }
    this.router.navigate(['/users/users', 'SIM']);
  }

  getGrupo() {
    this.globalService.setSpin(true);
    this.inscricaoGetGrupo = this.grupoEconomicoService
      .getGrupoUser(this.grupo.id_empresa, this.grupo.id)
      .subscribe(
        (data: GruUserModel) => {
          this.globalService.setSpin(false);
          this.grupo = data;
          this.setValue();
        },
        (error: any) => {
          this.globalService.setSpin(false);
          this.appSnackBar.openFailureSnackBar(
            `Pesquisa Nos Grupos De Usuários ${error.error.tabela} - ${error.error.erro} - ${error.error.message}`,
            'OK'
          );
        }
      );
  }

  setAcao(op: number) {
    switch (+op) {
      case CadastroAcoes.Inclusao:
        this.acao = 'Gravar';
        this.labelCadastro = 'Grupos De Usuários - Inclusão.';
        this.readOnly = false;
        break;
      case CadastroAcoes.Edicao:
        this.acao = 'Gravar';
        this.labelCadastro = 'Grupos De Usuários - Alteração.';
        this.readOnly = false;
        break;
      case CadastroAcoes.Consulta:
        this.acao = 'Voltar';
        this.labelCadastro = 'Grupos De Usuários - Consulta.';
        this.readOnly = true;
        break;
      case CadastroAcoes.Exclusao:
        this.acao = 'Excluir';
        this.labelCadastro = 'Grupos De Usuários - Exclusão.';
        this.readOnly = true;
        break;
      default:
        break;
    }
  }

  executaAcao() {
    this.grupo.grupo = this.formulario.value.grupo;
    switch (+this.idAcao) {
      case CadastroAcoes.Inclusao:
        this.globalService.setSpin(false);
        this.grupo.user_insert = this.globalService.getUsuario().id;
        this.inscricaoAcao = this.grupoEconomicoService
          .GrupoUserInsert(this.grupo)
          .subscribe(
            async (data: GruUserModel) => {
              this.grupo.id = data.id;
              this.globalService.setSpin(false);
              this.onRetorno();
            },
            (error: any) => {
              this.globalService.setSpin(false);
              this.appSnackBar.openFailureSnackBar(
                `Erro Na INclusão ${error.error.tabela} - ${error.error.erro} - ${error.error.message}`,
                'OK'
              );
            }
          );
        break;
      case CadastroAcoes.Edicao:
        this.globalService.setSpin(true);
        this.grupo.user_update = this.globalService.getUsuario().id;
        this.inscricaoAcao = this.grupoEconomicoService
          .GrupoUserUpdate(this.grupo)
          .subscribe(
            async (data: any) => {
              this.globalService.setSpin(false);
              this.onRetorno();
            },
            (error: any) => {
              this.globalService.setSpin(false);
              this.appSnackBar.openFailureSnackBar(
                `Erro Na Alteração ${error.error.tabela} - ${error.error.erro} - ${error.error.message}`,
                'OK'
              );
            }
          );
        break;
      case CadastroAcoes.Exclusao:
        this.globalService.setSpin(true);
        this.inscricaoAcao = this.grupoEconomicoService
          .GrupoUserDelete(this.grupo.id_empresa, this.grupo.id)
          .subscribe(
            async (data: any) => {
              this.globalService.setSpin(false);
              this.onRetorno();
            },
            (error: any) => {
              this.globalService.setSpin(false);
              this.appSnackBar.openFailureSnackBar(
                `Erro Na Exclusao ${error.error.tabela} - ${error.error.erro} - ${error.error.message}`,
                'OK'
              );
            }
          );
        break;
      default:
        break;
    }
  }

  getAcoes() {
    return CadastroAcoes;
  }

  touchedOrDirty(campo: string): boolean {
    if (
      this.formulario.get(campo)?.touched ||
      this.formulario.get(campo)?.dirty
    ) {
      return true;
    }
    return false;
  }

  getValidfield(field: string): boolean {
    return (
      this.formulario.get(field)?.errors?.ValidatorStringLen &&
      this.touchedOrDirty(field)
    );
  }

  getMensafield(field: string): string {
    return this.formulario.get(field)?.errors?.message;
  }
}
