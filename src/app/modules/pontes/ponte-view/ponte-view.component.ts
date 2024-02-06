import { DisplayPontes } from './../../../shared/classes/DisplayPontes';
import { DecimalPipe } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { EstruturaUsuarioModel } from 'src/app/Models/estrutura-usuario-model';
import { FeriadoModel } from 'src/app/Models/feriado-model';
import { FeriadoPonteModel } from 'src/app/Models/feriado-ponte-model';
import { ProjetoModel } from 'src/app/Models/projeto-model';
import { ParametroUsuario01 } from 'src/app/parametros/parametro-usuario01';
import { GlobalService } from 'src/app/services/global.service';
import { TituloProjetoService } from 'src/app/services/titulo-projeto.service';
import { UsuariosService } from 'src/app/services/usuarios.service';
import { ValidatorDate } from 'src/app/shared/Validators/validator-date';
import { ValidatorStringLen } from 'src/app/shared/Validators/validator-string-len';
import { AppSnackbar } from 'src/app/shared/classes/app-snackbar';
import { CadastroAcoes } from 'src/app/shared/classes/cadastro-acoes';
import {
  DataYYYYMMDD,
  DifHoras,
  MensagensBotoes,
  ddmmaaaatoaaaammdd,
  getFirstName,
  getHora,
  getMinuto,
  messageError,
  minutostostohorasexagenal,
  setDBtoAngularGMT,
  setHorario,
} from 'src/app/shared/classes/util';
import { UsersChoices } from '../../estrutura/crud-estrutura-sem-controle/crud-estrutura-sem-controle.component';
import { UsuarioQuery01Model } from 'src/app/Models/usuario-query_01-model';
import { UsuarioQuery_03Model } from 'src/app/Models/usuario-query_03-model';
import { ParametroFeriado01 } from 'src/app/parametros/parametro-feriado01';
import { FeriadosService } from 'src/app/services/feriados.service';
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';
import { QuestionDialogData } from 'src/app/shared/components/question-dialog/Question-Dialog-Data';
import { QuestionDialogComponent } from 'src/app/shared/components/question-dialog/question-dialog.component';
import { ParametroAlterPonte } from 'src/app/parametros/parametro-alter-ponte';
import { ApoExecucaoModel } from 'src/app/Models/apo-execucao-model';

@Component({
  selector: 'app-ponte-view',
  templateUrl: './ponte-view.component.html',
  styleUrls: ['./ponte-view.component.css'],
})
export class PonteViewComponent implements OnInit {
  gerador: FormGroup;

  inscricaoGetPontes!: Subscription;
  inscricaoGetPonte!: Subscription;
  inscricaoGetFeriados!: Subscription;
  inscricaoCrud!: Subscription;
  inscricaoRota!: Subscription;
  inscricaoAuditor!: Subscription;
  inscricaoFeriadoCrud!: Subscription;

  feriado: FeriadoModel = new FeriadoModel();

  feriados: FeriadoModel[] = [];

  pontes: FeriadoPonteModel[] = [];

  displayPontes: DisplayPontes[] = [];

  acao: string = 'Sem Definição';

  idAcao: number = CadastroAcoes.Inclusao;

  labelCadastro: string = '';

  id_empresa: number = 0;

  id_projeto: number = 0;

  data: string = '';

  auditor: number = 0;

  auditores: UsuarioQuery01Model[] = [];

  allPontes: FeriadoModel[] = [];

  allAlterPontes: ParametroAlterPonte[] = [];

  readOnly: boolean = true;

  gravando: boolean = false;

  constructor(
    private formBuilder: FormBuilder,
    private globalService: GlobalService,
    private usuariosService: UsuariosService,
    private feriadoService: FeriadosService,
    public appSnackBar: AppSnackbar,
    private route: ActivatedRoute,
    private router: Router,
    public questionDialog: MatDialog
  ) {
    this.inscricaoRota = route.params.subscribe((params: any) => {
      this.id_empresa = params.id_empresa;
      this.data = params.data;
      this.idAcao = params.acao;
    });
    this.gerador = formBuilder.group({
      data_ref: [{ value: 0 }, [ValidatorDate(true)]],
      descricao: [{ value: '' }, [ValidatorStringLen(3, 50, true)]],
    });

    this.setValueGerador();

    this.setAcao(this.idAcao);
  }

  ngOnInit(): void {}

