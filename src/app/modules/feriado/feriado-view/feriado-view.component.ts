import { TipoConta } from './../../../shared/classes/tipo-conta';
import { CadastroAcoes } from 'src/app/shared/classes/cadastro-acoes';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { FeriadoModel } from 'src/app/Models/feriado-model';
import { Subscription } from 'rxjs';
import { FeriadosService } from 'src/app/services/feriados.service';
import { GlobalService } from 'src/app/services/global.service';
import { ActivatedRoute, Router } from '@angular/router';
import { AppSnackbar } from 'src/app/shared/classes/app-snackbar';
import { ValidatorStringLen } from 'src/app/shared/Validators/validator-string-len';
import { TipoData } from 'src/app/shared/classes/tipo-data';
import { NivelData } from 'src/app/shared/classes/nivel-data';
import { messageError } from 'src/app/shared/classes/util';
import { ParametroUsuario01 } from 'src/app/parametros/parametro-usuario01';
import { UsuariosService } from 'src/app/services/usuarios.service';
import { UsuarioModel } from 'src/app/Models/usuario-model';
import { ValidatorDate } from 'src/app/shared/Validators/validator-date';

@Component({
  selector: 'app-feriado-view',
  templateUrl: './feriado-view.component.html',
  styleUrls: ['./feriado-view.component.css'],
})
export class FeriadoViewComponent implements OnInit {
  tipos_data: TipoData[] = this.globalService.getlsTiposData();
  niveis_data: NivelData[] = this.globalService.getlsNiveisData();

  formulario: FormGroup;

  feriado: FeriadoModel = new FeriadoModel();

  acao: string = 'Sem Definição';

  idAcao: number = CadastroAcoes.Inclusao;

  readOnly: boolean = true;

  inscricaoGetFeriado!: Subscription;
  inscricaoGetUsuarios!: Subscription;
  inscricaoRota!: Subscription;
  inscricaoAcao!: Subscription;

  labelCadastro: string = 'Cadastro De Datas Especiais';

  id_empresa: number = 0;
  id_usuario: number = 0;
  id_tipo: number = 0;
  data: string = '';

  constructor(
    private formBuilder: FormBuilder,
    private feriadosService: FeriadosService,
    private usuariosService: UsuariosService,
    private globalService: GlobalService,
    private route: ActivatedRoute,
    private router: Router,
    private appSnackBar: AppSnackbar
  ) {
    this.formulario = formBuilder.group({
      data: [{ value: '' }, [ValidatorDate(true)]],
      nivel: [{ value: '' }],
      nivel_: [{ value: '' }],
      descricao: [{ value: '' }, [ValidatorStringLen(1, 50, true)]],
    });
    this.feriado = new FeriadoModel();
    this.feriado.id_empresa = this.globalService.getIdEmpresa();
    this.feriado.id_tipo = 1;
    this.feriado.id_nivel = 3;
    this.inscricaoRota = route.params.subscribe((params: any) => {
      this.id_empresa = params.id_empresa;
      this.id_usuario = params.id_usuario;
      this.id_tipo = params.id_tipo;
      this.data = params.data;
      this.idAcao = params.acao;
      this.setAcao(params.acao);
    });
    this.setValue();
  }

  ngOnInit(): void {
    if (this.idAcao != CadastroAcoes.Inclusao) {
      console.log('Buscando getFeriado!', this.idAcao);
      this.getFeriado();
    }
  }

  ngOnDestroy(): void {
    this.inscricaoGetFeriado?.unsubscribe();
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
      data: this.feriado.data,
      nivel: this.feriado.id_nivel,
      nivel_:
        this.idAcao == CadastroAcoes.Consulta ||
        this.idAcao == CadastroAcoes.Exclusao
          ? this.niveis_data[this.feriado.id_nivel].descricao
          : '',
      descricao: this.feriado.descricao,
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
    const par = this.globalService.estadoFind('feriado');
    if (par != null) {
      let config = par.getParametro();
      Object(config).new = this.idAcao == CadastroAcoes.Inclusao ? true : false;
      Object(config).id_retorno = this.feriado.data;
      par.parametro = JSON.stringify(config);
      this.globalService.estadoSave(par);
    }
    this.router.navigate(['/feriados/feriados', 'SIM']);
  }

