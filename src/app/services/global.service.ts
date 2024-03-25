import { GuardiaoOpcoes } from './../shared/classes/Guardiao-Opcoes';
import { GuardiaoMestre } from './../shared/classes/guardiao-mestre';
import { CelulaDia } from '../shared/classes/celula-dia';
import { UsuariosService } from 'src/app/services/usuarios.service';
import { Injectable, EventEmitter } from '@angular/core';
import { Router } from '@angular/router';
import { UsuarioModel } from '../Models/usuario-model';
import { CadastroAcoes } from '../shared/classes/cadastro-acoes';
import { ParametroModel } from '../Models/parametro-model';
import { ParceiraModel } from '../Models/parceira-model';
import { TipoContratoModel } from '../Models/tipo-contrato-model';
import { TipoData } from '../shared/classes/tipo-data';
import { NivelData } from '../shared/classes/nivel-data';

@Injectable({
  providedIn: 'root',
})
export class GlobalService {
  usuario: UsuarioModel;
  logado: boolean = false;
  id_empresa: number = 1;
  showSpin: boolean = false;
  showSpinApontamentos: boolean = false;
  codigoMotivo: string = '001001';
  guadiaoMestre: GuardiaoMestre[] = [];
  guardiaoOpcoes: GuardiaoOpcoes[] = [];
  lsParametros: ParametroModel[] = [];
  lsParceiras: ParceiraModel[] = [];
  lsTpoContratos: TipoContratoModel[] = [];
  lsTiposData: TipoData[] = [];
  lsNiveisData: NivelData[] = [];

  shomMenuEmitter = new EventEmitter<boolean>();
  refreshLançamentos = new EventEmitter<CelulaDia>();
  refreshCabec = new EventEmitter<CelulaDia>();
  showSpinEmitter = new EventEmitter<boolean>();
  showSpinApontamentosEmitter = new EventEmitter<boolean>();

  constructor(private usuarioService: UsuariosService, private router: Router) {
    this.usuario = new UsuarioModel();
    this.logado = false;
    this.loadTiposData();
    this.loadNiveisData();
    this.loadParceiras();
    this.loadTipoContratos();
    this.loadGuardiaoMestre();
    this.loadGuardiaoOpcoes();
  }

  loadNiveisData() {
    let nivel: NivelData = new NivelData();
    nivel.id = 0;
    nivel.descricao = 'NÃO SE APLICA';
    this.lsNiveisData.push(nivel);
    nivel = new NivelData();
    nivel.id = 1;
    nivel.descricao = 'FERIADO MUNICIPAL';
    this.lsNiveisData.push(nivel);
    nivel = new NivelData();
    nivel.id = 2;
    nivel.descricao = 'FERIADO ESTADUAL';
    this.lsNiveisData.push(nivel);
    nivel = new NivelData();
    nivel.id = 3;
    nivel.descricao = 'FERIADO NACIONAL';
    this.lsNiveisData.push(nivel);
  }

  getlsNiveisData(): NivelData[] {
    return this.lsNiveisData;
  }

  loadTiposData() {
    let tipo: TipoData = new TipoData();
    tipo = new TipoData();
    tipo.id = 1;
    tipo.descricao = 'FERIADOS';
    this.lsTiposData.push(tipo);

    tipo = new TipoData();
    tipo.id = 2;
    tipo.descricao = 'DATAS ESPECIAIS';
    this.lsTiposData.push(tipo);
  }

  getlsTiposData(): TipoData[] {
    return this.lsTiposData;
  }

  getUsuario(): UsuarioModel {
    return this.usuario;
  }

  setUsuario(user: UsuarioModel) {
    this.usuario = user;
  }

  setLogado(value: boolean) {
    this.shomMenuEmitter.emit(value);
    this.logado = value;
    this.router.navigate(['home']);
  }

  setRefreshLançamentos(value: CelulaDia) {
    this.refreshLançamentos.emit(value);
  }

  setRefreshCabec(value: CelulaDia) {
    this.refreshCabec.emit(value);
  }

  getLogado(): boolean {
    return this.logado;
  }

  setIdEmpresa(value: number) {
    this.id_empresa = value;
  }

  getIdEmpresa(): number {
    return this.id_empresa;
  }

  getNomeusuarioLogado(): string {
    const nomes = this.usuario.razao.split(' ');
    if (this.logado) {
      return nomes[0];
    } else {
      return 'Login Não Efetuado.';
    }
  }

