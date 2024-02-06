import { GlobalService } from 'src/app/services/global.service';
import { NivelEstrutura } from '../../../shared/classes/nivel-estrutura';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ActivatedRoute, Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { EstruturaModel } from 'src/app/Models/estrutura-model';
import { ParametroEstrutura01 } from 'src/app/parametros/parametro-estrutura01';
import { EstruturasService } from 'src/app/services/estruturas.service';
import { CadastroAcoes } from 'src/app/shared/classes/cadastro-acoes';
import { SimNao } from 'src/app/shared/classes/sim-nao';
import { TipoConta } from 'src/app/shared/classes/tipo-conta';
import { ValidatorStringLen } from 'src/app/shared/Validators/validator-string-len';
import { TabelaNivel } from 'src/app/shared/classes/tabela-nivel';
import { AppSnackbar } from 'src/app/shared/classes/app-snackbar';

@Component({
  selector: 'app-tree-estrutura-v2',
  templateUrl: './tree-estrutura-v2.component.html',
  styleUrls: ['./tree-estrutura-v2.component.css'],
})
export class TreeEstruturaV2Component implements OnInit {
  formulario: FormGroup;

  estrutura: EstruturaModel = new EstruturaModel();

  erro: any;

  acao: string = 'Sem Definição';

  idAcao: number = 99;

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
  inscricaoAcao!: Subscription;
  inscricaoSaveAll!: Subscription;
  durationInSeconds = 2;

  labelCadastro: string = '';

  inscricaoRota!: Subscription;
  inscricaoGetFiltro!: Subscription;

  id_empresa: number = 0;
  conta: string = '';
  versao: string = '';
  subconta: string = '';
  descricao: string = '';
  nivel: number = 0;

  maxNivel: number = 7;

  estruturas: EstruturaModel[] = [];

  estru: EstruturaModel = new EstruturaModel();

  index: number = 0;

  contadores: number[] = [0, 0, 0, 0, 0, 0, 0, 0, 0];

  niveis: NivelEstrutura[] = [
    { nivel: 1, descricao: 'NIvel 01' },
    { nivel: 2, descricao: 'NIvel 02' },
    { nivel: 3, descricao: 'NIvel 03' },
    { nivel: 4, descricao: 'NIvel 04' },
    { nivel: 5, descricao: 'NIvel 05' },
    { nivel: 6, descricao: 'NIvel 06' },
    { nivel: 7, descricao: 'Todos Os Níveis' },
  ];

  parametros: FormGroup;

  log: boolean = false;

  log2: boolean = true;

  lsEstruturas: EstruturaModel[] = [];

  lsNIveis: TabelaNivel[] = [];

  indexEstrutura: number = 0;

  constructor(
    private estruturaService: EstruturasService,
    private route: ActivatedRoute,
    private router: Router,
    private appSnackBar: AppSnackbar,
    private formBuilder: FormBuilder,
    private globalService: GlobalService
  ) {
    this.inscricaoRota = this.route.params.subscribe((params: any) => {
      this.id_empresa = params.id_empresa;
      this.conta = params.conta;
      this.versao = params.versao;
      this.subconta = params.subconta;
      this.descricao = params.descricao;
      this.nivel = params.nivel;
    });
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
    this.parametros = formBuilder.group({
      nivel: [null],
    });
    this.estrutura = new EstruturaModel();
    this.contadores[0] = 1;
    this.contadores[1] = +this.conta;
    this.setParametros();
  }

  ngOnInit(): void {
    this.idAcao = 99;
    this.setAcao(this.idAcao);
    this.getEstruturas();
  }

  ngOnDestroy(): void {
    this.inscricaoRota?.unsubscribe();
    this.inscricaoGetFiltro?.unsubscribe();
    this.inscricaoSaveAll?.unsubscribe();
  }

