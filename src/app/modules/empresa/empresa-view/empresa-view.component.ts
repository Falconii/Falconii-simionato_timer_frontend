import { GlobalService } from './../../../services/global.service';
import { EmpresaModel } from './../../../Models/empresa-model';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Subscription } from 'rxjs';
import { CadastroAcoes } from 'src/app/shared/classes/cadastro-acoes';
import { EmpresasService } from 'src/app/services/empresas.service';
import { ActivatedRoute, Router } from '@angular/router';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ValidatorStringLen } from 'src/app/shared/Validators/validator-string-len';
import { ValidatorDate } from 'src/app/shared/Validators/validator-date';
import { ValidatorCnpjCpf } from 'src/app/shared/Validators/validator-Cnpj-Cpf';
import { ValidatorCep } from 'src/app/shared/Validators/validator-cep';
import { DropdownService } from 'src/app/shared/services/dropdown.service';
import { EstadoModel } from 'src/app/Models/estado-model';
import { AppSnackbar } from 'src/app/shared/classes/app-snackbar';

@Component({
  selector: 'app-empresa-view',
  templateUrl: './empresa-view.component.html',
  styleUrls: ['./empresa-view.component.css'],
})
export class EmpresaViewComponent implements OnInit {
  formulario: FormGroup;

  empresa: EmpresaModel = new EmpresaModel();

  erro: any;

  acao: string = 'Sem Definição';

  idAcao: number = CadastroAcoes.Inclusao;

  readOnly: boolean = true;

  inscricaoGetEmpresa!: Subscription;
  inscricaoRota!: Subscription;
  inscricaoAcao!: Subscription;
  inscricaoUf!: Subscription;

  durationInSeconds = 2;

  labelCadastro: string = '';

  ufs: EstadoModel[] = [];

  constructor(
    private formBuilder: FormBuilder,
    private empresasServices: EmpresasService,
    private estadosSrv: DropdownService,
    private globalService: GlobalService,
    private route: ActivatedRoute,
    private router: Router,
    private appSnackBar: AppSnackbar
  ) {
    this.formulario = formBuilder.group({
      id: [{ value: '', disabled: true }],
      razao: [{ value: '' }, [ValidatorStringLen(3, 40, true)]],
      cadastr: [{ value: '' }, [ValidatorDate(true)]],
      fantasi: [{ value: '' }, [ValidatorStringLen(3, 20, true)]],
      cnpj_cpf: [{ value: '' }, [ValidatorCnpjCpf(true)]],
      inscri: [{ value: '' }, [ValidatorStringLen(0, 20)]],
      ruaf: [{ value: '' }, [ValidatorStringLen(3, 80, true)]],
      nrof: [{ value: '' }, [ValidatorStringLen(1, 10, true)]],
      complementof: [{ value: '' }, [ValidatorStringLen(0, 30)]],
      bairrof: [{ value: '' }, [ValidatorStringLen(3, 40, true)]],
      cidadef: [{ value: '' }, [ValidatorStringLen(3, 40, true)]],
      uff: [{ value: '' }, [ValidatorStringLen(2, 2, true)]],
      uff_: [{ value: '' }],
      cepf: [{ value: '' }, [ValidatorCep(true)]],
      tel1: [{ value: '' }, [ValidatorStringLen(0, 23, true)]],
      tel2: [{ value: '' }, [ValidatorStringLen(0, 23)]],
      emailf: [{ value: '' }, [Validators.email]],
      obs: [{ value: '' }, [ValidatorStringLen(0, 200)]],
    });
    this.empresa = new EmpresaModel();
    this.inscricaoRota = route.params.subscribe((params: any) => {
      this.empresa.id = params.id;
      this.idAcao = params.acao;
      this.setAcao(params.acao);
    });
  }

  ngOnInit(): void {
    if (this.idAcao == CadastroAcoes.Inclusao) {
      this.empresa = new EmpresaModel();
    } else {
      this.getEmpresa();
    }
    this.getUfs();
    this.setValue();
  }

  ngOnDestroy(): void {
    this.inscricaoGetEmpresa?.unsubscribe();
    this.inscricaoRota?.unsubscribe();
    this.inscricaoAcao?.unsubscribe();
    this.inscricaoUf?.unsubscribe();
  }

