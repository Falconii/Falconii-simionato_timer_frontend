import { MaterialModule } from 'src/app/material/material.module';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { GruEcoScrollRoutingModule } from './gru-eco-scroll-routing.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgxMaskModule } from 'ngx-mask';
import { SharedModule } from 'src/app/shared/shared.module';
import { CrudGrupoEcoComponent } from './crud-grupo-eco/crud-grupo-eco.component';
import { GruEcoViewComponent } from './gru-eco-view/gru-eco-view.component';
import { ScrollingModule } from '@angular/cdk/scrolling';

@NgModule({
  declarations: [CrudGrupoEcoComponent, GruEcoViewComponent],
  imports: [
    CommonModule,
    GruEcoScrollRoutingModule,
    MaterialModule,
    FormsModule,
    ScrollingModule,
    ReactiveFormsModule,
    SharedModule,
    NgxMaskModule.forChild(),
  ],
})
export class GruEcoScrollModule {}