  ngOnDestroy(): void {
    this.inscricaoCrud?.unsubscribe();
    this.inscricaoRota?.unsubscribe();
    this.inscricaoGetPontes?.unsubscribe();
    this.inscricaoGetPonte?.unsubscribe();
    this.inscricaoGetFeriados?.unsubscribe();
    this.inscricaoAuditor?.unsubscribe();
    this.inscricaoFeriadoCrud?.unsubscribe();
  }

  setValueGerador() {
    this.gerador.setValue({
      data_ref: this.feriado.data,
      descricao: this.feriado.descricao,
    });
  }

  getFeriados() {
    let par = new ParametroFeriado01();

    par.id_empresa = this.globalService.getIdEmpresa();

    par.id_tipo = 2; //só ponte

    par.data = this.data;

    par.orderby = 'Data';

    par.contador = 'N';

    par.tamPagina = 0;

    par.pagina = 0;

    this.globalService.setSpin(true);

    this.inscricaoGetFeriados = this.feriadoService
      .getFeriados_01(par)
      .subscribe(
        (data: FeriadoModel[]) => {
          this.globalService.setSpin(false);
          this.feriados = data;
          this.feriado = data[0];
          if (this.idAcao == 98) {
            this.feriado.data = this.feriados[0].data;
            this.feriado.descricao = this.feriados[0].descricao;
            this.setValueGerador();
            this.getAuditoresPontes();
          }
          if (this.idAcao == 99) {
            this.appSnackBar.openWarningnackBar(
              `Ponte Já Cadastrada. Usar Alteração!`,
              'OK'
            );
          }
        },
        (error: any) => {
          this.globalService.setSpin(false);
          if (error.error.message !== 'Nehuma Informação Para Esta Consulta.') {
            this.feriados = [];
            this.feriado = new FeriadoModel();
            this.appSnackBar.openWarningnackBar(
              `Pesquisa Nas Pontes ${messageError(error)}`,
              'OK'
            );
          } else {
            this.getAuditoresPontes();
          }
        }
      );
  }

