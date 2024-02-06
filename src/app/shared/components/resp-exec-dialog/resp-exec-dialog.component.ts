import { Component, OnInit, Inject } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatSelectChange } from '@angular/material/select';
import { ValidatorStringLen } from '../../Validators/validator-string-len';
import { RespExecDialogData } from './resp-exec-dialog-data';

@Component({
  selector: 'app-resp-exec-dialog',
  templateUrl: './resp-exec-dialog.component.html',
  styleUrls: ['./resp-exec-dialog.component.css'],
})
export class RespExecDialogComponent implements OnInit {
  formulario: FormGroup;
  constructor(
    private formBuilder: FormBuilder,
    public dialogRef: MatDialogRef<RespExecDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: RespExecDialogData
  ) {
    this.formulario = formBuilder.group({
      usuario: [{ value: 0 }],
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
      usuario: this.data.id_usuario,
      justificativa: this.data.justificativa,
    });
  }

  actionFunction() {
    this.data.processar = true;
    this.data.justificativa = this.formulario.value.justificativa;
    this.closeModal();
  }

  closeModal() {
    this.dialogRef.close();
  }

  onChangeUsuario(evento: MatSelectChange) {
    this.data.id_usuario = evento.value;
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