  okCadastros(): boolean {
    if (
      this.usuarioService.isDiretoria(this.usuario.grupo) ||
      this.usuarioService.isCoordenador(this.usuario.grupo) ||
      this.usuarioService.isAuditor(this.usuario.grupo) ||
      this.usuarioService.isAdm(this.usuario.grupo) ||
      this.usuarioService.isTi(this.usuario.grupo)
    )
      return true;

    return false;
  }

  okProjetos(): boolean {
    if (
      this.usuarioService.isDiretoria(this.usuario.grupo) ||
      this.usuarioService.isAdm(this.usuario.grupo) ||
      this.usuarioService.isTi(this.usuario.grupo)
    )
      return true;

    return false;
  }

  okPlanejamento(): boolean {
    if (
      this.usuarioService.isDiretoria(this.usuario.grupo) ||
      this.usuarioService.isCoordenador(this.usuario.grupo) ||
      this.usuarioService.isAdm(this.usuario.grupo) ||
      this.usuarioService.isTi(this.usuario.grupo)
    )
      return true;

    return false;
  }

  okExecucao(): boolean {
    if (
      this.usuarioService.isDiretoria(this.usuario.grupo) ||
      this.usuarioService.isCoordenador(this.usuario.grupo) ||
      this.usuarioService.isAuditor(this.usuario.grupo) ||
      this.usuarioService.isTi(this.usuario.grupo)
    )
      return true;

    return false;
  }

  okGerencial(): boolean {
    if (
      this.usuarioService.isDiretoria(this.usuario.grupo) ||
      this.usuarioService.isTi(this.usuario.grupo)
    )
      return true;

    return false;
  }

  okDirAdm(): boolean {
    if (
      this.usuarioService.isDiretoria(this.usuario.grupo) ||
      this.usuarioService.isAdm(this.usuario.grupo) ||
      this.usuarioService.isTi(this.usuario.grupo)
    )
      return true;

    return false;
  }

  setSpin(value: boolean) {
    this.showSpin = value;
    this.showSpinEmitter.emit(this.showSpin);
  }

  getSpin(): boolean {
    return this.showSpin;
  }

  setSpinApontamentos(value: boolean) {
    this.showSpinApontamentos = value;
    this.showSpinApontamentosEmitter.emit(this.showSpinApontamentos);
  }

  getSpinApontamentos(): boolean {
    return this.showSpinApontamentos;
  }

  loadGuardiaoMestre() {
    //Cadastros
    let guard = new GuardiaoMestre();
    this.guadiaoMestre = [];

    guard.path = 'empresas';
    guard.grupos = [0];
    this.guadiaoMestre.push(guard);

    guard = new GuardiaoMestre();
    guard.path = 'usuarios';
    guard.grupos.push(0);
    this.guadiaoMestre.push(guard);

    guard = new GuardiaoMestre();
    guard.path = 'clientes';
    guard.grupos.push(0);
    this.guadiaoMestre.push(guard);

    guard = new GuardiaoMestre();
    guard.path = 'users';
    guard.grupos = [900, 904, 906];
    this.guadiaoMestre.push(guard);

    guard = new GuardiaoMestre();
    guard.path = 'economicos';
    guard.grupos = [900, 904, 906];
    this.guadiaoMestre.push(guard);

    guard = new GuardiaoMestre();
    guard.path = 'motivos';
    guard.grupos = [900, 901, 904, 906];
    this.guadiaoMestre.push(guard);

    guard = new GuardiaoMestre();
    guard.path = 'estruturas';
    guard.grupos = [900, 901, 904, 906];
    this.guadiaoMestre.push(guard);

    guard = new GuardiaoMestre();
    guard.path = 'feriados';
    guard.grupos = [906];
    this.guadiaoMestre.push(guard);

    //diretoria
    guard = new GuardiaoMestre();
    guard.path = 'projetos';
    guard.grupos = [900, 901, 902, 904, 906];
    this.guadiaoMestre.push(guard);

    guard = new GuardiaoMestre();
    guard.path = 'agendaprojeto';
    guard.grupos = [900, 906];
    this.guadiaoMestre.push(guard);

    guard = new GuardiaoMestre();
    guard.path = 'agendacoordenador';
    guard.grupos = [900, 901, 906];
    this.guadiaoMestre.push(guard);

    guard = new GuardiaoMestre();
    guard.path = 'execucao';
    guard.grupos = [0];
    this.guadiaoMestre.push(guard);

    guard = new GuardiaoMestre();
    guard.path = 'execucao3';
    guard.grupos = [906];
    this.guadiaoMestre.push(guard);

    guard = new GuardiaoMestre();
    guard.path = 'agendatrabalhos';
    guard.grupos = [0];
    this.guadiaoMestre.push(guard);

    guard = new GuardiaoMestre();
    guard.path = 'extratoaudi';
    guard.grupos = [906];
    this.guadiaoMestre.push(guard);

    guard = new GuardiaoMestre();
    guard.path = 'gerencial';
    guard.grupos = [900, 906];
    this.guadiaoMestre.push(guard);

    guard = new GuardiaoMestre();
    guard.path = 'sobre';
    guard.grupos = [906];
    this.guadiaoMestre.push(guard);
  }

