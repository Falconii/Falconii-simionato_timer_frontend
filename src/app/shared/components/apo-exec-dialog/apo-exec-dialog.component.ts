import { AponExecucaoService } from './../../../services/apon-execucao.service';
import { MotivoApoService } from './../../../services/motivo-apo.service';
import { GlobalService } from './../../../services/global.service';
import { Component, Inject, OnInit } from '@angular/core';
import { ApoExecData } from './apo-exec-data';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import {
  DifHoras,
  aaaammddddmmaaaa,
  getHora,
  getMinuto,
  messageError,
  minutostostohorasexagenal,
  setHorario,
} from '../../classes/util';
import { CadastroAcoes } from '../../classes/cadastro-acoes';
import { Subscription, Unsubscribable } from 'rxjs';
import { ParametroMotivoApo01 } from 'src/app/parametros/parametro-motivo-apo01';
import { MotivoApoModel } from 'src/app/Models/motivo-apo-model';
import { AppSnackbar } from '../../classes/app-snackbar';

@Component({
  selector: 'app-apo-exec-dialog',
  templateUrl: './apo-exec-dialog.component.html',
  styleUrls: ['./apo-exec-dialog.component.css'],
})
export class ApoExecDialogComponent implements OnInit {
  inscricaoMotivos!: Subscription;
  inscricaoAcao!: Subscription;
  formulario: FormGroup;
  idAcao: number = 0;
  acao: string = '';
  labelCadastro: string = '';
  readOnly: boolean = false;
  motivos: MotivoApoModel[] = [];
  gravando: boolean = false;
  focusEntrada: boolean = false;
  focusCancelar: boolean = false;

  constructor(
    private formBuilder: FormBuilder,
    public dialogRef: MatDialogRef<ApoExecDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: ApoExecData,
    private globalService: GlobalService,
    private motivoApoService: MotivoApoService,
    private appSnackBar: AppSnackbar,
    private aponExecucaoService: AponExecucaoService
  ) {
    this.formulario = formBuilder.group({
      entrada: [{ value: '' }, [Validators.required]],
      saida: [{ value: '' }, [Validators.required]],
      atividade: [{ value: '' }, [Validators.required]],
      cliente: [{ value: '' }, [Validators.required]],
      motivo: [{ value: '' }, [Validators.required]],
      encerra: [{ value: '' }, [Validators.required]],
      obs: [{ value: '' }, [Validators.required, Validators.maxLength(150)]],
    });
  }

  ngOnInit(): void {
    this.getMotivos();
    this.idAcao = this.data.opcao;
    this.setAcao(this.idAcao);
  }

  ngOnDestroy(): void {
    this.inscricaoMotivos?.unsubscribe();
    this.inscricaoAcao?.unsubscribe();
  }

  actionFunction() {
    if (this.formulario.valid || this.idAcao == CadastroAcoes.Exclusao) {
      this.executaAcao();
    } else {
      this.formulario.markAllAsTouched();
      this.appSnackBar.openSuccessSnackBar(
        `Formulário Com Campos Inválidos.`,
        'OK'
      );
    }
  }

  closeModal() {
    this.dialogRef.close();
  }

  getAcoes() {
    return CadastroAcoes;
  }

  setAcao(op: number) {
    this.focusEntrada = false;
    this.focusCancelar = false;
    switch (+op) {
      case CadastroAcoes.Edicao:
        this.acao = 'Gravar';
        this.labelCadastro = `Alteração - ${aaaammddddmmaaaa(
          this.data.apontamento.inicial
        )}`;
        this.readOnly = false;
        this.focusEntrada = true;
        break;
      case CadastroAcoes.Consulta:
        this.acao = 'Voltar';
        this.labelCadastro = `Consulta - ${aaaammddddmmaaaa(
          this.data.apontamento.inicial
        )}`;
        this.readOnly = true;
        this.focusCancelar = true;
        break;
      case CadastroAcoes.Exclusao:
        this.acao = 'Excluir';
        this.labelCadastro = `Exclusão - ${aaaammddddmmaaaa(
          this.data.apontamento.inicial
        )}`;
        this.focusEntrada = false;
        this.readOnly = true;
        break;
      default:
        this.acao = '';
        this.labelCadastro = '';
        break;
    }
  }

