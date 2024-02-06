import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { UsuarioQuery01Model } from 'src/app/Models/usuario-query_01-model';
import { FormBuilder, FormGroup } from '@angular/forms';
import { GlobalService } from 'src/app/services/global.service';
import { Router } from '@angular/router';
import { UsuariosService } from 'src/app/services/usuarios.service';

@Component({
  selector: 'param-diretor',
  templateUrl: './param-diretor.component.html',
  styleUrls: ['./param-diretor.component.css'],
})
export class ParamDiretorComponent implements OnInit {
  @Input('diretores') diretores!: UsuarioQuery01Model[];

  @Output('changeDiretor') changeDiretor = new EventEmitter<number>();

  parametro: FormGroup;

  constructor(
    formBuilder: FormBuilder,
    private globalService: GlobalService,
    private usuariosService: UsuariosService,
    private router: Router
  ) {
    this.parametro = formBuilder.group({
      diretor: [{ value: '' }],
    });
    this.setParametro();
  }

  ngOnInit(): void {}

  onChangeDiretor() {
    const id: number = this.parametro.value.diretor as number;
    this.changeDiretor.emit(id);
  }

  setParametro() {
    this.parametro.setValue({
      diretor: 0,
    });
  }
}
