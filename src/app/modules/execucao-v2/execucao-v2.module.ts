import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ExecucaoV2RoutingModule } from './execucao-v2-routing.module';
import { MaterialModule } from 'src/app/material/material.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgxMaskModule } from 'ngx-mask';
import { SharedModule } from 'src/app/shared/shared.module';
import { CrudExecucaoComponent } from './crud-Execucao/crud-Execucao.component';
import { CrudExecucaoMultiComponent } from './crud-execucao-multi/crud-execucao-multi.component';

@NgModule({
  declarations: [CrudExecucaoComponent, CrudExecucaoMultiComponent],
  imports: [
    CommonModule,
    ExecucaoV2RoutingModule,
    MaterialModule,
    FormsModule,
    ReactiveFormsModule,
    SharedModule,
    NgxMaskModule.forChild(),
  ],
})
export class ExecucaoV2Module {}