  onCancel() {
    const par = this.globalService.estadoFind('grupo-user');
    if (par != null) {
      let config = par.getParametro();
      Object(config).new = false;
      Object(config).id_retorno =
        this.idAcao == CadastroAcoes.Consulta ? this.feriado.data : '';
      par.parametro = JSON.stringify(config);
      this.globalService.estadoSave(par);
    }
    this.router.navigate(['/feriados/feriados', 'SIM']);
  }

  getFeriado() {
    this.globalService.setSpin(true);
    this.inscricaoGetFeriado = this.feriadosService
      .getFeriado(this.id_empresa, this.id_usuario, this.id_tipo, this.data)
      .subscribe(
        (data: FeriadoModel) => {
          this.globalService.setSpin(false);
          this.feriado = data;
          this.setValue();
        },
        (error: any) => {
          this.globalService.setSpin(false);
          this.appSnackBar.openFailureSnackBar(
            `Pesquisa Nos Feriados ${messageError(error)}`,
            'OK'
          );
        }
      );
  }

  setAcao(op: number) {
    switch (+op) {
      case CadastroAcoes.Inclusao:
        this.acao = 'Gravar';
        this.labelCadastro = 'Feriados - Inclusão.';
        this.readOnly = false;
        break;
      case CadastroAcoes.Edicao:
        this.acao = 'Gravar';
        this.labelCadastro = 'Feriados - Alteração.';
        this.readOnly = false;
        break;
      case CadastroAcoes.Consulta:
        this.acao = 'Voltar';
        this.labelCadastro = 'Feriados - Consulta.';
        this.readOnly = true;
        break;
      case CadastroAcoes.Exclusao:
        this.acao = 'Excluir';
        this.labelCadastro = 'Feriados - Exclusão.';
        this.readOnly = true;
        break;
      default:
        break;
    }
  }

  executaAcao() {
    this.feriado.data = this.formulario.value.data;
    this.feriado.id_nivel = this.formulario.value.nivel;
    this.feriado.descricao = this.formulario.value.descricao;
    switch (+this.idAcao) {
      case CadastroAcoes.Inclusao:
        this.globalService.setSpin(false);
        this.feriado.user_insert = this.globalService.getUsuario().id;
        this.inscricaoAcao = this.feriadosService
          .FeriadoInsert(this.feriado)
          .subscribe(
            async (data: FeriadoModel) => {
              this.globalService.setSpin(false);
              this.onRetorno();
            },
            (error: any) => {
              this.globalService.setSpin(false);
              this.appSnackBar.openFailureSnackBar(
                `Erro Na INclusão ${messageError(error)}`,
                'OK'
              );
            }
          );
        break;
      case CadastroAcoes.Edicao:
        this.globalService.setSpin(true);
        this.feriado.user_update = this.globalService.getUsuario().id;
        this.inscricaoAcao = this.feriadosService
          .FeriadoUpdate(this.feriado)
          .subscribe(
            async (data: any) => {
              this.globalService.setSpin(false);
              this.onRetorno();
            },
            (error: any) => {
              this.globalService.setSpin(false);
              this.appSnackBar.openFailureSnackBar(
                `Erro Na Alteração ${messageError(error)}`,
                'OK'
              );
            }
          );
        break;
      case CadastroAcoes.Exclusao:
        this.globalService.setSpin(true);
        this.inscricaoAcao = this.feriadosService
          .FeriadoDelete(
            this.feriado.id_empresa,
            this.feriado.id_usuario,
            this.feriado.id_tipo,
            this.feriado.data
          )
          .subscribe(
            async (data: any) => {
              this.globalService.setSpin(false);
              this.onRetorno();
            },
            (error: any) => {
              this.globalService.setSpin(false);
              this.appSnackBar.openFailureSnackBar(
                `Erro Na Exclusao ${messageError(error)}`,
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

  readOnlyKey() {
    if (this.idAcao == CadastroAcoes.Inclusao) {
      return false;
    } else {
      return true;
    }
  }
}