  getAuditoresPontes() {
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

    par.ativo = 'S';

    par.timer = 'S';

    par.data = this.gerador.value.data_ref;

    par.orderby = 'Razão';

    this.globalService.setSpin(true);

    this.inscricaoAuditor = this.usuariosService
      .getusuarios_01_Ponte(par)
      .subscribe(
        (data: UsuarioQuery_03Model[]) => {
          this.globalService.setSpin(false);
          this.loadDisplayItens(data);
        },
        (error: any) => {
          this.globalService.setSpin(false);
          this.appSnackBar.openWarningnackBar(
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

    par.id = this.globalService.getUsuario().id;

    par.orderby = 'Razão';

    this.globalService.setSpin(true);
    this.inscricaoAuditor = this.usuariosService.getusuarios_01(par).subscribe(
      (data: UsuarioQuery01Model[]) => {
        this.globalService.setSpin(false);
        this.auditor = this.globalService.getUsuario().id;
        this.auditores = data;
        this.auditores.forEach((auditor) => {
          auditor.razao = getFirstName(auditor.razao);
        });
      },
      (error: any) => {
        this.globalService.setSpin(false);
        this.auditor = 0;
        this.appSnackBar.openWarningnackBar(
          `Tabela De Usuários: ${messageError(error)}`,
          'OK'
        );
      }
    );
  }

  getAcoes() {
    return CadastroAcoes;
  }

  deleteFeriado(feriado: FeriadoModel) {
    const searchRegExp = /\//g;
    this.globalService.setSpin(true);

    this.inscricaoFeriadoCrud = this.feriadoService
      .FeriadoDelete(
        feriado.id_empresa,
        feriado.id_usuario,
        feriado.id_tipo,
        feriado.data.replace(searchRegExp, '_')
      )
      .subscribe(
        (data: any) => {
          this.globalService.setSpin(false);
          this.feriados = [];
          this.getFeriados();
        },
        (error: any) => {
          this.globalService.setSpin(false);
          this.appSnackBar.openWarningnackBar(
            `Falha Na Exclusão ${messageError(error)}`,
            'OK'
          );
        }
      );
  }
  escolha(opcao: number, feriado?: FeriadoModel) {
    if (typeof feriado !== 'undefined') {
      if ((opcao = this.getAcoes().Exclusao)) {
        this.onDelete(feriado);
        return;
      }
    }
  }

  setAcao(op: number) {
    switch (+op) {
      case 99:
        this.acao = 'Gravar';
        this.labelCadastro = 'INCLUSÃO';
        this.readOnly = false;
        this.posicaoIncluirAlterarPonte();
        break;
      case 98:
        this.acao = 'Atualizar';
        this.labelCadastro = 'ALTERAÇÃO';
        this.readOnly = true;
        this.posicaoIncluirAlterarPonte();
        break;
      case 97:
        this.acao = 'Voltar';
        this.labelCadastro = 'CONSULTA';
        this.readOnly = true;
        this.posicaoVisualizarExcluirFeriados();
        break;
      case 96:
        this.acao = 'Excluir';
        this.labelCadastro = 'EXCLUSÃO';
        this.readOnly = true;
        this.posicaoVisualizarExcluirFeriados();
        break;
      default:
        break;
    }
  }

  getTexto() {
    return MensagensBotoes;
  }

  onRetorno() {
    this.router.navigate(['/pontes/pontes']);
  }

  onHome() {
    this.router.navigate(['']);
  }
  onPosicaoInicial() {
    this.onRetorno();
  }

  onGerarPontes() {
    if (this.gerador.valid) {
      this.data = this.gerador.value.data_ref;
      this.getFeriados();
    } else {
      this.gerador.markAllAsTouched();
      this.appSnackBar.openWarningnackBar(
        `Formulário Com Campos Inválidos.`,
        'OK'
      );
    }
  }

  onGravarPontes() {
    if (this.idAcao == 99) {
      this.allPontes = [];
      this.displayPontes.forEach((ponte) => {
        if (!ponte.vazia && ponte.checked && ponte.ponte.flag_ponte == 'N') {
          const reg: FeriadoModel = new FeriadoModel();
          reg.id_empresa = this.globalService.id_empresa;
          reg.id_usuario = ponte.ponte.id;
          reg.data = this.gerador.value.data_ref;
          reg.descricao = this.gerador.value.descricao;
          reg.id_nivel = 0;
          reg.id_tipo = 2;
          reg.user_insert = this.globalService.usuario.id;

          reg.lancamento01 = new ApoExecucaoModel();

          reg.lancamento01.inicial = `${ddmmaaaatoaaaammdd(
            reg.data
          )}T${this.globalService
            .getUsuario()
            .man_hora_entrada.trim()} GMT-0300`;

          reg.lancamento01.final = `${ddmmaaaatoaaaammdd(
            reg.data
          )}T${this.globalService.getUsuario().man_hora_saida.trim()} GMT-0300`;

          reg.lancamento01.horasapon =
            minutostostohorasexagenal(
              DifHoras(
                `${ddmmaaaatoaaaammdd(reg.data)}T${this.globalService
                  .getUsuario()
                  .man_hora_entrada.trim()}`,
                `${ddmmaaaatoaaaammdd(reg.data)}T${this.globalService
                  .getUsuario()
                  .man_hora_saida.trim()}`
              )
            ) * -1;

          reg.lancamento01.id_empresa = this.globalService.getIdEmpresa();
          reg.lancamento01.id = 0;
          reg.lancamento01.id_projeto = 900000;
          reg.lancamento01.id_conta = '90';
          reg.lancamento01.id_subconta = '900101';
          reg.lancamento01.id_conta_versao = '0101';
          reg.lancamento01.id_subcliente = 50;
          reg.lancamento01.id_resp = 13;
          reg.lancamento01.id_exec = ponte.ponte.id;
          reg.lancamento01.id_motivo = '998002';
          reg.lancamento01.produtivo = 'S';
          reg.lancamento01.obs = 'GERADO AUTOMATICAMENTE';
          reg.lancamento01.encerramento = 'N';
          reg.lancamento01.user_insert = this.globalService.getUsuario().id;
          reg.lancamento01.user_update = 0;

          reg.lancamento02 = new ApoExecucaoModel();

          reg.lancamento02.inicial = `${ddmmaaaatoaaaammdd(
            reg.data
          )}T${this.globalService
            .getUsuario()
            .tard_hora_entrada.trim()} GMT-0300`;

          reg.lancamento02.final = `${ddmmaaaatoaaaammdd(
            reg.data
          )}T${this.globalService
            .getUsuario()
            .tard_hora_saida.trim()} GMT-0300`;

          reg.lancamento02.horasapon =
            minutostostohorasexagenal(
              DifHoras(
                `${ddmmaaaatoaaaammdd(reg.data)}T${this.globalService
                  .getUsuario()
                  .tard_hora_entrada.trim()}`,
                `${ddmmaaaatoaaaammdd(reg.data)}T${this.globalService
                  .getUsuario()
                  .tard_hora_saida.trim()}`
              )
            ) * -1;

          reg.lancamento02.id_empresa = this.globalService.getIdEmpresa();
          reg.lancamento02.id = 0;
          reg.lancamento02.id_projeto = 900000;
          reg.lancamento02.id_conta = '90';
          reg.lancamento02.id_subconta = '900101';
          reg.lancamento02.id_conta_versao = '0101';
          reg.lancamento02.id_subcliente = 50;
          reg.lancamento02.id_resp = 13;
          reg.lancamento02.id_exec = ponte.ponte.id;
          reg.lancamento02.id_motivo = '998002';
          reg.lancamento02.produtivo = 'S';
          reg.lancamento02.obs = 'GERADO AUTOMATICAMENTE';
          reg.lancamento02.encerramento = 'N';
          reg.lancamento02.user_insert = this.globalService.getUsuario().id;
          reg.lancamento02.user_update = 0;

          this.allPontes.push(reg);
        }
      });
      if (this.allPontes.length > 0) {
        this.savePontes();
      } else {
        this.appSnackBar.openWarningnackBar(
          'Nenhuma Ponte Para Incluir!',
          'OK'
        );
      }
    } else {
      //98 AlterPontes
      this.allAlterPontes = [];
      this.displayPontes.forEach((ponte) => {
        if (!ponte.vazia && ponte.checked) {
          const alter: ParametroAlterPonte = new ParametroAlterPonte();
          const reg: FeriadoModel = new FeriadoModel();
          alter.acao = ponte.acao;
          if (ponte.acao == CadastroAcoes.Inclusao) {
            reg.id_empresa = this.globalService.id_empresa;
            reg.id_usuario = ponte.ponte.id;
            reg.data = this.gerador.value.data_ref;
            reg.descricao = this.gerador.value.descricao;
            reg.id_nivel = 0;
            reg.id_tipo = 2;
            reg.user_insert = this.globalService.usuario.id;

            reg.lancamento01 = new ApoExecucaoModel();

            reg.lancamento01.inicial = `${ddmmaaaatoaaaammdd(
              reg.data
            )}T${this.globalService
              .getUsuario()
              .man_hora_entrada.trim()} GMT-0300`;

            reg.lancamento01.final = `${ddmmaaaatoaaaammdd(
              reg.data
            )}T${this.globalService
              .getUsuario()
              .man_hora_saida.trim()} GMT-0300`;

            reg.lancamento01.horasapon =
              minutostostohorasexagenal(
                DifHoras(
                  `${ddmmaaaatoaaaammdd(reg.data)}T${this.globalService
                    .getUsuario()
                    .man_hora_entrada.trim()}`,
                  `${ddmmaaaatoaaaammdd(reg.data)}T${this.globalService
                    .getUsuario()
                    .man_hora_saida.trim()}`
                )
              ) * -1;

            reg.lancamento01.id_empresa = this.globalService.getIdEmpresa();
            reg.lancamento01.id = 0;
            reg.lancamento01.id_projeto = 900000;
            reg.lancamento01.id_conta = '90';
            reg.lancamento01.id_subconta = '900101';
            reg.lancamento01.id_conta_versao = '0101';
            reg.lancamento01.id_subcliente = 50;
            reg.lancamento01.id_resp = 13;
            reg.lancamento01.id_exec = ponte.ponte.id;
            reg.lancamento01.id_motivo = '998002';
            reg.lancamento01.produtivo = 'S';
            reg.lancamento01.obs = 'GERADO AUTOMATICAMENTE';
            reg.lancamento01.encerramento = 'N';
            reg.lancamento01.user_insert = this.globalService.getUsuario().id;
            reg.lancamento01.user_update = 0;

            reg.lancamento02 = new ApoExecucaoModel();

            reg.lancamento02.inicial = `${ddmmaaaatoaaaammdd(
              reg.data
            )}T${this.globalService
              .getUsuario()
              .tard_hora_entrada.trim()} GMT-0300`;

            reg.lancamento02.final = `${ddmmaaaatoaaaammdd(
              reg.data
            )}T${this.globalService
              .getUsuario()
              .tard_hora_saida.trim()} GMT-0300`;

            reg.lancamento02.horasapon =
              minutostostohorasexagenal(
                DifHoras(
                  `${ddmmaaaatoaaaammdd(reg.data)}T${this.globalService
                    .getUsuario()
                    .tard_hora_entrada.trim()}`,
                  `${ddmmaaaatoaaaammdd(reg.data)}T${this.globalService
                    .getUsuario()
                    .tard_hora_saida.trim()}`
                )
              ) * -1;

            reg.lancamento02.id_empresa = this.globalService.getIdEmpresa();
            reg.lancamento02.id = 0;
            reg.lancamento02.id_projeto = 900000;
            reg.lancamento02.id_conta = '90';
            reg.lancamento02.id_subconta = '900101';
            reg.lancamento02.id_conta_versao = '0101';
            reg.lancamento02.id_subcliente = 50;
            reg.lancamento02.id_resp = 13;
            reg.lancamento02.id_exec = ponte.ponte.id;
            reg.lancamento02.id_motivo = '998002';
            reg.lancamento02.produtivo = 'S';
            reg.lancamento02.obs = 'GERADO AUTOMATICAMENTE';
            reg.lancamento02.encerramento = 'N';
            reg.lancamento02.user_insert = this.globalService.getUsuario().id;
            reg.lancamento02.user_update = 0;
            alter.feriado = reg;
          }
          if (ponte.acao == CadastroAcoes.Exclusao) {
            reg.id_empresa = this.globalService.id_empresa;
            reg.id_usuario = ponte.ponte.id;
            reg.data = this.gerador.value.data_ref;
            reg.descricao = this.gerador.value.descricao;
            reg.id_nivel = 0;
            reg.id_tipo = 2;
            reg.user_update = this.globalService.usuario.id;

            alter.feriado = reg;
          }
          this.allAlterPontes.push(alter);
        }
      });
      if (this.allAlterPontes.length > 0) {
        this.alterPontes();
      } else {
        this.appSnackBar.openWarningnackBar('Nada Para Ser Alterado', 'OK');
      }
    }
  }

  savePontes() {
    this.gravando = true;
    this.globalService.setSpin(true);
    this.inscricaoCrud = this.feriadoService
      .FeriadoAllPontes(this.allPontes)
      .subscribe(
        async (data: any) => {
          this.globalService.setSpin(false);
          this.setAcao(this.idAcao);
          this.allPontes = [];
          this.displayPontes = [];
          this.gravando = false;
          this.setAcao(this.idAcao);
          this.onRetorno();
        },
        (error: any) => {
          this.gravando = false;
          this.globalService.setSpin(false);
          this.setAcao(this.idAcao);
          this.appSnackBar.openWarningnackBar(
            `Erro Na Inclusão De Pontes ${messageError(error)}`,
            'OK'
          );
        }
      );
  }

  alterPontes() {
    this.globalService.setSpin(true);
    this.gravando = true;
    this.inscricaoCrud = this.feriadoService
      .FeriadoAlterPontes(this.allAlterPontes)
      .subscribe(
        async (data: any) => {
          this.globalService.setSpin(false);
          this.gravando = false;
          this.setAcao(this.idAcao);
          this.appSnackBar.openSuccessSnackBar(`${messageError(data)}`, 'OK');
          this.allPontes = [];
          this.displayPontes = [];
          this.onRetorno();
        },
        (error: any) => {
          this.globalService.setSpin(false);
          this.gravando = false;
          this.setAcao(this.idAcao);
          this.appSnackBar.openWarningnackBar(
            `Erro Na Alteracao De Pontes ${messageError(error)}`,
            'OK'
          );
        }
      );
  }

  loadPontes() {}

  onCancelGeracao() {
    this.pontes = [];
    this.onPosicaoInicial();
  }

  getLabelCancel() {
    if (this.idAcao == CadastroAcoes.Consulta) {
      return 'Voltar';
    } else {
      return 'Cancelar';
    }
  }

  NoValidtouchedOrDirtyGe(campo: string): boolean {
    if (
      !this.gerador.get(campo)?.valid &&
      (this.gerador.get(campo)?.touched || this.gerador.get(campo)?.dirty)
    ) {
      return true;
    }
    return false;
  }

  loadDisplayItens(data: UsuarioQuery_03Model[]): void {
    this.displayPontes = [];
    //adiciona todos
    const disp: DisplayPontes = new DisplayPontes();
    disp.checked = false;
    disp.vazia = true;
    disp.ponte = new UsuarioQuery_03Model();
    this.displayPontes.push(disp);
    data.forEach((obj) => {
      const disp: DisplayPontes = new DisplayPontes();
      disp.checked = false;
      disp.vazia = false;
      disp.acao = CadastroAcoes.None;
      disp.ponte = obj;
      this.displayPontes.push(disp);
    });
  }

  setAllItens(value: boolean): void {
    this.displayPontes.forEach((ponte) => {
      ponte.checked = value;
      if (this.idAcao == 98) {
        if (ponte.ponte.flag_ponte == 'S' && ponte.checked) {
          ponte.acao = CadastroAcoes.Exclusao;
        }
        if (ponte.ponte.flag_ponte == 'N' && ponte.checked) {
          ponte.acao = CadastroAcoes.Inclusao;
        }
        if (!ponte.checked) {
          ponte.acao = CadastroAcoes.None;
        }
      }
      if (this.idAcao == 99) {
        if (ponte.ponte.flag_ponte == 'S' && ponte.checked) {
          ponte.acao = CadastroAcoes.Exclusao;
        }
        if (ponte.ponte.flag_ponte == 'N' && ponte.checked) {
          ponte.acao = CadastroAcoes.Inclusao;
        }
        if (!ponte.checked) {
          ponte.acao = CadastroAcoes.None;
        }
      }
    });
  }

  setItens(value: boolean, ponte: DisplayPontes): void {
    let check: boolean = true;
    ponte.checked = value;
    if (this.idAcao == 98) {
      if (ponte.ponte.flag_ponte == 'S' && ponte.checked) {
        ponte.acao = CadastroAcoes.Exclusao;
      }
      if (ponte.ponte.flag_ponte == 'N' && ponte.checked) {
        ponte.acao = CadastroAcoes.Inclusao;
      }
      if (!ponte.checked) {
        ponte.acao = CadastroAcoes.None;
      }
    }
    if (this.idAcao == 99) {
      if (ponte.ponte.flag_ponte == 'S' && ponte.checked) {
        ponte.acao = CadastroAcoes.Exclusao;
      }
      if (ponte.ponte.flag_ponte == 'N' && ponte.checked) {
        ponte.acao = CadastroAcoes.Inclusao;
      }
      if (!ponte.checked) {
        ponte.acao = CadastroAcoes.None;
      }
    }
    this.displayPontes.forEach((obj) => {
      if (!obj.vazia) check = !obj.checked ? false : check;
    });
    this.displayPontes[0].checked = check;
  }

  getVisiblesPontes(): DisplayPontes[] {
    return this.displayPontes.filter((disp) => (!disp.vazia ? true : false));
  }

  onDelete(feriado: FeriadoModel) {
    const data: QuestionDialogData = new QuestionDialogData();
    data.mensagem01 = 'Confirma A Exclusão Da Ponte';
    data.mensagem02 = `${feriado.data} ${feriado.descricao}`;
    const dialogConfig = new MatDialogConfig();

    // The user can't close the dialog by clicking outside its body
    dialogConfig.disableClose = true;
    dialogConfig.id = 'question-dialog';
    dialogConfig.width = '600px';
    dialogConfig.data = data;
    const modalDialog = this.questionDialog
      .open(QuestionDialogComponent, dialogConfig)
      .beforeClosed()
      .subscribe((data: QuestionDialogData) => {
        if (data.resposta === 'S') {
          this.deleteFeriado(feriado);
        } else {
          this.onPosicaoInicial();
        }
      });
  }

  hasAuditores(): boolean {
    let retorno = false;
    if (this.gravando) {
      this.acao = 'Processando!';
      return false;
    }
    if (!this.gerador.valid) return retorno;
    if (this.gerador.valid && this.idAcao == 98) return true;
    if (this.displayPontes.length == 0) return retorno;
    if (this.displayPontes[0].checked) return true;
    this.displayPontes.forEach((usu) => {
      retorno = usu.checked ? true : retorno;
    });
    return retorno;
  }

  showAuditores(): boolean {
    let retorno = false;
    if (!this.gerador.valid) return retorno;
    if (this.displayPontes.length == 0) return true;
    return retorno;
  }

  //97 e 96
  posicaoVisualizarExcluirFeriados() {
    this.getFeriados();
  }

  //99 e 98
  posicaoIncluirAlterarPonte() {
    if (this.idAcao == 98) {
      this.getFeriados();
    } else {
      this.feriados = [];
    }
  }
}
