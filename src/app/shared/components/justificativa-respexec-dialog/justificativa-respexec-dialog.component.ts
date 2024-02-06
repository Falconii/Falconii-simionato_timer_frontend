import { FormBuilder, FormGroup } from '@angular/forms';
import { JustificativaRespexecDialogData } from './justificativa-respexec-dialog-data';
import { Component, OnInit, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { JustificativaDialogData } from '../justificativa-periodo-dialog/justificativa-dialog-data';
import { MatSelectChange } from '@angular/material/select';
import { ValidatorStringLen } from '../../Validators/validator-string-len';

@Component({
  selector: 'app-justificativa-respexec-dialog',
  templateUrl: './justificativa-respexec-dialog.component.html',
  styleUrls: ['./justificativa-respexec-dialog.component.css'],
})
export class JustificativaRespexecDialogComponent implements OnInit {
  formulario: FormGroup;

  constructor(
    public dialogRef: MatDialogRef<JustificativaRespexecDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: JustificativaRespexecDialogData,
    private formBuilder: FormBuilder
  ) {
    this.formulario = formBuilder.group({
      usuario: [{ value: 0 }],
      justificativa: [{ value: '' }, [ValidatorStringLen(5, 200)]],
    });
  }

  ngOnInit(): void {}

  actionFunction() {
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