  validarGuardiaoMestre(value?: string): boolean {
    if (typeof value === 'undefined') return false;
    let guard: GuardiaoMestre = new GuardiaoMestre();

    this.guadiaoMestre.forEach((guardiao) => {
      if (guardiao.path === value) {
        guard = guardiao;
      }
    });

    if (guard.path == '') return false;

    if (guard.grupos[0] == 0) return true;

    let idx = guard.grupos.findIndex((gru) => gru == this.usuario.grupo);

    return idx == -1 ? false : true;
  }

  loadGuardiaoOpcoes() {
    //Cadastros
    let guard = new GuardiaoOpcoes();
    this.guardiaoOpcoes = [];

    guard.path = 'empresa';
    guard.usuario = 16;
    guard.acoes = [
      CadastroAcoes.Inclusao,
      CadastroAcoes.Edicao,
      CadastroAcoes.Exclusao,
      CadastroAcoes.Consulta,
    ];
    this.guardiaoOpcoes.push(guard);

    guard = new GuardiaoOpcoes();
    guard.path = 'empresa';
    guard.usuario = 0;
    guard.acoes = [CadastroAcoes.Consulta];
    this.guardiaoOpcoes.push(guard);

    guard = new GuardiaoOpcoes();
    guard.path = 'usuario';
    guard.usuario = 999;
    guard.acoes = [CadastroAcoes.Edicao, CadastroAcoes.Consulta];
    this.guardiaoOpcoes.push(guard);

    guard = new GuardiaoOpcoes();
    guard.path = 'usuario';
    guard.usuario = 0;
    guard.acoes = [CadastroAcoes.None];
    this.guardiaoOpcoes.push(guard);

    guard = new GuardiaoOpcoes();
    guard.path = 'usuario';
    guard.usuario = 16;
    guard.acoes = [
      CadastroAcoes.Edicao,
      CadastroAcoes.Consulta,
      CadastroAcoes.Inclusao,
    ];
    this.guardiaoOpcoes.push(guard);

    guard = new GuardiaoOpcoes();
    guard.path = 'usuario';
    guard.usuario = 9;
    guard.acoes = [CadastroAcoes.Consulta, CadastroAcoes.Inclusao];
    this.guardiaoOpcoes.push(guard);

    guard = new GuardiaoOpcoes();
    guard.path = 'usuario';
    guard.grupo = 904;
    guard.acoes = [
      CadastroAcoes.Consulta,
      CadastroAcoes.Inclusao,
      CadastroAcoes.Edicao,
    ];
    this.guardiaoOpcoes.push(guard);

    guard = new GuardiaoOpcoes();
    guard.path = 'cliente';
    guard.usuario = 0;
    guard.acoes = [CadastroAcoes.Consulta];
    this.guardiaoOpcoes.push(guard);

    guard = new GuardiaoOpcoes();
    guard.path = 'cliente';
    guard.usuario = 16;
    guard.acoes = [
      CadastroAcoes.Inclusao,
      CadastroAcoes.Edicao,
      CadastroAcoes.Exclusao,
      CadastroAcoes.Consulta,
    ];
    this.guardiaoOpcoes.push(guard);

    guard = new GuardiaoOpcoes();
    guard.path = 'cliente';
    guard.grupo = 904;
    guard.acoes = [
      CadastroAcoes.Inclusao,
      CadastroAcoes.Edicao,
      CadastroAcoes.Exclusao,
      CadastroAcoes.Consulta,
    ];
    this.guardiaoOpcoes.push(guard);

    guard = new GuardiaoOpcoes();
    guard.path = 'economico';
    guard.usuario = 0;
    guard.acoes = [
      CadastroAcoes.Inclusao,
      CadastroAcoes.Edicao,
      CadastroAcoes.Exclusao,
      CadastroAcoes.Consulta,
    ];
    this.guardiaoOpcoes.push(guard);

    guard = new GuardiaoOpcoes();
    guard.path = 'user';
    guard.usuario = 0;
    guard.acoes = [
      CadastroAcoes.Inclusao,
      CadastroAcoes.Edicao,
      CadastroAcoes.Exclusao,
      CadastroAcoes.Consulta,
    ];
    this.guardiaoOpcoes.push(guard);

    guard = new GuardiaoOpcoes();
    guard.path = 'motivo';
    guard.usuario = 0;
    guard.acoes = [CadastroAcoes.Consulta];
    this.guardiaoOpcoes.push(guard);

    guard = new GuardiaoOpcoes();
    guard.path = 'motivo';
    guard.usuario = 16;
    guard.acoes = [
      CadastroAcoes.Inclusao,
      CadastroAcoes.Edicao,
      CadastroAcoes.Exclusao,
      CadastroAcoes.Consulta,
    ];
    this.guardiaoOpcoes.push(guard);

    /*
    guard = new GuardiaoOpcoes();
    guard.path = 'projeto';
    guard.grupo = 901;
    guard.acoes = [CadastroAcoes.Consulta];
    this.guardiaoOpcoes.push(guard);
*/
    guard = new GuardiaoOpcoes();
    guard.path = 'projeto';
    guard.usuario = 0;
    guard.acoes = [
      CadastroAcoes.Inclusao,
      CadastroAcoes.Edicao,
      CadastroAcoes.Exclusao,
      CadastroAcoes.Consulta,
    ];
    this.guardiaoOpcoes.push(guard);
  }

