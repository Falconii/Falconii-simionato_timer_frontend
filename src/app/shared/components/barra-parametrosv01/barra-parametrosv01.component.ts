import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { Router } from '@angular/router';
import { UsuarioQuery01Model } from 'src/app/Models/usuario-query_01-model';
import { GlobalService } from 'src/app/services/global.service';

@Component({
  selector: 'app-barra-parametrosv01',
  templateUrl: './barra-parametrosv01.component.html',
  styleUrls: ['./barra-parametrosv01.component.css'],
})
export class BarraParametrosv01Component implements OnInit {
  @Input('diretores') diretores!: UsuarioQuery01Model[];
  @Input('coordenadores') coordenadores!: UsuarioQuery01Model[];
  @Input('auditores') auditores!: UsuarioQuery01Model[];

  @Output('changeDiretor') changeDiretor = new EventEmitter<number>();
  @Output('changeCoordenador') changeCoordenador = new EventEmitter<number>();
  @Output('changeAuditor') changeAuditor = new EventEmitter<number>();

  parametro: FormGroup;

  constructor(
    formBuilder: FormBuilder,
    private globalService: GlobalService,
    private router: Router
  ) {
    this.parametro = formBuilder.group({
      diretor: [{ value: '' }],
      coordenador: [{ value: '' }],
      auditor: [{ value: '' }],
    });
    this.setParametro();
  }

  ngOnInit() {}

  onChangeDiretor() {
    const id: number = this.parametro.value.diretor as number;
    this.changeDiretor.emit(id);
  }

  onChangeCoordenador() {
    const id: number = this.parametro.value.coordenador as number;
    this.changeCoordenador.emit(id);
  }

  onChangeAuditor() {
    const id: number = this.parametro.value.auditor as number;
    this.changeAuditor.emit(id);
  }

  setParametro() {
    this.parametro.setValue({
      diretor: 0,
      coordenador: 0,
      auditor: 0,
    });
  }
}
