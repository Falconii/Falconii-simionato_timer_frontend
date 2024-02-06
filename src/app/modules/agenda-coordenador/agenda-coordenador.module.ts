import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { AgendaCoordenadorRoutingModule } from './agenda-coordenador-routing.module';
import { AgendaViewComponent } from './agenda-view/agenda-view.component';
import { MaterialModule } from 'src/app/material/material.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { SharedModule } from 'src/app/shared/shared.module';
import { NgxMaskModule } from 'ngx-mask';

@NgModule({
  declarations: [AgendaViewComponent],
  imports: [
    CommonModule,
    AgendaCoordenadorRoutingModule,
    MaterialModule,
    FormsModule,
    ReactiveFormsModule,
    SharedModule,
    NgxMaskModule.forChild(),
  ],
})
export class AgendaCoordenadorModule {}
