import { GlobalService } from './../../../services/global.service';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Subscription } from 'rxjs';
import { ActivatedRoute, Router } from '@angular/router';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ValidatorStringLen } from 'src/app/shared/Validators/validator-string-len';
import { ValidatorCep } from 'src/app/shared/Validators/validator-cep';
import { ValidatorCnpjCpf } from 'src/app/shared/Validators/validator-Cnpj-Cpf';
import { ValidatorDate } from 'src/app/shared/Validators/validator-date';
import { DropdownService } from 'src/app/shared/services/dropdown.service';
import { EstadoModel } from 'src/app/Models/estado-model';
import { ClientesModel } from 'src/app/Models/cliente-model';
import { GrupoEcoModel } from 'src/app/Models/gru-eco-models';
import { CadastroAcoes } from 'src/app/shared/classes/cadastro-acoes';
import { ClientesService } from 'src/app/services/clientes.service';
import { GrupoEconomicoService } from 'src/app/services/grupo-economico.service';
import { AppSnackbar } from 'src/app/shared/classes/app-snackbar';

@Component({
  selector: 'app-cliente-view',
  templateUrl: './cliente-view.component.html',
  styleUrls: ['./cliente-view.component.css'],
})
export class ClienteViewComponent implements OnInit {
  formulario: FormGroup;

  cliente: ClientesModel;

  grupos: GrupoEcoModel[];

  erro: any;

  acao: string = 'Sem Definição';

  idAcao: number = CadastroAcoes.Inclusao;

  readOnly: boolean = true;

  inscricaoGetCliente!: Subscription;
  inscricaoGetGrupo!: Subscription;
  inscricaoRota!: Subscription;
  inscricaoAcao!: Subscription;
  inscricaoUf!: Subscription;

  durationInSeconds = 2;

  labelCadastro: string = '';

  ufs: EstadoModel[] = [];

  constructor(
    private formBuilder: FormBuilder,
    private clientesServices: ClientesService,
    private grupoEconomicoService: GrupoEconomicoService,
    private estadosSrv: DropdownService,
    private route: ActivatedRoute,
    private router: Router,
    private appSnackBar: AppSnackbar,
    private globaService: GlobalService
  ) {
    this.formulario = formBuilder.group({
      id: [{ value: '', disabled: true }],
      razao: [{ value: '' }, [ValidatorStringLen(3, 65, true)]],
      cadastr: [{ value: '' }, [ValidatorDate(true)]],
      fantasi: [{ value: '' }, [ValidatorStringLen(3, 25, true)]],
      cnpj_cpf: [{ value: '' }, [ValidatorCnpjCpf(false)]],
      inscri: [{ value: '' }, [ValidatorStringLen(0, 20)]],
      gru_econo: [{ value: '' }],
      gru_econo_: [{ value: '' }],
      ruaf: [{ value: '' }, [ValidatorStringLen(3, 80, false)]],
      nrof: [{ value: '' }, [ValidatorStringLen(1, 10, false)]],
      complementof: [{ value: '' }, [ValidatorStringLen(0, 30)]],
      bairrof: [{ value: '' }, [ValidatorStringLen(3, 40, false)]],
      cidadef: [{ value: '' }, [ValidatorStringLen(3, 40, false)]],
      uff: [{ value: '' }, [ValidatorStringLen(2, 2, false)]],
      uff_: [{ value: '' }],
      cepf: [{ value: '' }, [ValidatorCep(false)]],
      tel1: [{ value: '' }, [ValidatorStringLen(0, 23, false)]],
      tel2: [{ value: '' }, [ValidatorStringLen(0, 23)]],
      emailf: [{ value: '' }, [Validators.email]],
      obs: [{ value: '' }, [ValidatorStringLen(0, 200)]],
    });
    this.cliente = new ClientesModel();
    this.grupos = [];
    this.inscricaoRota = route.params.subscribe((params: any) => {
      this.cliente.id_empresa = params.id_empresa;
      this.cliente.id = params.id;
      this.cliente.gru_econo = 1;
      this.idAcao = params.acao;
      this.setAcao(params.acao);
    });
  }