  executaAcao() {
    this.data.processar = true;
    let dataDia: Date = new Date();
    dataDia.setTime(Date.parse(this.data.apontamento.inicial));
    this.data.apontamento.inicial = setHorario(
      dataDia,
      getHora(this.formulario.value.entrada),
      getMinuto(this.formulario.value.entrada)
    );
    this.data.apontamento.final = setHorario(
      dataDia,
      getHora(this.formulario.value.saida),
      getMinuto(this.formulario.value.saida)
    );
    this.data.apontamento.horasapon = minutostostohorasexagenal(
      DifHoras(this.data.apontamento.inicial, this.data.apontamento.final)
    );
    this.data.apontamento.id_motivo = this.formulario.value.id_motivo;
    this.data.apontamento.obs = this.formulario.value.obs;
    this.data.apontamento.encerramento = this.formulario.value.encerra
      ? 'S'
      : 'N';
    switch (+this.idAcao) {
      case CadastroAcoes.Edicao:
        this.data.apontamento.user_update = this.globalService.getUsuario().id;
        this.inscricaoAcao = this.aponExecucaoService
          .ApoExecucaoUpdate(this.data.apontamento)
          .subscribe(
            async (data: any) => {
              this.closeModal();
            },
            (error: any) => {
              this.gravando = false;
              console.log('Error', error.error);
              this.appSnackBar.openFailureSnackBar(
                `${error.error.tabela} - ${error.error.erro} - ${error.error.message}`,
                'OK'
              );
            }
          );
        break;
      case CadastroAcoes.Exclusao:
        this.inscricaoAcao = this.aponExecucaoService
          .ApoExecucaoDelete(
            this.data.apontamento.id_empresa,
            this.data.apontamento.id
          )
          .subscribe(
            async (data: any) => {
              this.closeModal();
            },
            (error: any) => {
              this.gravando = false;
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
  getLabelCancel() {
    if (this.idAcao == CadastroAcoes.Consulta) {
      return 'Voltar';
    } else {
      return 'Cancelar';
    }
  }

  setValue() {
    let motivo: string = '';
    const motivos = this.motivos.filter(
      (data) => data.codigo == this.data.apontamento.id_motivo
    );
    if (motivos.length > 0) motivo = motivos[0].motivo;
    this.formulario.setValue({
      entrada: this.data.apontamento.inicial.substring(
        this.data.apontamento.inicial.indexOf(' ') + 1,
        16
      ),
      saida: this.data.apontamento.final.substring(
        this.data.apontamento.final.indexOf(' ') + 1,
        16
      ),
      atividade: this.data.apontamento.estru_descricao,
      cliente: this.data.apontamento.cli_razao,
      motivo: motivo,
      encerra: this.data.apontamento.encerramento == 'S' ? true : false,
      obs: this.data.apontamento.obs,
    });
  }
  getMotivos() {
    let para = new ParametroMotivoApo01();
    para.id_empresa = 1;
    para.analitico = 'S';
    para.orderby = 'Código';
    para.controle = '';
    this.globalService.setSpin(true);
    this.inscricaoMotivos = this.motivoApoService
      .getMotivoApos_01(para)
      .subscribe(
        (data: MotivoApoModel[]) => {
          this.globalService.setSpin(false);
          this.motivos = data;
          this.setValue();
        },
        (error: any) => {
          this.globalService.setSpin(false);
          this.motivos = [];
          this.appSnackBar.openFailureSnackBar(
            `Pesquisa Motivos Apontamentos ${messageError(error)}`,
            'OK'
          );
        }
      );
  }

  onManha() {
    this.data.apontamento.inicial =
      this.data.apontamento.inicial.substring(
        0,
        this.data.apontamento.final.indexOf(' ') + 1
      ) + this.globalService.getUsuario().man_hora_entrada;
    this.data.apontamento.final =
      this.data.apontamento.final.substring(
        0,
        this.data.apontamento.final.indexOf(' ') + 1
      ) + this.globalService.getUsuario().man_hora_saida;
    this.formulario.patchValue({
      entrada: this.data.apontamento.inicial.substring(
        this.data.apontamento.inicial.indexOf(' ') + 1,
        16
      ),
      saida: this.data.apontamento.final.substring(
        this.data.apontamento.final.indexOf(' ') + 1,
        16
      ),
    });
  }
  onTarde() {
    let lastTime = '';
    let hoje: Date = new Date(this.data.apontamento.inicial);
    if (hoje.getDay() == 5) {
      lastTime = '16:33';
    } else {
      lastTime = this.globalService.getUsuario().tard_hora_saida;
    }
    this.data.apontamento.inicial =
      this.data.apontamento.inicial.substring(
        0,
        this.data.apontamento.inicial.indexOf(' ') + 1
      ) + this.globalService.getUsuario().tard_hora_entrada;
    this.data.apontamento.final =
      this.data.apontamento.final.substring(
        0,
        this.data.apontamento.final.indexOf(' ') + 1
      ) + lastTime;
    this.formulario.patchValue({
      entrada: this.data.apontamento.inicial.substring(
        this.data.apontamento.inicial.indexOf(' ') + 1,
        16
      ),
      saida: this.data.apontamento.final.substring(
        this.data.apontamento.final.indexOf(' ') + 1,
        16
      ),
    });
  }
  onAlmoco() {
    this.data.apontamento.inicial =
      this.data.apontamento.inicial.substring(
        0,
        this.data.apontamento.inicial.indexOf(' ') + 1
      ) + '12:00';
    this.data.apontamento.final =
      this.data.apontamento.final.substring(
        0,
        this.data.apontamento.final.indexOf(' ') + 1
      ) + '13:00';
    this.formulario.patchValue({
      entrada: this.data.apontamento.inicial.substring(
        this.data.apontamento.inicial.indexOf(' ') + 1,
        16
      ),
      saida: this.data.apontamento.final.substring(
        this.data.apontamento.final.indexOf(' ') + 1,
        16
      ),
    });
  }
}
