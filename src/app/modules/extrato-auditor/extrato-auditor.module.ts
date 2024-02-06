import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ExtratoAuditorRoutingModule } from './extrato-auditor-routing.module';
import { ExtratoAudiComponent } from './extrato-audi/extrato-audi.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgxMaskModule } from 'ngx-mask';
import { MaterialModule } from 'src/app/material/material.module';
import { SharedModule } from 'src/app/shared/shared.module';

@NgModule({
  declarations: [ExtratoAudiComponent],
  imports: [
    CommonModule,
    ExtratoAuditorRoutingModule,
    MaterialModule,
    FormsModule,
    ReactiveFormsModule,
    SharedModule,
    NgxMaskModule.forChild(),
  ],
})
export class ExtratoAuditorModule {}