  ngOnInit() {
    if (this.idAcao == CadastroAcoes.Inclusao) {
      this.cliente = new ClientesModel();
      this.cliente.id_empresa = 1;
      this.cliente.gru_econo = 1;
    } else {
      this.getCliente();
    }

    this.getGrupos();

    this.getUfs();

    this.setValue();
  }

  ngOnDestroy(): void {
    this.inscricaoGetCliente?.unsubscribe();
    this.inscricaoGetGrupo?.unsubscribe();
    this.inscricaoRota?.unsubscribe();
    this.inscricaoAcao?.unsubscribe();
    this.inscricaoUf?.unsubscribe();
  }

  onSubmit() {
    if (this.formulario.valid) {
      this.executaAcao();
    } else {
      this.appSnackBar.openSuccessSnackBar(
        `Formulário Com Campos Inválidos.`,
        'OK'
      );
    }
  }

  onCancel() {
    this.router.navigate(['/clientes']);
  }

  getUfs() {
    this.inscricaoUf = this.estadosSrv.getEstados().subscribe(
      (data: EstadoModel[]) => {
        this.ufs = data;
      },
      (error: any) => {
        this.appSnackBar.openFailureSnackBar(
          `Pesquisa Cadastrado De Estados ${error.error.tabela} - ${error.error.erro} - ${error.error.message}`,
          'OK'
        );
      }
    );
  }

  getCliente() {
    this.inscricaoGetCliente = this.clientesServices
      .getCliente(this.cliente.id_empresa, this.cliente.id)
      .subscribe(
        (data: ClientesModel) => {
          this.cliente = data;
          this.setValue();
        },
        (error: any) => {
          this.appSnackBar.openFailureSnackBar(
            `Pesquisa Nos Clientes ${error.error.tabela} - ${error.error.erro} - ${error.error.message}`,
            'OK'
          );
        }
      );
  }

  getGrupos() {
    if (
      this.idAcao == CadastroAcoes.Consulta ||
      this.idAcao == CadastroAcoes.Exclusao
    ) {
      this.inscricaoGetGrupo = this.grupoEconomicoService
        .getGrupoEco(this.cliente.id_empresa, this.cliente.gru_econo)
        .subscribe(
          (data: GrupoEcoModel) => {
            this.grupos.push(data);
          },
          (error: any) => {
            this.appSnackBar.openFailureSnackBar(
              `Pesquisa Nos Grupos ${error.error.tabela} - ${error.error.erro} - ${error.error.message}`,
              'OK'
            );
          }
        );
    } else {
      this.inscricaoGetGrupo = this.grupoEconomicoService
        .getGrupoEcos()
        .subscribe(
          (data: GrupoEcoModel[]) => {
            this.grupos = data;
          },
          (error: any) => {
            this.appSnackBar.openFailureSnackBar(
              `Pesquisa Nos Grupos ${error.error.tabela} - ${error.error.erro} - ${error.error.message}`,
              'OK'
            );
          }
        );
    }
  }

  setReadOnly(value: Boolean) {
    /*
  Posso fazer na criação tb
  this.formGroupName = this.fb.group({
    xyz: [{ value: '', disabled: true }, Validators.required]
});
*/
    //this.formulario.get('grupo')?.disable({ onlySelf: true });
  }

  setValue() {
    this.formulario.setValue({
      id: this.cliente.id,
      razao: this.cliente.razao,
      cadastr: this.cliente.cadastr,
      cnpj_cpf: this.cliente.cnpj_cpf,
      inscri: this.cliente.inscri,
      fantasi: this.cliente.fantasi,
      gru_econo: this.cliente.gru_econo,
      gru_econo_:
        this.idAcao == CadastroAcoes.Consulta ||
        this.idAcao == CadastroAcoes.Exclusao
          ? this.cliente.gru_descricao
          : 'aaaaa',
      ruaf: this.cliente.ruaf,
      nrof: this.cliente.nrof,
      complementof: this.cliente.complementof,
      bairrof: this.cliente.bairrof,
      cidadef: this.cliente.cidadef,
      uff: this.cliente.uff,
      uff_:
        this.idAcao == CadastroAcoes.Consulta ||
        this.idAcao == CadastroAcoes.Exclusao
          ? this.cliente.uff
          : '',
      cepf: this.cliente.cepf,
      tel1: this.cliente.tel1,
      tel2: this.cliente.tel2,
      emailf: this.cliente.emailf,
      obs: this.cliente.obs,
    });
  }

