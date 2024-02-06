import { AtividadeModel } from 'src/app/Models/atividade-model';
import { GlobalService } from 'src/app/services/global.service';
import { ProjetoModel } from 'src/app/Models/projeto-model';
import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { UsuarioQuery01Model } from 'src/app/Models/usuario-query_01-model';
import { RetornoPesquisa } from 'src/app/shared/classes/retorno-pesquisa';

@Component({
  selector: 'app-show-atividades-data',
  templateUrl: './show-atividades-data.component.html',
  styleUrls: ['./show-atividades-data.component.css'],
})
export class ShowAtividadesDataComponent implements OnInit {
  @Output('Cancelar') cancelar = new EventEmitter();
  @Output('Ok') ok = new EventEmitter();

  @Input('retorno') retorno!: RetornoPesquisa;

  parametro: FormGroup;

  projetos: ProjetoModel[] = [];
  projeto: ProjetoModel;

  responsavel: UsuarioQuery01Model = new UsuarioQuery01Model();
  responsaveis: UsuarioQuery01Model[] = [];

  atividades: AtividadeModel[] = [];

  constructor(
    private formBuilder: FormBuilder,
    private globalService: GlobalService
  ) {
    this.parametro = formBuilder.group({
      projeto: [{ value: '' }],
      responsavel: [{ value: '' }],
    });
    this.projeto = new ProjetoModel();
    this.responsavel = new UsuarioQuery01Model();
    this.responsaveis = [];
    this.setValue();
  }

  ngOnInit() {
    this.getProjetos();
    this.getResponsaveis();
    this.setValue();
  }

  getProjetos() {
    this.projetos = [];

    this.projeto = new ProjetoModel();
    this.projeto.id_empresa = this.globalService.getIdEmpresa();
    this.projeto.id = 0;
    this.projeto.descricao = 'TODOS';

    this.projetos.push(this.projeto);
  }
  getResponsaveis() {
    this.responsaveis = [];
    this.responsavel = new UsuarioQuery01Model();
    this.responsavel.id_empresa = this.globalService.getIdEmpresa();
    this.responsavel.id = 0;
    this.responsavel.razao = 'TODOS';
    this.responsaveis.push(this.responsavel);
  }

  setValue() {
    this.parametro.setValue({
      projeto: this.projeto.id,
      responsavel: this.responsavel.id,
    });
  }

  onCancelar() {
    this.cancelar.emit('');
  }

  onOK() {
    this.retorno.setId_Atividade(10);
    this.ok.emit('');
  }
}