  validarGuardiaoOpcoes(value?: string, opcao?: number, id?: number): boolean {
    if (typeof value === 'undefined') return false;
    if (typeof opcao === 'undefined') return false;
    if (typeof id === 'undefined') return false;
    const opc: number = opcao as number;
    const guardUser = this.guardiaoOpcoes.filter(
      (g) => g.path === value && g.usuario === this.usuario.id
    );
    const guardGrupo = this.guardiaoOpcoes.filter(
      (g) => g.path === value && g.grupo === this.usuario.grupo
    );
    const guardOwner = this.guardiaoOpcoes.filter(
      (g) => g.path === value && g.usuario === 999 && this.usuario.id == id
    );
    const guardGen = this.guardiaoOpcoes.filter(
      (g) => g.path === value && g.usuario === 0
    );
    let guard: GuardiaoOpcoes[] = [];
    if (guardUser.length > 0) {
      guard = guardUser as GuardiaoOpcoes[];
    } else {
      if (guardGrupo.length > 0) {
        guard = guardGrupo as GuardiaoOpcoes[];
      } else {
        if (guardOwner.length > 0) {
          guard = guardOwner as GuardiaoOpcoes[];
        } else {
          if (guardGen.length == 0) {
            return true;
          } else {
            guard = guardGen as GuardiaoOpcoes[];
          }
        }
      }
    }
    let idx = -1;
    guard[0].acoes.forEach((op) => {
      if (op == opc) idx = 1;
    });
    return idx == -1 ? false : true;
  }

  estadoSave(par: ParametroModel) {
    const idx = this.lsParametros.findIndex((p) => par.modulo == p.modulo);
    if (idx == -1) {
      this.lsParametros.push(par);
    } else {
      this.lsParametros[idx] = par;
    }
  }

  estadoFind(value: string): ParametroModel | null {
    const idx = this.lsParametros.findIndex(
      (p) => value.trim() == p.modulo.trim()
    );
    if (idx == -1) return null;
    return this.lsParametros[idx];
  }

  estadoDelete(par: ParametroModel) {
    const idx = this.lsParametros.findIndex(
      (p) => par.modulo.trim() == p.modulo.trim()
    );
    if (idx > -1) {
      this.lsParametros.splice(idx, 1);
    }
  }

  loadParceiras() {
    this.lsParceiras = [
      { id: 1, descricao: 'CONTLINE' },
      { id: 2, descricao: 'SIMIONATO AUDITORES CPS' },
      { id: 3, descricao: 'SIMIONATO AUDITORES SP' },
      { id: 4, descricao: 'SIMIONATO AUDITORES GESTÃO' },
    ];
  }

  loadTipoContratos() {
    this.lsTpoContratos = [
      { id: 1, descricao: 'FIXO' },
      { id: 2, descricao: 'TRABALHO ESPECIAL' },
    ];
  }

  getTipoContrato(idx: number): string {
    if (idx < 1 || idx > 2) return '';
    return this.lsTpoContratos[idx - 1].descricao;
  }
}
