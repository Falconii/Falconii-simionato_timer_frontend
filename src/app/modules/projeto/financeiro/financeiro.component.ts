import { TituloProjetoModel } from './../../../Models/titulo-projetoModel';
import { TituloProjetoService } from './../../../services/titulo-projeto.service';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { ProjetoModel } from 'src/app/Models/projeto-model';
import { ParametroTituloProjeto01 } from 'src/app/parametros/parametro-titulo-projeto01';
import { GlobalService } from 'src/app/services/global.service';
import { ProjetosService } from 'src/app/services/projetos.service';
import { AppSnackbar } from 'src/app/shared/classes/app-snackbar';
import { CadastroAcoes } from 'src/app/shared/classes/cadastro-acoes';
import {
  DataDDMMYYYY,
  DataYYYYMMDD,
  MensagensBotoes,
  messageError,
} from 'src/app/shared/classes/util';
import { Gerador } from './gerador';
import { DecimalPipe } from '@angular/common';
import { ValidatorDate } from 'src/app/shared/Validators/validator-date';
import { ValidatorStringLen } from 'src/app/shared/Validators/validator-string-len';

@Component({
  selector: 'app-financeiro',
  templateUrl: './financeiro.component.html',
  styleUrls: ['./financeiro.component.css'],
})
export class FinanceiroComponent implements OnInit {
  gerador: FormGroup;
  cadastro: FormGroup;

  inscricaoGetTitulo!: Subscription;
  inscricaoGetTitulos!: Subscription;
  inscricaoGetProjeto!: Subscription;
  inscricaoCrud!: Subscription;
  inscricaoRota!: Subscription;

  titulo: TituloProjetoModel = new TituloProjetoModel();

  titulos: TituloProjetoModel[] = [];

  acao: string = 'Sem Definição';

  idAcao: number = CadastroAcoes.Inclusao;

  readOnly: boolean = true;

  labelCadastro: string = '';

  id_empresa: number = 0;

  id_projeto: number = 0;

  projeto: ProjetoModel = new ProjetoModel();

  dias_mes = [
    { id: -1, desc: 'Primeiro Dia' },
    { id: 0, desc: 'Último Dia' },
    { id: 1, desc: 'Dia 01' },
    { id: 2, desc: 'Dia 02' },
    { id: 3, desc: 'Dia 03' },
    { id: 4, desc: 'Dia 04' },
    { id: 5, desc: 'Dia 05' },
    { id: 6, desc: 'Dia 06' },
    { id: 7, desc: 'Dia 07' },
    { id: 8, desc: 'Dia 08' },
    { id: 9, desc: 'Dia 09' },
    { id: 10, desc: 'Dia 10' },
    { id: 11, desc: 'Dia 11' },
    { id: 12, desc: 'Dia 12' },
    { id: 13, desc: 'Dia 13' },
    { id: 14, desc: 'Dia 14' },
    { id: 15, desc: 'Dia 15' },
    { id: 16, desc: 'Dia 16' },
    { id: 17, desc: 'Dia 17' },
    { id: 18, desc: 'Dia 18' },
    { id: 19, desc: 'Dia 19' },
    { id: 20, desc: 'Dia 20' },
    { id: 21, desc: 'Dia 21' },
    { id: 22, desc: 'Dia 22' },
    { id: 23, desc: 'Dia 23' },
    { id: 24, desc: 'Dia 24' },
    { id: 25, desc: 'Dia 25' },
    { id: 26, desc: 'Dia 26' },
    { id: 27, desc: 'Dia 27' },
    { id: 28, desc: 'Dia 28' },
  ];

  arredondamento = [
    { id: 1, desc: '1ª PARC.' },
    { id: 2, desc: '2ª PARC.' },
    { id: 3, desc: 'NÃO USAR' },
  ];

  pula_fds = [
    { id: 1, desc: 'SIM' },
    { id: 2, desc: 'NÃO' },
  ];

