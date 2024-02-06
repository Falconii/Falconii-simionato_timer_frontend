import { SimNao } from '../../../shared/classes/sim-nao';
import { EstruturasService } from 'src/app/services/estruturas.service';
import { EstruturaModel } from 'src/app/Models/estrutura-model';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { CadastroAcoes } from 'src/app/shared/classes/cadastro-acoes';
import { Subscription } from 'rxjs';
import { ActivatedRoute, Router } from '@angular/router';
import { MatSnackBar } from '@angular/material/snack-bar';
import { TipoConta } from 'src/app/shared/classes/tipo-conta';
import { ValidatorStringLen } from 'src/app/shared/Validators/validator-string-len';
import { AppSnackbar } from 'src/app/shared/classes/app-snackbar';
@Component({
  selector: 'app-crud-view-estrutura',
  templateUrl: './crud-view-estrutura.component.html',
  styleUrls: ['./crud-view-estrutura.component.css'],
})
export class CrudViewEstruturaComponent implements OnInit {
  formulario: FormGroup;

  estrutura: EstruturaModel = new EstruturaModel();

  erro: any;

  acao: string = 'Sem Definição';

  idAcao: number = CadastroAcoes.Inclusao;

  readOnly: boolean = true;

  tipos: TipoConta[] = [
    { tipo: 'C', descricao: 'CONTA' },
    { tipo: 'S', descricao: 'SUBCONTA' },
    { tipo: 'O', descricao: 'OPERACIONAL' },
  ];

  respostas: SimNao[] = [
    { sigla: 'S', descricao: 'SIM' },
    { sigla: 'N', descricao: 'NÃO' },
  ];
  inscricaoGetEstrutura!: Subscription;
  inscricaoRota!: Subscription;
  inscricaoAcao!: Subscription;
  durationInSeconds = 2;

  labelCadastro: string = '';

  constructor(
    private formBuilder: FormBuilder,
    private estruturaService: EstruturasService,
    private route: ActivatedRoute,
    private router: Router,
    private appSnackBar: AppSnackbar
  ) {
    this.formulario = formBuilder.group({
      conta: [{ value: '' }],
      versao: [{ value: '' }],
      subconta: [
        { value: '' },
        [
          Validators.required,
          Validators.minLength(2),
          Validators.maxLength(14),
        ],
      ],
      descricao: [
        { value: '' },
        [
          Validators.required,
          Validators.minLength(1),
          Validators.maxLength(300),
        ],
      ],
      nivel: [{ value: '' }],
      tipo: [{ value: '' }, [ValidatorStringLen(1, 2, true)]],
      tipo_: [{ value: '' }],
      controle: [{ value: '' }, [ValidatorStringLen(1, 2, true)]],
      controle_: [{ value: '' }],
    });
    this.estrutura = new EstruturaModel();
    this.inscricaoRota = route.params.subscribe((params: any) => {
      console.log('==>', params);
      this.estrutura.id_empresa = params.id_empresa;
      this.estrutura.conta = params.conta;
      this.estrutura.versao = params.versao;
      this.estrutura.subconta = params.subconta;
      this.idAcao = params.acao;
      this.setAcao(params.acao);
    });
  }

  ngOnInit(): void {
    if (this.idAcao == CadastroAcoes.Inclusao) {
      this.estrutura = new EstruturaModel();
      this.estrutura.id_empresa = 1;
      this.estrutura.conta = 'NOVA';
      this.estrutura.versao = '0101';
      this.estrutura.subconta = 'NOVA';
      this.estrutura.nivel = 1;
      this.estrutura.nivel_maxi = 7;
      this.estrutura.tipo = 'C';
      this.estrutura.user_insert = 1;
      this.estrutura.status = 1;
      this.setValue();
    } else {
      this.getEstrutura();
    }
  }