  onSubmit() {
    console.log(this.formulario);
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
      id: this.empresa.id,
      razao: this.empresa.razao,
      cadastr: this.empresa.cadastr,
      cnpj_cpf: this.empresa.cnpj_cpf,
      inscri: this.empresa.inscri,
      fantasi: this.empresa.fantasi,
      ruaf: this.empresa.ruaf,
      nrof: this.empresa.nrof,
      complementof: this.empresa.complementof,
      bairrof: this.empresa.bairrof,
      cidadef: this.empresa.cidadef,
      uff: this.empresa.uff,
      uff_:
        this.idAcao == CadastroAcoes.Consulta ||
        this.idAcao == CadastroAcoes.Exclusao
          ? this.empresa.uff
          : '',
      cepf: this.empresa.cepf,
      tel1: this.empresa.tel1,
      tel2: this.empresa.tel2,
      emailf: this.empresa.emailf,
      obs: this.empresa.obs,
    });
  }

  getLabelCancel() {
    if (this.idAcao == CadastroAcoes.Consulta) {
      return 'Voltar';
    } else {
      return 'Cancelar';
    }
  }

  onCancel() {
    this.router.navigate(['/empresas']);
  }

  getEmpresa() {
    this.globalService.setSpin(true);
    this.inscricaoGetEmpresa = this.empresasServices
      .getEmpresa(this.empresa.id)
      .subscribe(
        (data: EmpresaModel) => {
          this.globalService.setSpin(false);
          this.empresa = data;
          this.setValue();
        },
        (error: any) => {
          this.globalService.setSpin(false);
          this.appSnackBar.openFailureSnackBar(
            `Pesquisa Nas Empresas ${error.error.tabela} - ${error.error.erro} - ${error.error.message}`,
            'OK'
          );
        }
      );
  }

  getUfs() {
    this.globalService.setSpin(true);
    this.inscricaoUf = this.estadosSrv.getEstados().subscribe(
      (data: EstadoModel[]) => {
        this.globalService.setSpin(false);
        this.ufs = data;
      },
      (error: any) => {
        this.globalService.setSpin(false);
        this.appSnackBar.openFailureSnackBar(
          `Pesquisa Cadastrado De Estados ${error.error.tabela} - ${error.error.erro} - ${error.error.message}`,
          'OK'
        );
      }
    );
  }

  setAcao(op: number) {
    switch (+op) {
      case CadastroAcoes.Inclusao:
        this.acao = 'Gravar';
        this.labelCadastro = 'Empresas - Inclusão.';
        this.readOnly = false;
        break;
      case CadastroAcoes.Edicao:
        this.acao = 'Gravar';
        this.labelCadastro = 'Empresas - Alteração.';
        this.readOnly = false;
        break;
      case CadastroAcoes.Consulta:
        this.acao = 'Voltar';
        this.labelCadastro = 'Empresas - Consulta.';
        this.readOnly = true;
        break;
      case CadastroAcoes.Exclusao:
        this.acao = 'Excluir';
        this.labelCadastro = 'Empresas - Exclusão.';
        this.readOnly = true;
        break;
      default:
        break;
    }
  }

  executaAcao() {
    this.empresa.cnpj_cpf = this.formulario.value.cnpj_cpf;
    this.empresa.razao = this.formulario.value.razao;
    this.empresa.fantasi = this.formulario.value.fantasi;
    this.empresa.inscri = this.formulario.value.inscri;
    this.empresa.cadastr = this.formulario.value.cadastr;
    this.empresa.ruaf = this.formulario.value.ruaf;
    this.empresa.nrof = this.formulario.value.nrof;
    this.empresa.complementof = this.formulario.value.complementof;
    this.empresa.bairrof = this.formulario.value.bairrof;
    this.empresa.cidadef = this.formulario.value.cidadef;
    this.empresa.uff = this.formulario.value.uff;
    this.empresa.cepf = this.formulario.value.cepf;
    this.empresa.tel1 = this.formulario.value.tel1;
    this.empresa.tel2 = this.formulario.value.tel2;
    this.empresa.emailf = this.formulario.value.emailf;
    this.empresa.obs = this.formulario.value.obs;
    switch (+this.idAcao) {
      case CadastroAcoes.Inclusao:
        this.empresa.user_insert = this.globalService.getUsuario().id;
        this.globalService.setSpin(true);
        this.inscricaoAcao = this.empresasServices
          .EmpresaInsert(this.empresa)
          .subscribe(
            async (data: EmpresaModel) => {
              this.globalService.setSpin(false);
              this.onCancel();
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
        this.empresa.user_update = this.globalService.getUsuario().id;
        this.inscricaoAcao = this.empresasServices
          .EmpresaUpdate(this.empresa)
          .subscribe(
            async (data: any) => {
              this.globalService.setSpin(false);
              this.onCancel();
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
        this.inscricaoAcao = this.empresasServices
          .EmpresaDelete(this.empresa.id)
          .subscribe(
            async (data: any) => {
              this.globalService.setSpin(false);
              this.onCancel();
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
