import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { FeriadoRoutingModule } from './feriado-routing.module';
import { CrudFeriadoComponent } from './crud-feriado/crud-feriado.component';
import { FeriadoViewComponent } from './feriado-view/feriado-view.component';
import { MaterialModule } from 'src/app/material/material.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { SharedModule } from 'src/app/shared/shared.module';
import { NgxMaskModule } from 'ngx-mask';
import { ScrollingModule } from '@angular/cdk/scrolling';
@NgModule({
  declarations: [CrudFeriadoComponent, FeriadoViewComponent],
  imports: [
    CommonModule,
    FeriadoRoutingModule,
    MaterialModule,
    FormsModule,
    ScrollingModule,
    ReactiveFormsModule,
    SharedModule,
    NgxMaskModule.forChild(),
  ],
})
export class FeriadoModule {}
