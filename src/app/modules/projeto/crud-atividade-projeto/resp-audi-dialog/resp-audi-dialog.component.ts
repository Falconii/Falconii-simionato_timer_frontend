import { FormControl, FormGroup, Validators } from '@angular/forms';
import { RespAudiData } from './resp-audi-data';
import { Component, OnInit, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { FormBuilder } from '@angular/forms';
import { MatSelectChange } from '@angular/material/select';
import { MatCheckboxChange } from '@angular/material/checkbox';

@Component({
  selector: 'app-resp-audi-dialog',
  templateUrl: './resp-audi-dialog.component.html',
  styleUrls: ['./resp-audi-dialog.component.css'],
})
export class RespAudiDialogComponent implements OnInit {
  formulario: FormGroup;
  constructor(
    private formBuilder: FormBuilder,
    public dialogRef: MatDialogRef<RespAudiDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: RespAudiData
  ) {
    this.formulario = formBuilder.group({
      desconsiderar_resp: [{ value: '' }],
      id_exec: [{ value: '' }],
      desconsiderar_exec: [{ value: '' }],
      id_resp: [{ value: '' }],
    });
  }

  ngOnInit() {
    this.setValue();
  }

  setValue() {
    this.formulario.setValue({
      desconsiderar_resp: this.data.desconsiderar_resp,
      id_resp: this.data.id_resp,
      desconsiderar_exec: this.data.desconsiderar_exec,
      id_exec: this.data.id_exec,
    });
  }

  actionFunction() {
    this.data.processar = true;
    this.data.id_resp = this.data.id_resp > -1 ? this.data.id_resp : 0;
    this.data.id_exec = this.data.id_exec > -1 ? this.data.id_exec : 0;
    this.closeModal();
  }

  // If the user clicks the cancel button a.k.a. the go back button, then\
  // just close the modal
  closeModal() {
    this.dialogRef.close();
  }

  onChangeExecutor(evento: MatSelectChange) {
    this.data.id_exec = evento.value;
    this.formulario.patchValue({ desconsiderar_exec: false });
  }

  onChangeResponsavel(evento: MatSelectChange) {
    this.data.id_resp = evento.value;
    this.formulario.patchValue({ desconsiderar_resp: false });
  }

  onChangeResp(evento: MatCheckboxChange) {
    this.data.desconsiderar_resp = evento.checked;
    this.formulario.patchValue({ id_resp: -1 });
    this.data.id_resp = -1;
  }

  onChangeExec(evento: MatCheckboxChange) {
    this.data.desconsiderar_exec = evento.checked;
    this.formulario.patchValue({ id_exec: -1 });
    this.data.id_exec = -1;
  }

  itsOK(): Boolean {
    let responsavel: Boolean = false;
    let executor: Boolean = false;
    if (this.data.desconsiderar_resp) {
      responsavel = true;
    } else {
      if (this.data.id_resp > -1) {
        responsavel = true;
      } else {
        responsavel = false;
      }
    }
    if (this.data.desconsiderar_exec) {
      executor = true;
    } else {
      if (this.data.id_exec > -1) {
        executor = true;
      } else {
        executor = false;
      }
    }

    return responsavel && executor;
  }
}
