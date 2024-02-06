import { Component, OnInit, Inject } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { ValidatorStringLen } from '../../Validators/validator-string-len';
import { PeriodoDialogData } from './periodo-dialog-data';

@Component({
  selector: 'app-periodo-dialog',
  templateUrl: './periodo-dialog.component.html',
  styleUrls: ['./periodo-dialog.component.css'],
})
export class PeriodoDialogComponent implements OnInit {
  formulario: FormGroup;

  constructor(
    private formBuilder: FormBuilder,
    public dialogRef: MatDialogRef<PeriodoDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: PeriodoDialogData
  ) {
    this.formulario = formBuilder.group({
      dataInicial: [],
      dataFinal: [],
      justificativa: [
        { value: '' },
        [ValidatorStringLen(5, 200, data.temJustificativa)],
      ],
    });
  }

  ngOnInit() {
    this.setValue();
  }

  setValue() {
    this.formulario.setValue({
      dataInicial: this.data.dataInicial,
      dataFinal: this.data.dataFinal,
      justificativa: this.data.justificativa,
    });
  }

  actionFunction() {
    this.data.processar = true;
    this.data.dataInicial = this.formulario.value.dataInicial;
    this.data.dataFinal = this.formulario.value.dataFinal;
    if (this.data.temJustificativa) {
      this.data.justificativa = this.formulario.value.justificativa;
    }
    this.closeModal();
  }

  closeModal() {
    this.dialogRef.close();
  }

  touchedOrDirty(campo: string): boolean {
    if (
      this.formulario.get(campo)?.touched ||
      this.formulario.get(campo)?.dirty
    )
      return true;
    return false;
  }

  getValidfield(field: string): boolean {
    return (
      this.formulario.get(field)?.errors?.ValidatorStringLen &&
      this.touchedOrDirty(field)
    );
  }

  getMensafield(field: string): string {
    return this.formulario.get(field)?.errors?.message;
  }
}
