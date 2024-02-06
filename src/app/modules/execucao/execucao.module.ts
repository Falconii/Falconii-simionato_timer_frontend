import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ExecucaoRoutingModule } from './execucao-routing.module';
import { MaterialModule } from 'src/app/material/material.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { SharedModule } from 'src/app/shared/shared.module';
import { NgxMaskModule } from 'ngx-mask';
import { CrudExecucaoLancamentoComponent } from './crud-execucao-lancamento/crud-execucao-lancamento.component';
import { ShowAtividadesDataComponent } from './show-atividades-data/show-atividades-data.component';

@NgModule({
  declarations: [CrudExecucaoLancamentoComponent, ShowAtividadesDataComponent],
  imports: [
    CommonModule,
    ExecucaoRoutingModule,
    MaterialModule,
    FormsModule,
    ReactiveFormsModule,
    SharedModule,
    NgxMaskModule.forChild(),
  ],
})
export class ExecucaoModule {}