  parcelas = [
    1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21,
    22, 23, 24,
  ];

  geradorParcelas: Gerador = new Gerador();

  totalParcelas: number = 0;

  constructor(
    private formBuilder: FormBuilder,
    private globalService: GlobalService,
    private tituloProjetoService: TituloProjetoService,
    public appSnackBar: AppSnackbar,
    private route: ActivatedRoute,
    private router: Router,
    private projetosService: ProjetosService,
    private decimalPipe: DecimalPipe
  ) {
    this.inscricaoRota = route.params.subscribe((params: any) => {
      this.id_empresa = params.id_empresa;
      this.id_projeto = params.id_projeto;
    });
    this.idAcao = 97;
    this.setAcao(97);
    this.gerador = formBuilder.group({
      data_ref: [{ value: 0 }, [ValidatorDate(true)]],
      vlr_total: [{ value: 0 }, [Validators.required, Validators.min(0.01)]],
      nro_parcelas: [{ value: 0 }],
      dia_mes: [{ value: 0 }],
      tipo_arredondamento: [{ value: 0 }],
      pula_fds: [{ value: 0 }],
      vlr_parcela: [{ value: 0 }],
      vlr_arredondamento: [{ value: 0 }],
    });
    this.setValueGerador();

    this.cadastro = formBuilder.group({
      data_vencto: [{ value: '' }, [ValidatorDate(true)]],
      data_pagto: [{ value: '' }, [ValidatorDate(false)]],
      valor: [{ value: '' }, [Validators.required, Validators.min(0.01)]],
      obs: [{ value: '' }, [ValidatorStringLen(0, 100, false)]],
    });
  }

  ngOnInit(): void {
    this.getProjeto();
  }

  ngOnDestroy(): void {
    this.inscricaoGetTitulo?.unsubscribe();
    this.inscricaoGetTitulos?.unsubscribe();
    this.inscricaoCrud?.unsubscribe();
    this.inscricaoRota?.unsubscribe();
    this.inscricaoGetProjeto?.unsubscribe();
  }

  setValueGerador() {
    this.gerador.setValue({
      data_ref: this.projeto.dataproj,
      vlr_total: this.decimalPipe.transform(this.projeto.valor, '1.2-2'),
      nro_parcelas: 1,
      dia_mes: -1,
      tipo_arredondamento: 1,
      pula_fds: 1,
      vlr_parcela: 0,
      vlr_arredondamento: 0,
    });
  }

  setValueCadastro() {
    this.cadastro.setValue({
      data_vencto: this.titulo.data_vencto,
      data_pagto: this.titulo.data_pagto,
      valor: this.decimalPipe.transform(this.titulo.valor, '1.2-2'),
      obs: this.titulo.obs,
    });
  }

  getProjeto() {
    this.inscricaoGetProjeto = this.projetosService
      .getProjeto(this.id_empresa, this.id_projeto)
      .subscribe(
        (data: ProjetoModel) => {
          this.projeto = data;
          this.getTitulos();
        },
        (error: any) => {
          this.projeto = new ProjetoModel();
          this.appSnackBar.openFailureSnackBar(
            `Pesquisa No Cadastro De Projetos ${messageError(error)}`,
            'OK'
          );
        }
      );
  }
  getTitulos() {
    let para = new ParametroTituloProjeto01();
    para.id_empresa = this.globalService.getIdEmpresa();
    para.id_projeto = this.id_projeto;
    para.orderby = 'Projeto';
    this.globalService.setSpin(true);
    this.inscricaoGetTitulos = this.tituloProjetoService
      .getTitulosProjeto_01(para)
      .subscribe(
        (data: TituloProjetoModel[]) => {
          this.globalService.setSpin(false);
          this.titulos = data;
          this.totalParcelas = 0;
          this.titulos.forEach((titulo) => {
            this.totalParcelas = this.totalParcelas + Number(titulo.valor);
          });
          this.onPosicaoInicial();
        },
        (error: any) => {
          this.globalService.setSpin(false);
          this.titulos = [];
          this.onPosicaoInicial();
          if (error.error.message != 'Nehuma Informação Para Esta Consulta.') {
            this.appSnackBar.openFailureSnackBar(
              `Pesquisa Nos Titulos ${messageError(error)}`,
              'OK'
            );
          }
        }
      );
  }

