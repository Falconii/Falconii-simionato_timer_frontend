import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { GerencialRoutingModule } from './gerencial-routing.module';
import { VisaoaComponent } from './visaoa/visaoa.component';
import { MaterialModule } from 'src/app/material/material.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgxMaskModule } from 'ngx-mask';
import { SharedModule } from 'src/app/shared/shared.module';

@NgModule({
  declarations: [VisaoaComponent],
  imports: [
    CommonModule,
    GerencialRoutingModule,
    MaterialModule,
    FormsModule,
    ReactiveFormsModule,
    SharedModule,
    NgxMaskModule.forChild(),
  ],
})
export class GerencialModule {}
