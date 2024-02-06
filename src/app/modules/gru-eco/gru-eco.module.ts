import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { GruEcoRoutingModule } from './gru-eco-routing.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgxMaskModule } from 'ngx-mask';
import { MaterialModule } from 'src/app/material/material.module';
import { SharedModule } from 'src/app/shared/shared.module';
import { CrudGrupoEcoComponent } from './crud-grupo-eco/crud-grupo-eco.component';
import { GruEcoViewComponent } from './gru-eco-view/gru-eco-view.component';

@NgModule({
  declarations: [CrudGrupoEcoComponent, GruEcoViewComponent],
  imports: [
    CommonModule,
    GruEcoRoutingModule,
    MaterialModule,
    FormsModule,
    ReactiveFormsModule,
    SharedModule,
    NgxMaskModule.forChild(),
  ],
})
export class GruEcoModule {}
