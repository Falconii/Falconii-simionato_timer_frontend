import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { AgendaAuditorRoutingModule } from './agenda-auditor-routing.module';
import { AgendaViewComponent } from './agenda-view/agenda-view.component';
import { MaterialModule } from 'src/app/material/material.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { SharedModule } from 'src/app/shared/shared.module';
import { NgxMaskModule } from 'ngx-mask';

@NgModule({
  declarations: [AgendaViewComponent],
  imports: [
    CommonModule,
    AgendaAuditorRoutingModule,
    MaterialModule,
    FormsModule,
    ReactiveFormsModule,
    SharedModule,
    NgxMaskModule.forChild(),
  ],
})
export class AgendaAuditorModule {}
