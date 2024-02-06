import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { UsuarioQuery01Model } from 'src/app/Models/usuario-query_01-model';
import { FormBuilder, FormGroup } from '@angular/forms';
import { GlobalService } from 'src/app/services/global.service';
import { Router } from '@angular/router';
import { UsuariosService } from 'src/app/services/usuarios.service';

@Component({
  selector: 'param-auditor',
  templateUrl: './param-auditor.component.html',
  styleUrls: ['./param-auditor.component.css'],
})
export class ParamAuditorComponent implements OnInit {
  @Input('auditores') auditores!: UsuarioQuery01Model[];

  @Output('changeAuditor') changeAuditor = new EventEmitter<number>();

  parametro: FormGroup;

  constructor(
    formBuilder: FormBuilder,
    private globalService: GlobalService,
    private usuariosService: UsuariosService,
    private router: Router
  ) {
    this.parametro = formBuilder.group({
      auditor: [{ value: '' }],
    });
    this.setParametro();
  }

  ngOnInit(): void {}

  onChangeAuditor() {
    const id: number = this.parametro.value.auditor as number;
    this.changeAuditor.emit(id);
  }

  setParametro() {
    this.parametro.setValue({
      auditor: 0,
    });
  }
}