  ngOnDestroy(): void {
    this.inscricaoGetEstrutura?.unsubscribe();
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

  onCancel() {
    this.router.navigate(['/estruturas']);
  }

  getEstrutura() {
    this.inscricaoGetEstrutura = this.estruturaService
      .getConta(
        this.estrutura.id_empresa,
        this.estrutura.conta,
        this.estrutura.versao
      )
      .subscribe(
        (data: EstruturaModel) => {
          this.estrutura = data;
          this.setValue();
        },
        (error: any) => {
          this.appSnackBar.openFailureSnackBar(
            `Pesquisa Nas EStruturas ${error.error.tabela} - ${error.error.erro} - ${error.error.message}`,
            'OK'
          );
        }
      );
  }

  setValue() {
    this.formulario.setValue({
      conta: this.estrutura.conta,
      versao: this.estrutura.versao,
      subconta: this.estrutura.subconta,
      descricao: this.estrutura.descricao,
      nivel: this.estrutura.nivel,
      tipo: this.estrutura.tipo,
      tipo_:
        this.idAcao == CadastroAcoes.Consulta ||
        this.idAcao == CadastroAcoes.Exclusao
          ? this.tipos[
              this.tipos.findIndex((data) => data.tipo == this.estrutura.tipo)
            ].descricao
          : '',
      controle: this.estrutura.controle,
      controle_:
        this.idAcao == CadastroAcoes.Consulta ||
        this.idAcao == CadastroAcoes.Exclusao ||
        this.idAcao == CadastroAcoes.Edicao
          ? this.respostas[
              this.respostas.findIndex(
                (data) => data.sigla == this.estrutura.controle
              )
            ].descricao
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

  setAcao(op: number) {
    switch (+op) {
      case CadastroAcoes.Inclusao:
        this.acao = 'Gravar';
        this.labelCadastro = 'Estrutura - Inclusão.';
        this.readOnly = false;
        break;
      case CadastroAcoes.Edicao:
        this.acao = 'Gravar';
        this.labelCadastro = 'Estrutura - Alteração.';
        this.readOnly = false;
        break;
      case CadastroAcoes.Consulta:
        this.acao = 'Voltar';
        this.labelCadastro = 'Estrutura - Consulta.';
        this.readOnly = true;
        break;
      case CadastroAcoes.Exclusao:
        this.acao = 'Excluir';
        this.labelCadastro = 'Estrutura - Exclusão.';
        this.readOnly = true;
        break;
      default:
        break;
    }
  }

  executaAcao() {
    this.estrutura.conta = this.formulario.value.conta;
    this.estrutura.subconta = this.formulario.value.subconta;
    this.estrutura.descricao = this.formulario.value.descricao;
    this.estrutura.nivel = this.formulario.value.nivel;
    this.estrutura.tipo = this.formulario.value.tipo;
    this.estrutura.controle = this.formulario.value.controle;
    console.log('registro', this.estrutura);
    switch (+this.idAcao) {
      case CadastroAcoes.Inclusao:
        this.estrutura.conta = '';
        this.estrutura.subconta = '';
        this.inscricaoAcao = this.estruturaService
          .EstruturaInsert(this.estrutura)
          .subscribe(
            async (data: EstruturaModel) => {
              this.onCancel();
            },
            (error: any) => {
              this.appSnackBar.openFailureSnackBar(
                `Erro Na Inclusão ${error.error.tabela} - ${error.error.erro} - ${error.error.message}`,
                'OK'
              );
            }
          );
        break;
      case CadastroAcoes.Edicao:
        this.inscricaoAcao = this.estruturaService
          .EstruturaUpdate(this.estrutura)
          .subscribe(
            async (data: any) => {
              this.onCancel();
            },
            (error: any) => {
              console.log('Error', error.error);
              this.appSnackBar.openFailureSnackBar(
                `Erro Na Alteração ${error.error.tabela} - ${error.error.erro} - ${error.error.message}`,
                'OK'
              );
            }
          );
        break;
      case CadastroAcoes.Exclusao:
        this.inscricaoAcao = this.estruturaService
          .EstruturaAllDelete(
            this.estrutura.id_empresa,
            this.estrutura.conta,
            this.estrutura.versao
          )
          .subscribe(
            async (data: any) => {
              this.onCancel();
            },
            (error: any) => {
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
}
