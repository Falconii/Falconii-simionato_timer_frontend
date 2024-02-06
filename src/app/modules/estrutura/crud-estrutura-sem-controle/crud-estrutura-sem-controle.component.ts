import { EstruturaUsuarioModel } from './../../../Models/estrutura-usuario-model';
import { GlobalService } from 'src/app/services/global.service';
import { UsuariosService } from 'src/app/services/usuarios.service';
import { SimNao } from '../../../shared/classes/sim-nao';
import { EstruturasService } from 'src/app/services/estruturas.service';
import { EstruturaModel } from 'src/app/Models/estrutura-model';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { CadastroAcoes } from 'src/app/shared/classes/cadastro-acoes';
import { Subscription } from 'rxjs';
import { ActivatedRoute, Router } from '@angular/router';
import { TipoConta } from 'src/app/shared/classes/tipo-conta';
import { ValidatorStringLen } from 'src/app/shared/Validators/validator-string-len';
import { UsuarioQuery01Model } from 'src/app/Models/usuario-query_01-model';
import { ParametroUsuario01 } from 'src/app/parametros/parametro-usuario01';
import { AppSnackbar } from 'src/app/shared/classes/app-snackbar';

export interface UsersChoices {
  id: number;
  nome: string;
  escolhido: boolean;
  users?: UsersChoices[];
}
@Component({
  selector: 'app-crud-estrutura-sem-controle',
  templateUrl: './crud-estrutura-sem-controle.component.html',
  styleUrls: ['./crud-estrutura-sem-controle.component.css'],
})
export class CrudEstruturaSemControleComponent implements OnInit {
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
  inscricaoAuditor!: Subscription;
  durationInSeconds = 2;

  labelCadastro: string = '';

  choices: UsersChoices = {
    id: 0,
    nome: 'Todos',
    escolhido: false,
    users: [],
  };

  lsUsuarios: EstruturaUsuarioModel[] = [];

  constructor(
    private formBuilder: FormBuilder,
    private estruturaService: EstruturasService,
    private usuariosService: UsuariosService,
    private globalService: GlobalService,
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
      controle: [{ value: '' }],
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
      this.estrutura.controle = 'N';
      this.estrutura.user_insert = 1;
      this.estrutura.status = 1;
      this.setValue();
    } else {
      this.getEstrutura();
    }
    this.getAuditores();
  }

  ngOnDestroy(): void {
    this.inscricaoGetEstrutura?.unsubscribe();
    this.inscricaoRota?.unsubscribe();
    this.inscricaoAcao?.unsubscribe();
    this.inscricaoAuditor?.unsubscribe();
  }

  onSubmit() {
    if (!this.hasUsers()) {
      this.appSnackBar.openSuccessSnackBar(
        `Pelo Menos Um Usuário Deve Ser Escolhido.`,
        'OK'
      );
    } else {
      if (this.formulario.valid) {
        this.executaAcao();
      } else {
        this.appSnackBar.openSuccessSnackBar(
          `Formulário Com Campos Inválidos.`,
          'OK'
        );
      }
    }
  }

  onCancel() {
    this.router.navigate(['/estruturas']);
  }

  getEstrutura() {
    this.globalService.setSpin(true);
    this.inscricaoGetEstrutura = this.estruturaService
      .getConta(
        this.estrutura.id_empresa,
        this.estrutura.conta,
        this.estrutura.versao
      )
      .subscribe(
        (data: EstruturaModel) => {
          this.globalService.setSpin(false);
          this.estrutura = data;
          this.setValue();
        },
        (error: any) => {
          this.globalService.setSpin(false);
          this.appSnackBar.openFailureSnackBar(
            `Pesquisa Nas EStruturas ${error.error.tabela} - ${error.error.erro} - ${error.error.message}`,
            'OK'
          );
        }
      );
  }

  getAuditores() {
    const par = new ParametroUsuario01();

    const dire = this.usuariosService.getGruposDiretoria();

    const coorde = this.usuariosService.getGruposCoordenador();

    const audi = this.usuariosService.getGruposAuditor();

    par.id_empresa = this.globalService.id_empresa;

    dire.forEach((value) => {
      par.grupo.push(value);
    });

    coorde.forEach((value) => {
      par.grupo.push(value);
    });

    audi.forEach((value) => {
      par.grupo.push(value);
    });

    par.orderby = 'Razão';

    this.globalService.setSpin(true);

    this.inscricaoAuditor = this.usuariosService.getusuarios_01(par).subscribe(
      (data: UsuarioQuery01Model[]) => {
        this.globalService.setSpin(false);
        this.choices.users = [];
        data.forEach((auditor) => {
          this.choices.users?.push({
            id: auditor.id,
            nome: auditor.razao,
            escolhido: false,
          });
        });
        this.choices.escolhido = true;
        this.setAllUsers(true);
      },
      (error: any) => {
        this.globalService.setSpin(false);
        this.choices.escolhido = false;
        this.choices.users = [];
        this.setAllUsers(false);
        this.appSnackBar.openFailureSnackBar(
          `${error.error.tabela} - ${error.error.erro} - ${error.error.message}`,
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
      controle: this.estrutura.controle == 'S' ? 'SIM' : 'NÃO',
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
        this.labelCadastro = 'Estrutura - Sem Controle Inclusão.';
        this.readOnly = false;
        break;
      case CadastroAcoes.Edicao:
        this.acao = 'Gravar';
        this.labelCadastro = 'Estrutura - Sem Controle Alteração.';
        this.readOnly = false;
        break;
      case CadastroAcoes.Consulta:
        this.acao = 'Voltar';
        this.labelCadastro = 'Estrutura - Sem Controle Consulta.';
        this.readOnly = true;
        break;
      case CadastroAcoes.Exclusao:
        this.acao = 'Excluir';
        this.labelCadastro = 'Estrutura - Sem Controle Exclusão.';
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
    console.log('registro', this.estrutura);
    switch (+this.idAcao) {
      case CadastroAcoes.Inclusao:
        this.estrutura.conta = '';
        this.estrutura.subconta = '';
        this.lsUsuarios = [];
        this.choices.users?.forEach((user) => {
          const obj: EstruturaUsuarioModel = new EstruturaUsuarioModel();
          if (user.escolhido) {
            obj.id = user.id;
            obj.nome = user.nome;
            this.lsUsuarios.push(obj);
          }
        });
        this.inscricaoAcao = this.estruturaService
          .EstruturaInsert(
            this.estrutura,
            this.lsUsuarios.length > 0 ? this.lsUsuarios : null
          )
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

  hasUsers(): boolean {
    let retorno = false;

    this.choices.users?.forEach((user) => {
      if (user.escolhido) retorno = true;
    });
    return retorno;
  }

  setAllUsers(value: boolean): void {
    this.choices.escolhido = value;
    this.choices.users?.forEach((user) => {
      user.escolhido = value;
    });
  }
  updateAllComplete(evento: any): void {
    console.log(evento);
  }
}
