import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { HorasControlExecRoutingModule } from './horas-control-exec-routing.module';
import { HorasLista01Component } from './horas-lista01/horas-lista01.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { SharedModule } from 'src/app/shared/shared.module';
import { NgxMaskModule } from 'ngx-mask';
import { MaterialModule } from 'src/app/material/material.module';
import { ScrollingModule } from '@angular/cdk/scrolling';

@NgModule({
  declarations: [HorasLista01Component],
  imports: [
    CommonModule,
    HorasControlExecRoutingModule,
    MaterialModule,
    ScrollingModule,
    FormsModule,
    ReactiveFormsModule,
    SharedModule,
    NgxMaskModule.forChild(),
  ],
})
export class HorasControlExecModule {}
