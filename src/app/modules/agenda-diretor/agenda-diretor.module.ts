import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { AgendaDiretorRoutingModule } from './agenda-diretor-routing.module';
import { AgendaViewComponent } from './agenda-view/agenda-view.component';
import { MaterialModule } from 'src/app/material/material.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgxMaskModule } from 'ngx-mask';
import { SharedModule } from 'src/app/shared/shared.module';

@NgModule({
  declarations: [AgendaViewComponent],
  imports: [
    CommonModule,
    AgendaDiretorRoutingModule,
    MaterialModule,
    FormsModule,
    ReactiveFormsModule,
    SharedModule,
    NgxMaskModule.forChild(),
  ],
})
export class AgendaDiretorModule {}