  getAcoes() {
    return CadastroAcoes;
  }

  escolha(opcao: number, titulo?: TituloProjetoModel) {
    if (typeof titulo !== 'undefined') {
      this.titulo = titulo;
      this.setValueCadastro();
      this.idAcao = opcao;
      this.setAcao(opcao);
    }
    if (opcao == CadastroAcoes.Inclusao) {
      this.titulo = new TituloProjetoModel();
      this.titulo.id_empresa = this.globalService.id_empresa;
      this.titulo.id_projeto = this.projeto.id;
      this.setValueCadastro();
      this.cadastro.markAsUntouched();
      this.idAcao = opcao;
      this.setAcao(opcao);
    }
    if (opcao == 99) {
      this.idAcao = opcao;
      this.setAcao(this.idAcao);
      this.setValueGerador();
    }
  }

  executaAcao() {
    let valor: string = this.cadastro.value.valor.toString();
    valor = valor.replace('.', '');
    valor = valor.replace(',', '.');
    this.titulo.data_pagto = this.cadastro.value.data_pagto;
    this.titulo.data_vencto = this.cadastro.value.data_vencto;
    if (this.titulo.data_pagto == null) this.titulo.data_pagto = '';
    this.titulo.valor = Number(valor);
    this.titulo.obs = this.cadastro.value.obs;
    this.globalService.setSpin(true);
    switch (+this.idAcao) {
      case CadastroAcoes.Inclusao:
        this.titulo.user_insert = this.globalService.getUsuario().id;
        this.inscricaoCrud = this.tituloProjetoService
          .TituloProjetoInsert(this.titulo)
          .subscribe(
            async (data: TituloProjetoModel) => {
              this.globalService.setSpin(false);
              this.getTitulos();
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
        this.titulo.user_update = this.globalService.getUsuario().id;
        this.inscricaoCrud = this.tituloProjetoService
          .TituloProjetoUpdate(this.titulo)
          .subscribe(
            async (data: any) => {
              this.globalService.setSpin(false);
              this.getTitulos();
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
        const searchRegExp = /\//g;
        this.inscricaoCrud = this.tituloProjetoService
          .TituloProjetoDelete(
            this.titulo.id_empresa,
            this.titulo.id_projeto,
            this.titulo.data_vencto.replace(searchRegExp, '_')
          )
          .subscribe(
            async (data: any) => {
              this.globalService.setSpin(false);
              this.getTitulos();
            },
            (error: any) => {
              this.globalService.setSpin(false);
              console.log(error);
              this.appSnackBar.openFailureSnackBar(
                `Erro Na Exclusão ${messageError(error)}`,
                'OK'
              );
            }
          );
        break;
      default:
        this.globalService.setSpin(false);
        break;
    }
  }

  setAcao(op: number) {
    if (op > 90) {
      //Gerador
      if (op == 99) {
        this.acao = 'Gerar';
        this.labelCadastro = 'Títulos -  Gerador De Parcelas';
      }
      if (op == 98) {
        this.acao = 'Gravar';
        this.labelCadastro = 'Títulos -  Cadastro De Parcelas';
      }
    } else {
      switch (+op) {
        case CadastroAcoes.Inclusao:
          this.acao = 'Gravar';
          this.labelCadastro = 'Títulos -  Inclusão.';
          this.readOnly = false;
          break;
        case CadastroAcoes.Edicao:
          this.acao = 'Gravar';
          this.labelCadastro = 'Títulos -  Alteração.';
          this.readOnly = false;
          break;
        case CadastroAcoes.Consulta:
          this.acao = 'Voltar';
          this.labelCadastro = 'Títulos -  Consulta.';
          this.readOnly = true;
          break;
        case CadastroAcoes.Exclusao:
          this.acao = 'Excluir';
          this.labelCadastro = 'Títulos -  Exclusão.';
          this.readOnly = true;
          break;
        default:
          break;
      }
    }
  }

  getTexto() {
    return MensagensBotoes;
  }

  onRetorno() {
    const par = this.globalService.estadoFind('projeto');
    if (par != null) {
      let config = par.getParametro();
      Object(config).new = false;
      Object(config).id_retorno = this.projeto.id;
      par.parametro = JSON.stringify(config);
      this.globalService.estadoSave(par);
    }
    this.router.navigate(['/projetos/projetos', 'SIM']);
  }

  onHome() {
    this.router.navigate(['']);
  }
  onPosicaoInicial() {
    this.idAcao = 97;
    this.setAcao(97);
  }
  onGerarParcelas() {
    if (this.gerador.valid) {
      this.geracaoDeParcelas();
    } else {
      this.gerador.markAllAsTouched();
      this.appSnackBar.openSuccessSnackBar(
        `Formulário Com Campos Inválidos.`,
        'OK'
      );
    }
  }

  onGravarParcelas() {
    if (this.gerador.valid) {
      this.saveParcelas();
    } else {
      this.gerador.markAllAsTouched();
      this.appSnackBar.openSuccessSnackBar(
        `Formulário Com Campos Inválidos.`,
        'OK'
      );
    }
  }

  saveParcelas() {
    this.globalService.setSpin(true);
    this.inscricaoCrud = this.tituloProjetoService
      .tituloProjetoSaveAll(this.titulos)
      .subscribe(
        async (data: any) => {
          this.globalService.setSpin(false);
          this.appSnackBar.openSuccessSnackBar(`${messageError(data)}`, 'OK');
          setTimeout(() => this.getTitulos(), 1500);
        },
        (error: any) => {
          this.globalService.setSpin(false);
          this.appSnackBar.openFailureSnackBar(
            `Erro Na Inclusão ${messageError(error)}`,
            'OK'
          );
        }
      );
  }

  geracaoDeParcelas() {
    this.titulos = [];
    this.calculo();
    this.gerador.patchValue({
      vlr_parcela: this.decimalPipe.transform(
        this.geradorParcelas.vlr_parcela,
        '1.2-2'
      ),
      vlr_arredondamento: this.decimalPipe.transform(
        this.geradorParcelas.vlr_arredondamento,
        '1.2-2'
      ),
    });
    this.loadParcelas();
  }

  loadGerador() {
    let valor: string = this.gerador.value.vlr_total.toString();
    valor = valor.replace('.', '');
    valor = valor.replace(',', '.');
    const day: number = this.gerador.value.dia_mes;
    const tipo: number = this.gerador.value.tipo_arredondamento;
    this.geradorParcelas.vlr_total = Number(valor);
    this.geradorParcelas.nro_parcelas = this.gerador.value.nro_parcelas;
    this.geradorParcelas.day = day > 0 ? day : 0;
    this.geradorParcelas.first_day = day == -1 ? true : false;
    this.geradorParcelas.last_day = day == 0 ? true : false;
    this.geradorParcelas.vlr_parcela = this.gerador.value.vlr_parcela;
    this.geradorParcelas.tipo_arredondamento = tipo;
    this.geradorParcelas.skip_weekend =
      this.gerador.value.pula_fds == 1 ? true : false;
  }

  calculo() {
    this.loadGerador();
    if (this.geradorParcelas.tipo_arredondamento < 3) {
      this.geradorParcelas.vlr_parcela = Math.trunc(
        this.geradorParcelas.vlr_total / this.geradorParcelas.nro_parcelas
      );
      this.geradorParcelas.vlr_parcela = Number(
        this.geradorParcelas.vlr_parcela.toFixed(2)
      );
      this.geradorParcelas.vlr_arredondamento =
        this.geradorParcelas.vlr_total % this.geradorParcelas.nro_parcelas;
      this.geradorParcelas.vlr_arredondamento = Number(
        this.geradorParcelas.vlr_arredondamento.toFixed(2)
      );
    } else {
      this.geradorParcelas.vlr_parcela =
        this.geradorParcelas.vlr_total / this.geradorParcelas.nro_parcelas;
      this.geradorParcelas.vlr_parcela = Number(
        this.geradorParcelas.vlr_parcela.toFixed(2)
      );

      this.geradorParcelas.vlr_arredondamento = 0;
    }
  }

  loadParcelas() {
    const ref = this.gerador.value.data_ref.split('/');
    let dia: number = this.geradorParcelas.day;
    let mes: number = Number(ref[1]) - 1;
    let ano: number = Number(ref[2]);
    this.titulos = [];
    if (this.geradorParcelas.first_day) {
      dia = 1;
    }
    if (this.geradorParcelas.last_day) {
      dia = new Date(ano, mes + 1, 0).getDate();
    }
    let data_trab: Date = new Date(ano, mes, dia);
    for (let x = 1; x <= this.geradorParcelas.nro_parcelas; x++) {
      let titulo: TituloProjetoModel = new TituloProjetoModel();
      let data_lanca: Date = data_trab;
      if (this.geradorParcelas.skip_weekend) {
        if (data_lanca.getDay() == 0) {
          data_lanca.setDate(data_lanca.getDate() + 1);
        }
        if (data_lanca.getDay() == 6) {
          data_lanca.setDate(data_lanca.getDate() + 2);
        }
      }
      titulo.id_empresa = this.id_empresa;
      titulo.id_projeto = this.id_projeto;
      titulo.user_insert = this.globalService.getUsuario().id;

      titulo.data_vencto = DataDDMMYYYY(data_lanca);
      titulo.data_pagto = '';
      titulo.valor = this.geradorParcelas.vlr_parcela;
      if (this.geradorParcelas.tipo_arredondamento == 1) {
        if (x == 1) {
          titulo.valor =
            this.geradorParcelas.vlr_parcela +
            this.geradorParcelas.vlr_arredondamento;
        }
      }
      if (this.geradorParcelas.tipo_arredondamento == 2) {
        if (x == this.geradorParcelas.nro_parcelas) {
          titulo.valor =
            this.geradorParcelas.vlr_parcela +
            this.geradorParcelas.vlr_arredondamento;
        }
      }
      titulo.obs = '';
      this.titulos.push(titulo);
      if (mes < 11) {
        mes++;
      } else {
        mes = 0;
        ano++;
      }
      if (this.geradorParcelas.last_day) {
        dia = new Date(ano, mes + 1, 0).getDate();
      }
      data_trab = new Date(ano, mes, dia);
    }
    this.totalParcelas = 0;
    this.titulos.forEach(
      (titulo) => (this.totalParcelas = this.totalParcelas + titulo.valor)
    );
  }

  onSubmit() {
    if (this.cadastro.valid || this.idAcao == CadastroAcoes.Exclusao) {
      this.executaAcao();
    } else {
      this.cadastro.markAllAsTouched();
      this.appSnackBar.openSuccessSnackBar(
        `Formulário Com Campos Inválidos.`,
        'OK'
      );
    }
  }

  onCancelGeracao() {
    this.titulos = [];
    this.onPosicaoInicial();
  }

  getLabelCancel() {
    if (this.idAcao == CadastroAcoes.Consulta) {
      return 'Voltar';
    } else {
      return 'Cancelar';
    }
  }

  NoValidtouchedOrDirtyCd(campo: string): boolean {
    if (
      !this.cadastro.get(campo)?.valid &&
      (this.cadastro.get(campo)?.touched || this.cadastro.get(campo)?.dirty)
    ) {
      return true;
    }
    return false;
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
}