  getEstruturas() {
    let par = new ParametroEstrutura01();

    par.id_empresa = this.id_empresa;

    par.conta = this.conta;

    par.versao = this.versao;

    par.orderby = 'SubConta';

    if (this.globalService.getUsuario().id == 16) par.controle = '';

    this.globalService.setSpin(true);
    this.inscricaoGetFiltro = this.estruturaService
      .getEstruturas(par)
      .subscribe(
        (data: EstruturaModel[]) => {
          this.globalService.setSpin(false);
          this.estruturas = data;
        },
        (error: any) => {
          this.globalService.setSpin(false);
          this.estruturas = [];
          this.appSnackBar.openFailureSnackBar(
            `Pesquisa Nas Estruturas ${error.error.tabela} - ${error.error.erro} - ${error.error.message}`,
            'OK'
          );
        }
      );
  }

  onRetorno() {
    this.router.navigate(['/estruturas']);
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

  setParametros() {
    this.parametros.setValue({
      nivel: this.maxNivel,
    });
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
    this.idAcao = 99;
  }

  executaAcao() {
    this.estrutura.conta = this.formulario.value.conta;
    this.estrutura.versao = this.formulario.value.versao;
    this.estrutura.subconta = this.formulario.value.subconta;
    this.estrutura.descricao = this.formulario.value.descricao;
    this.estrutura.nivel = this.formulario.value.nivel;
    this.estrutura.tipo = this.formulario.value.tipo;
    this.estrutura.controle = this.formulario.value.controle;
    switch (+this.idAcao) {
      case CadastroAcoes.Inclusao:
        this.IncluirConta();
        this.idAcao = 99;
        this.setAcao(this.idAcao);
        break;
      case CadastroAcoes.Edicao:
        this.estruturas[this.indexEstrutura] = this.estrutura;
        this.idAcao = 99;
        this.setAcao(this.idAcao);
        break;
      case CadastroAcoes.Exclusao:
        this.deleteEstrutura(this.estrutura.subconta);
        this.idAcao = 99;
        this.setAcao(this.idAcao);
        break;
      case CadastroAcoes.Gravacao:
        break;
      default:
        break;
    }
  }

  onFiltrar() {
    this.maxNivel = this.parametros.value.nivel;
  }
  delay(ms: number) {
    return new Promise((resolve) => setTimeout(resolve, ms));
  }

  getLabelCancel() {
    if (this.idAcao == CadastroAcoes.Consulta) {
      return 'Voltar';
    } else {
      return 'Cancelar';
    }
  }

  escolha(estru: EstruturaModel, opcao: number, index: number) {
    if (opcao == 99) {
      this.idAcao = opcao;
    } else {
      this.estrutura = new EstruturaModel();
      this.estrutura.id_empresa = estru.id_empresa;
      this.estrutura.conta = estru.conta;
      this.estrutura.versao = estru.versao;
      this.estrutura.subconta = estru.subconta;
      this.estrutura.nivel = estru.nivel;
      this.estrutura.nivel_maxi = estru.nivel_maxi;
      this.estrutura.tipo = estru.tipo;
      this.estrutura.descricao = estru.descricao;
      this.estrutura.user_insert = estru.user_insert;
      this.estrutura.user_update = estru.user_update;
      this.estrutura.status = estru.status;
      this.idAcao = opcao;
      this.indexEstrutura = index;
      this.setValue();
      this.setAcao(this.idAcao);
    }
  }

  setAcao(op: number) {
    if (op == 99) {
      this.labelCadastro =
        'Estruturas: ' +
        this.descricao +
        ' Versão: ' +
        this.versao.substring(0, 2) +
        '.' +
        this.versao.substring(2, 4);
    } else {
      switch (+op) {
        case CadastroAcoes.Inclusao:
          this.acao = 'Gravar';
          this.labelCadastro = 'Estruturas - Inclusão Novo Tópico';
          this.readOnly = false;
          break;
        case CadastroAcoes.Edicao:
          this.acao = 'Gravar';
          this.labelCadastro = 'Estruturas - Alteração.';
          this.readOnly = false;
          break;
        case CadastroAcoes.Consulta:
          this.acao = 'Voltar';
          this.labelCadastro = 'Estruturas - Consulta.';
          this.readOnly = true;
          break;
        case CadastroAcoes.Exclusao:
          this.acao = 'Excluir';
          this.labelCadastro = 'Estruturas - Exclusão.';
          this.readOnly = true;
          break;
        default:
          break;
      }
    }
  }

  addLeadingZeros(num: number, totalLength: number): string {
    return String(num).padStart(totalLength, '0');
  }

  showNivel(nivel: number): boolean {
    var retorno: boolean = false;
    if (nivel <= this.maxNivel) {
      retorno = true;
    } else {
      retorno = false;
    }
    return retorno;
  }

  getSpace(nivel: number): string {
    var retorno: string = '';
    for (var x = 0; x < nivel; x++) {
      retorno += '&#160';
    }
    return retorno;
  }

  onIncluirSubConta(estru: EstruturaModel, index: number) {
    this.estru = estru;
    this.index = index;
    this.idAcao = CadastroAcoes.Inclusao;
    this.setAcao(this.idAcao);
    this.estrutura = new EstruturaModel();
    this.estrutura.id_empresa = estru.id_empresa;
    this.estrutura.conta = estru.conta;
    this.estrutura.versao = estru.versao;
    this.estrutura.subconta = estru.subconta.trim() + 'XX';
    this.estrutura.nivel = estru.nivel + 1;
    this.estrutura.descricao = '';
    this.estrutura.tipo = estru.tipo;
    this.estrutura.status = estru.status;
    this.estrutura.user_insert = 1;
    this.setValue();
  }
  onIncluirConta(estru: EstruturaModel, index: number) {
    this.estru = estru;
    this.index = index;
    this.idAcao = CadastroAcoes.Inclusao;
    this.setAcao(this.idAcao);
    this.estrutura = new EstruturaModel();
    this.estrutura.id_empresa = estru.id_empresa;
    this.estrutura.conta = estru.conta;
    this.estrutura.versao = estru.versao;
    this.estrutura.subconta =
      estru.subconta.substring(0, (estru.nivel - 1) * 2) + 'XX';
    this.estrutura.nivel = estru.nivel;
    this.estrutura.descricao = '';
    this.estrutura.tipo = estru.tipo;
    this.estrutura.status = 1;
    this.estrutura.user_insert = 1;
    this.setValue();
  }

  IncluirConta() {
    var tabelaNivel: TabelaNivel = new TabelaNivel();
    var nivel: number = 1;
    this.estruturas.splice(this.index + 1, 0, this.estrutura);
    this.lsNIveis = [];
    //Monta a tabela de chaves novas
    for (nivel = 1; nivel <= 7; nivel++)
      this.estruturas.forEach((obj) => {
        if (obj.nivel == nivel) {
          this.addNivel(obj.subconta, obj.nivel);
        }
      });
    this.lsNIveis = this.lsNIveis.sort((a, b) => {
      if (a.subNivelOld < b.subNivelOld) {
        return -1;
      }
      if (a.subNivelOld > b.subNivelOld) {
        return 1;
      }
      return 0;
    });
    console.log('Tabela De Niveis Montada:');
    this.lsNIveis.forEach((n) => {
      console.log('==>', n);
    });
    for (var i = 0; i < this.estruturas.length; i++) {
      tabelaNivel = this.searchNivel(
        this.estruturas[i].subconta.trim(),
        this.estruturas[i].nivel
      );
      if (tabelaNivel.ct == -1) {
        console.log('Nao achei..', this.estruturas[i].subconta);
      } else {
        console.log(
          this.estruturas[i].subconta,
          'Old',
          tabelaNivel.subNivelOld,
          'New',
          tabelaNivel.subNivelNew
        );
        this.estruturas[i].subconta = tabelaNivel.subNivelNew;
      }
    }
    this.estruturas = this.estruturas.sort((a, b) => {
      if (a.subconta < b.subconta) {
        return -1;
      }
      if (a.subconta > b.subconta) {
        return 1;
      }
      return 0;
    });
    return;
  }

  addNivel(subconta: string, nivel: number): TabelaNivel {
    var tabelaNivel = new TabelaNivel();
    var menos: number = 0;
    var anterior: TabelaNivel = new TabelaNivel();
    var old: string = subconta;
    tabelaNivel.ct = -1;
    if (nivel > 1) {
      menos = 1;
    }
    if (tabelaNivel.ct == -1) {
      if (nivel == 1) {
        tabelaNivel.ct = 0;
        tabelaNivel.nivel = nivel;
        tabelaNivel.subNivelOld = subconta.trim();
        tabelaNivel.subNivelNew = subconta.trim();
        this.lsNIveis.push(tabelaNivel);
      } else {
        tabelaNivel.ct = 0;
        tabelaNivel.nivel = nivel;
        tabelaNivel.subNivelOld = old;
        anterior = this.searchContador(
          tabelaNivel.subNivelOld,
          tabelaNivel.nivel
        );
        //if (anterior.ct != -1) tabelaNivel.ct = anterior.ct;
        tabelaNivel.ct = 0;
        console.log('Existe..:', old, anterior);
        tabelaNivel.subNivelNew =
          anterior.subNivelNew + this.addLeadingZeros(anterior.ct, 2);
        this.lsNIveis.push(tabelaNivel);
        console.log('Existe..:', old, anterior);
      }
    }
    return tabelaNivel;
  }

  searchNivel(subnivel: string, nivel: number): TabelaNivel {
    var tabelaNivel: TabelaNivel = new TabelaNivel();
    tabelaNivel.ct = -1;
    this.lsNIveis.forEach((o) => {
      if (o.nivel == nivel && o.subNivelOld.trim() == subnivel.trim()) {
        tabelaNivel.nivel = o.nivel;
        tabelaNivel.subNivelOld = o.subNivelOld;
        tabelaNivel.subNivelNew = o.subNivelNew;
        tabelaNivel.ct = o.ct;
        stop;
      }
    });
    return tabelaNivel;
  }

  searchContador(atual: string, nivel: number): TabelaNivel {
    var tabelaNivel: TabelaNivel = new TabelaNivel();
    tabelaNivel.ct = -1;
    var nivelNew: string = '';
    nivel--;
    this.lsNIveis.forEach((data) => {
      if (
        atual.substring(0, nivel * 2) ==
          data.subNivelOld.substring(0, nivel * 2) &&
        data.nivel == nivel
      ) {
        data.ct = ++data.ct;
        tabelaNivel = data;
      }
    });
    return tabelaNivel;
  }

  searchNivelNew(subnivel: string, nivel: number): TabelaNivel {
    var tabelaNivel: TabelaNivel = new TabelaNivel();
    tabelaNivel.ct = -1;
    this.lsNIveis.forEach((o) => {
      if (o.nivel == nivel && o.subNivelOld.trim() == subnivel.trim()) {
        tabelaNivel.ct = 0;
        tabelaNivel.nivel = nivel;
        tabelaNivel.subNivelOld = subnivel.trim();
        tabelaNivel.subNivelNew = o.subNivelNew.trim();
      }
    });
    if (tabelaNivel.ct == -1) {
      tabelaNivel.ct = 0;
      tabelaNivel.nivel = nivel;
      tabelaNivel.subNivelOld = subnivel;
      tabelaNivel.subNivelNew = '????';
    }
    return tabelaNivel;
  }

  subContas(radical: string, passagem: number) {
    var ct: number = 0;
    var oldRadical: string = '';
    var menos: number = 0;
    console.log('Passei ', radical, passagem);
    if (passagem == 1) {
      menos = 1;
    } else {
      menos = 1;
      console.log('Passagem 2', radical);
    }
    for (var i: number = 0; i < this.estruturas.length; i++) {
      if (this.estruturas[i].nivel == 1) {
        continue;
      }
      if (
        radical ==
        this.estruturas[i].subconta.substring(
          0,
          (this.estruturas[i].nivel - menos) * 2
        )
      ) {
        console.log(
          'Estrutura',
          this.estruturas[i].subconta,
          this.estruturas[i].descricao
        );
        oldRadical = this.estruturas[i].subconta.substring(
          0,
          this.estru.nivel * 2
        );
      }
    }
  }

  deleteEstrutura(subconta: string) {
    var tabelaNivel: TabelaNivel = new TabelaNivel();
    var nivel: number = 1;
    this.lsNIveis = [];
    //
    this.estruturas = this.estruturas.filter(
      (data) =>
        data.subconta.trim().substring(0, subconta.trim().length) !==
        subconta.trim()
    );
    this.onOrdenar();
    return;
  }

  novoVersao(): string {
    var versao: string = this.versao;

    var p1 = this.versao.substring(0, 2);

    var p2 = this.versao.substring(2, 4);

    if (!isNaN(Number(p2))) {
      var newVersion = Number(p2);
      versao = `${p1}${this.addLeadingZeros(++newVersion, 2)}`;
    } else {
      this.appSnackBar.openFailureSnackBar('Erro Na Versão', 'OK');
    }

    return versao;
  }
  onOrdenar() {
    var tabelaNivel: TabelaNivel = new TabelaNivel();
    var nivel: number = 1;
    this.lsNIveis = [];
    //Monta a tabela de chaves novas
    for (nivel = 1; nivel <= 7; nivel++)
      this.estruturas.forEach((obj) => {
        if (obj.nivel == nivel) {
          this.addNivel(obj.subconta, obj.nivel);
        }
      });
    this.lsNIveis = this.lsNIveis.sort((a, b) => {
      if (a.subNivelOld < b.subNivelOld) {
        return -1;
      }
      if (a.subNivelOld > b.subNivelOld) {
        return 1;
      }
      return 0;
    });
    for (var i = 0; i < this.estruturas.length; i++) {
      tabelaNivel = this.searchNivel(
        this.estruturas[i].subconta.trim(),
        this.estruturas[i].nivel
      );
      this.estruturas[i].subconta = tabelaNivel.subNivelNew;
    }
    this.estruturas = this.estruturas.sort((a, b) => {
      if (a.subconta < b.subconta) {
        return -1;
      }
      if (a.subconta > b.subconta) {
        return 1;
      }
      return 0;
    });
  }

  onSaveAll() {
    var newVersion = this.novoVersao();
    this.estruturas.forEach((estrutura) => {
      estrutura.versao = newVersion;
    });
    this.globalService.setSpin(true);
    this.inscricaoSaveAll = this.estruturaService
      .EstruturaSaveAll(this.estruturas, this.versao)
      .subscribe(
        (data: EstruturaModel[]) => {
          this.globalService.setSpin(false);
          this.estruturas = data;
          this.versao = this.estruturas[0].versao;
          this.setAcao(this.idAcao);
          this.appSnackBar.openSuccessSnackBar(
            `Estrutura Gravada Na Versão ${this.versao}`,
            'OK'
          );
        },
        (error: any) => {
          this.globalService.setSpin(false);
          this.estruturas = [];
          this.appSnackBar.openFailureSnackBar(
            `Falha Na Estrutura  ${error.error.tabela} - ${error.error.erro} - ${error.error.message}`,
            'OK'
          );
        }
      );
  }

  onUpdateAll() {
    this.globalService.setSpin(true);
    this.inscricaoSaveAll = this.estruturaService
      .EstruturaUpdateAll(this.estruturas)
      .subscribe(
        (data: EstruturaModel[]) => {
          this.globalService.setSpin(false);
          this.estruturas = data;
          this.versao = this.estruturas[0].versao;
          this.setAcao(this.idAcao);
          this.appSnackBar.openSuccessSnackBar(`Estrutura Atualizada!`, 'OK');
        },
        (error: any) => {
          this.globalService.setSpin(false);
          this.estruturas = [];
          this.appSnackBar.openFailureSnackBar(
            `Falha Na Estrutura  ${error.error.tabela} - ${error.error.erro} - ${error.error.message}`,
            'OK'
          );
        }
      );
  }
}
