import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { SituacaoProjeto } from '../../classes/util';
import { UsuarioQuery01Model } from 'src/app/Models/usuario-query_01-model';
import { FormBuilder, FormGroup } from '@angular/forms';
import { GlobalService } from 'src/app/services/global.service';
import { Router } from '@angular/router';
import { UsuariosService } from 'src/app/services/usuarios.service';

@Component({
  selector: 'barra-parametrosv02',
  templateUrl: './barra-parametrosv02.component.html',
  styleUrls: ['./barra-parametrosv02.component.css'],
})
export class BarraParametrosv02Component implements OnInit {
  @Input('diretores') diretores!: UsuarioQuery01Model[];
  @Input('situacoes') situacoes!: SituacaoProjeto[];

  @Output('changeDiretor') changeDiretor = new EventEmitter<number>();
  @Output('changeSituacao') changeSituacao = new EventEmitter<number>();

  parametro: FormGroup;

  constructor(
    formBuilder: FormBuilder,
    private globalService: GlobalService,
    private usuariosService: UsuariosService,
    private router: Router
  ) {
    this.parametro = formBuilder.group({
      diretor: [{ value: '' }],
      situacao: [{ value: '' }],
    });
    this.setParametro();
  }

  ngOnInit(): void {}

  onChangeDiretor() {
    const id: number = this.parametro.value.diretor as number;
    this.changeDiretor.emit(id);
  }

  onChangeSituacao() {
    const idx: number = this.parametro.value.situacao as number;
    this.changeSituacao.emit(idx);
  }

  setParametro() {
    this.parametro.setValue({
      diretor: 0,
      situacao: -1,
    });
  }
}
