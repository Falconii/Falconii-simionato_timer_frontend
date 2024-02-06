import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { UsuarioQuery01Model } from 'src/app/Models/usuario-query_01-model';
import { FormBuilder, FormGroup } from '@angular/forms';
import { GlobalService } from 'src/app/services/global.service';
import { Router } from '@angular/router';
import { UsuariosService } from 'src/app/services/usuarios.service';

@Component({
  selector: 'param-coordenador',
  templateUrl: './param-coordenador.component.html',
  styleUrls: ['./param-coordenador.component.css'],
})
export class ParamCoordenadorComponent implements OnInit {
  @Input('coordenadores') coordenadores!: UsuarioQuery01Model[];

  @Output('changeCoordenador') changeCoordenador = new EventEmitter<number>();

  parametro: FormGroup;

  constructor(
    formBuilder: FormBuilder,
    private globalService: GlobalService,
    private usuariosService: UsuariosService,
    private router: Router
  ) {
    this.parametro = formBuilder.group({
      coordenador: [{ value: '' }],
    });
    this.setParametro();
  }

  ngOnInit(): void {}

  onChangeCoordenador() {
    const id: number = this.parametro.value.coordenador as number;
    this.changeCoordenador.emit(id);
  }

  setParametro() {
    this.parametro.setValue({
      coordenador: 0,
    });
  }
}
