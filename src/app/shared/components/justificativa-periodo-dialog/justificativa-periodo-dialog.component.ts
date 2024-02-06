import { FormBuilder, FormGroup } from '@angular/forms';
import { Component, Inject, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { ValidatorStringLen } from '../../Validators/validator-string-len';
import { JustificativaDialogData } from './justificativa-dialog-data';

@Component({
  selector: 'app-justificativa-periodo-dialog',
  templateUrl: './justificativa-periodo-dialog.component.html',
  styleUrls: ['./justificativa-periodo-dialog.component.css'],
})
export class JustificativaPeriodoDialogComponent implements OnInit {
  formulario: FormGroup;

  constructor(
    public dialogRef: MatDialogRef<JustificativaPeriodoDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: JustificativaDialogData,
    private formBuilder: FormBuilder
  ) {
    this.formulario = formBuilder.group({
      novaData: [],
      justificativa: [{ value: '' }, [ValidatorStringLen(5, 200)]],
    });
  }

  ngOnInit(): void {
    this.setValue();
  }

  actionFunction() {
    this.data.processar = true;
    this.data.novaData = this.formulario.value.novaData;
    this.closeModal();
  }

  setValue() {
    this.formulario.setValue({
      novaData: this.data.novaData,
      justificativa: this.data.justificativa,
    });
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
