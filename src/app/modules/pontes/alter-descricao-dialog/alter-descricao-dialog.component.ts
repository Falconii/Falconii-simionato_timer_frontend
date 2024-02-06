import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { ViewDialogData } from './view-dialog-data';
import { ValidatorStringLen } from 'src/app/shared/Validators/validator-string-len';

@Component({
  selector: 'app-alter-descricao-dialog',
  templateUrl: './alter-descricao-dialog.component.html',
  styleUrls: ['./alter-descricao-dialog.component.css'],
})
export class AlterDescricaoDialogComponent implements OnInit {
  formulario: FormGroup;

  constructor(
    public dialogRef: MatDialogRef<AlterDescricaoDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: ViewDialogData,
    private formBuilder: FormBuilder
  ) {
    this.formulario = formBuilder.group({
      descricao: [{ value: '' }, [ValidatorStringLen(3, 50)]],
    });
  }

  ngOnInit(): void {
    this.data.processar = false;
    this.setValue();
  }

  actionFunction() {
    this.data.processar = true;
    this.data.descricao = this.formulario.value.descricao;
    this.closeModal();
  }

  setValue() {
    this.formulario.setValue({
      descricao: this.data.descricao,
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
