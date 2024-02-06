import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ProgramacaoRoutingModule } from './programacao-routing.module';
import { ProgramacaoComponent } from './programacao/programacao.component';
import { MaterialModule } from 'src/app/material/material.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { SharedModule } from 'src/app/shared/shared.module';
import { NgxMaskModule } from 'ngx-mask';

@NgModule({
  declarations: [ProgramacaoComponent],
  imports: [
    CommonModule,
    ProgramacaoRoutingModule,
    MaterialModule,
    FormsModule,
    ReactiveFormsModule,
    SharedModule,
  ],
})
export class ProgramacaoModule {}
