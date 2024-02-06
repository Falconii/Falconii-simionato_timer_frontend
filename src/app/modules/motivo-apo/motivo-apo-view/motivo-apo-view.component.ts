import { GlobalService } from 'src/app/services/global.service';
import { MotivoApoService } from './../../../services/motivo-apo.service';
import { MotivoApoModel } from './../../../Models/motivo-apo-model';
import { Component, OnInit } from '@angular/core';
import { CadastroAcoes } from 'src/app/shared/classes/cadastro-acoes';
import { Subscription } from 'rxjs';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { ValidatorStringLen } from 'src/app/shared/Validators/validator-string-len';
import { AppSnackbar } from 'src/app/shared/classes/app-snackbar';
import { messageError } from 'src/app/shared/classes/util';

@Component({
  selector: 'app-motivo-apo-view',
  templateUrl: './motivo-apo-view.component.html',
  styleUrls: ['./motivo-apo-view.component.css'],
})
export class MotivoApoViewComponent implements OnInit {
  formulario: FormGroup;

  motivo: MotivoApoModel = new MotivoApoModel();

  erro: any;

  acao: string = 'Sem Definição';

  idAcao: number = CadastroAcoes.Inclusao;

  readOnly: boolean = true;

  ReadOnlyKey: boolean = false;

  respostas: any[] = [
    { resp: 'S', resposta: 'SIM' },
    { resp: 'N', resposta: 'NÃO' },
  ];

  inscricaoGet!: Subscription;
  inscricaoRota!: Subscription;
  inscricaoAcao!: Subscription;

  labelCadastro: string = '';

  constructor(
    private formBuilder: FormBuilder,
    private motivoApoService: MotivoApoService,
    private globslService: GlobalService,
    private route: ActivatedRoute,
    private router: Router,
    private appSnackBar: AppSnackbar,
    private globalService: GlobalService
  ) {
    this.formulario = formBuilder.group({
      codigo: ['', [Validators.required]],
      motivo: [{ value: '' }, [ValidatorStringLen(3, 20, true)]],
      produtivo: [{ value: 'N' }, [Validators.required]],
      produtivo_: [{ value: 'N' }],
    });
    this.motivo = new MotivoApoModel();
    this.inscricaoRota = route.params.subscribe((params: any) => {
      this.motivo.id_empresa = params.id_empresa;
      this.motivo.codigo = params.codigo;
      this.idAcao = params.acao;
      this.setAcao(params.acao);
    });
  }

  ngOnInit(): void {
    if (this.idAcao == CadastroAcoes.Inclusao) {
      this.motivo = new MotivoApoModel();
      this.motivo.id_empresa = 1;
      this.motivo.produtivo = 'N';
    } else {
      this.getMotivo();
    }

    this.setValue();
  }

  ngOnDestroy(): void {
    this.inscricaoGet?.unsubscribe();
    this.inscricaoRota?.unsubscribe();
    this.inscricaoAcao?.unsubscribe();
  }

  onSubmit() {
    console.log('this.formulario', this.formulario);
    if (this.formulario.valid) {
      this.executaAcao();
    } else {
      this.appSnackBar.openSuccessSnackBar(
        `Formulário Com Campos Inválidos.`,
        'OK'
      );
    }
  }

  setValue() {
    this.formulario.setValue({
      codigo: this.motivo.codigo,
      motivo: this.motivo.motivo,
      produtivo: this.motivo.produtivo,
      produtivo_:
        this.idAcao == CadastroAcoes.Consulta ||
        this.idAcao == CadastroAcoes.Exclusao
          ? this.motivo.produtivo == 'S'
            ? 'SIM'
            : 'NÃO'
          : '',
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
    const par = this.globalService.estadoFind('motivo');
    if (par != null) {
      let config = par.getParametro();
      Object(config).new = this.idAcao == CadastroAcoes.Inclusao ? true : false;
      Object(config).id_retorno = this.motivo.codigo;
      par.parametro = JSON.stringify(config);
      this.globalService.estadoSave(par);
    }
    this.router.navigate(['/motivos/motivos', 'SIM']);
  }

  onCancel() {
    const par = this.globalService.estadoFind('motivo');
    if (par != null) {
      let config = par.getParametro();
      Object(config).new = false;
      Object(config).id_retorno =
        this.idAcao == CadastroAcoes.Consulta ? this.motivo.codigo : '';
      par.parametro = JSON.stringify(config);
      this.globalService.estadoSave(par);
    }
    this.router.navigate(['/motivos/motivos', 'SIM']);
  }

  getMotivo() {
    this.globalService.setSpin(true);
    this.inscricaoGet = this.motivoApoService
      .getMotivoApo(this.motivo.id_empresa, this.motivo.codigo)
      .subscribe(
        (data: MotivoApoModel) => {
          this.globalService.setSpin(false);
          this.motivo = data;
          this.setValue();
        },
        (error: any) => {
          this.globalService.setSpin(false);
          this.appSnackBar.openFailureSnackBar(
            `Pesquisa Nos Motivos De Apontamento ${messageError(error)}`,
            'OK'
          );
        }
      );
  }

  setAcao(op: number) {
    switch (+op) {
      case CadastroAcoes.Inclusao:
        this.acao = 'Gravar';
        this.labelCadastro = 'Mot. Apontamento - Inclusão.';
        this.readOnly = false;
        this.ReadOnlyKey = false;
        break;
      case CadastroAcoes.Edicao:
        this.acao = 'Gravar';
        this.labelCadastro = 'Mot. Apontamento - Alteração.';
        this.readOnly = false;
        this.ReadOnlyKey = true;

        break;
      case CadastroAcoes.Consulta:
        this.acao = 'Voltar';
        this.labelCadastro = 'Mot. Apontamento - Consulta.';
        this.readOnly = true;
        this.ReadOnlyKey = true;
        break;
      case CadastroAcoes.Exclusao:
        this.acao = 'Excluir';
        this.labelCadastro = 'Mot. Apontamento - Exclusão.';
        this.readOnly = true;
        this.ReadOnlyKey = true;
        break;
      default:
        break;
    }
  }

  executaAcao() {
    this.motivo.codigo = this.formulario.value.codigo;
    this.motivo.motivo = this.formulario.value.motivo;
    this.motivo.produtivo = this.formulario.value.produtivo;
    switch (+this.idAcao) {
      case CadastroAcoes.Inclusao:
        this.motivo.user_insert = this.globslService.getUsuario().id;
        this.globalService.setSpin(true);
        this.inscricaoAcao = this.motivoApoService
          .MotivoApoInsert(this.motivo)
          .subscribe(
            async (data: MotivoApoModel) => {
              this.motivo.codigo = data.codigo;
              this.globalService.setSpin(false);
              this.onRetorno();
            },
            (error: any) => {
              this.globalService.setSpin(false);
              this.appSnackBar.openFailureSnackBar(
                `Erro Na Inclusão ${messageError(error)}`,
                'OK'
              );
            }
          );
        break;
      case CadastroAcoes.Edicao:
        this.motivo.user_update = this.globslService.getUsuario().id;
        this.globalService.setSpin(true);
        this.inscricaoAcao = this.motivoApoService
          .MotivoApoUpdate(this.motivo)
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
        this.inscricaoAcao = this.motivoApoService
          .MotivoApoDelete(this.motivo.id_empresa, this.motivo.codigo)
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
}