  getLabelCancel() {
    if (this.idAcao == CadastroAcoes.Consulta) {
      return 'Voltar';
    } else {
      return 'Cancelar';
    }
  }

  setAcao(op: number) {
    switch (+op) {
      case CadastroAcoes.Inclusao:
        this.acao = 'Gravar';
        this.labelCadastro = 'Clientes - Inclusão.';
        this.readOnly = false;
        break;
      case CadastroAcoes.Edicao:
        this.acao = 'Gravar';
        this.labelCadastro = 'Clientes - Alteração.';
        this.readOnly = false;
        break;
      case CadastroAcoes.Consulta:
        this.acao = 'Voltar';
        this.labelCadastro = 'Clientes - Consulta.';
        this.readOnly = true;
        break;
      case CadastroAcoes.Exclusao:
        this.acao = 'Excluir';
        this.labelCadastro = 'Clientes - Exclusão.';
        this.readOnly = true;
        break;
      default:
        break;
    }
  }

  executaAcao() {
    this.cliente.cnpj_cpf = this.formulario.value.cnpj_cpf;
    this.cliente.razao = this.formulario.value.razao;
    this.cliente.fantasi = this.formulario.value.fantasi;
    this.cliente.inscri = this.formulario.value.inscri;
    this.cliente.cadastr = this.formulario.value.cadastr;
    this.cliente.ruaf = this.formulario.value.ruaf;
    this.cliente.nrof = this.formulario.value.nrof;
    this.cliente.complementof = this.formulario.value.complementof;
    this.cliente.bairrof = this.formulario.value.bairrof;
    this.cliente.cidadef = this.formulario.value.cidadef;
    this.cliente.uff = this.formulario.value.uff;
    this.cliente.cepf = this.formulario.value.cepf;
    this.cliente.tel1 = this.formulario.value.tel1;
    this.cliente.tel2 = this.formulario.value.tel2;
    this.cliente.emailf = this.formulario.value.emailf;
    this.cliente.obs = this.formulario.value.obs;
    this.cliente.gru_econo = this.formulario.value.gru_econo;
    this.cliente.gru_descricao = this.formulario.value.gru_econo_;
    switch (+this.idAcao) {
      case CadastroAcoes.Inclusao:
        this.cliente.user_insert = this.globaService.getUsuario().id;
        this.globaService.setSpin(true);
        this.inscricaoAcao = this.clientesServices
          .clienteInsert(this.cliente)
          .subscribe(
            async (data: ClientesModel) => {
              this.globaService.setSpin(false);
              this.onCancel();
            },
            (error: any) => {
              this.globaService.setSpin(false);
              this.appSnackBar.openFailureSnackBar(
                `Erro Na INclusão ${error.error.tabela} - ${error.error.erro} - ${error.error.message}`,
                'OK'
              );
            }
          );
        break;
      case CadastroAcoes.Edicao:
        this.globaService.setSpin(true);
        this.cliente.user_update = this.globaService.getUsuario().id;
        this.inscricaoAcao = this.clientesServices
          .clienteUpdate(this.cliente)
          .subscribe(
            async (data: any) => {
              this.globaService.setSpin(false);
              this.onCancel();
            },
            (error: any) => {
              this.globaService.setSpin(false);
              this.appSnackBar.openFailureSnackBar(
                `Erro Na Alteração ${error.error.tabela} - ${error.error.erro} - ${error.error.message}`,
                'OK'
              );
            }
          );
        break;
      case CadastroAcoes.Exclusao:
        this.globaService.setSpin(true);
        this.inscricaoAcao = this.clientesServices
          .clienteDelete(this.cliente.id_empresa, this.cliente.id)
          .subscribe(
            async (data: any) => {
              this.globaService.setSpin(false);
              this.onCancel();
            },
            (error: any) => {
              this.globaService.setSpin(false);
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

  delay(ms: number) {
    return new Promise((resolve) => setTimeout(resolve, ms));
  }

  getAcoes() {
    return CadastroAcoes;
  }

  touchedOrDirty(campo: string): boolean {
    if (
      this.formulario.get(campo)?.touched ||
      this.formulario.get(campo)?.dirty
    )
      return true;
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
