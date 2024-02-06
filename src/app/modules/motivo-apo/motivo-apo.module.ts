import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { MotivoApoRoutingModule } from './motivo-apo-routing.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgxMaskModule } from 'ngx-mask';
import { MaterialModule } from 'src/app/material/material.module';
import { SharedModule } from 'src/app/shared/shared.module';
import { CrudMotivoApoComponent } from './crud-motivo-apo/crud-motivo-apo.component';
import { MotivoApoViewComponent } from './motivo-apo-view/motivo-apo-view.component';
import { ScrollingModule } from '@angular/cdk/scrolling';

@NgModule({
  declarations: [CrudMotivoApoComponent, MotivoApoViewComponent],
  imports: [
    CommonModule,
    MotivoApoRoutingModule,
    MaterialModule,
    FormsModule,
    ReactiveFormsModule,
    ScrollingModule,
    SharedModule,
    NgxMaskModule.forChild(),
  ],
})
export class MotivoApoModule {}
