import { Component, OnInit, Inject } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { HorasDiretoriaData } from './horas-diretoria-data';

@Component({
  selector: 'app-horas-diretoria-dialog',
  templateUrl: './horas-diretoria-dialog.component.html',
  styleUrls: ['./horas-diretoria-dialog.component.css'],
})
export class HorasDiretoriaDialogComponent implements OnInit {
  formulario: FormGroup;

  constructor(
    private formBuilder: FormBuilder,
    public dialogRef: MatDialogRef<HorasDiretoriaData>,
    @Inject(MAT_DIALOG_DATA) public data: HorasDiretoriaData
  ) {
    this.formulario = formBuilder.group({
      horasdir: [{ value: 0 }],
    });
  }

  ngOnInit() {
    this.setValue();
  }

  setValue() {
    this.formulario.setValue({
      horasdir: this.data.horasdir,
    });
  }

  actionFunction() {
    this.data.horasdir = Number(this.formulario.value.horasdir);
    this.data.processar = true;
    this.closeModal();
  }

  closeModal() {
    this.dialogRef.close();
  }

  itsOk(): boolean {
    if (isNaN(Number(this.formulario.value.horasdir))) {
      return false;
    } else {
      return true;
    }
  }
}
