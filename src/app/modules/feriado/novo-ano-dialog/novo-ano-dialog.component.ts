import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { NovoAnoDialogData } from './novo-ano-dialog-data';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { ValidatorStringLen } from 'src/app/shared/Validators/validator-string-len';
import { ParametroFeriado01 } from 'src/app/parametros/parametro-feriado01';
import { Subscription } from 'rxjs';
import { GlobalService } from 'src/app/services/global.service';
import { AppSnackbar } from 'src/app/shared/classes/app-snackbar';
import { messageError } from 'src/app/shared/classes/util';
import { FeriadosService } from 'src/app/services/feriados.service';

@Component({
  selector: 'app-novo-ano-dialog',
  templateUrl: './novo-ano-dialog.component.html',
  styleUrls: ['./novo-ano-dialog.component.css'],
})
export class NovoAnoDialogComponent implements OnInit {
  formulario: FormGroup;

  anos: number[] = [2024, 2025, 2026];

  inscricaoGetAll!: Subscription;

  constructor(
    public dialogRef: MatDialogRef<NovoAnoDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: NovoAnoDialogData,
    private formBuilder: FormBuilder,
    private globalService: GlobalService,
    private appSnackBar: AppSnackbar,
    private feriadoService: FeriadosService
  ) {
    this.formulario = formBuilder.group({
      ano: [{ value: '' }, [ValidatorStringLen(1, 4)]],
    });
  }

  ngOnInit(): void {
    this.data.processar = false;
    this.setValue();
  }

  ngOnDestroy() {
    this.inscricaoGetAll?.unsubscribe();
  }

  actionFunction() {
    this.data.processar = true;
    this.data.ano = this.formulario.value.ano;
    this.closeModal();
  }

  setValue() {
    this.formulario.setValue({
      ano: this.data.ano,
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

  onChangeParametros() {
    this.getFeriadosContador();
  }

  getFeriadosContador() {
    let par = new ParametroFeriado01();

    par.id_empresa = 1;

    par.ano = this.formulario.value.ano;

    par.orderby = 'Data';

    par.id_tipo = 1;

    par.orderby = '';

    par.contador = 'S';

    this.globalService.setSpin(true);
    this.inscricaoGetAll = this.feriadoService.getFeriados_01(par).subscribe(
      (data: any) => {
        this.globalService.setSpin(false);
        let nReg: Number = 0;
        try {
          nReg = parseInt(data.total);
        } catch (error) {
          nReg = 0;
        }
        if (nReg !== 0) {
          this.formulario.patchValue({ ano: '' });
          this.appSnackBar.openFailureSnackBar(
            `Este Ano Já Possui Feriados ${data.total}`,
            'OK'
          );
        }
      },
      (error: any) => {
        this.globalService.setSpin(false);
        this.appSnackBar.openFailureSnackBar(
          `Pesquisa Nos Feriados ${messageError(error)}`,
          'OK'
        );
      }
    );
  }
}
