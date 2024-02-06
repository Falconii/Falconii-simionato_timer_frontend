import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { GruUserRoutingModule } from './gru-user-routing.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgxMaskModule } from 'ngx-mask';
import { MaterialModule } from 'src/app/material/material.module';
import { GruUserViewComponent } from './gru-user-view/gru-user-view.component';
import { SharedModule } from 'src/app/shared/shared.module';
import { CrudGrupoUserComponent } from './crud-grupo-user/crud-grupo-user.component';
import { ScrollingModule } from '@angular/cdk/scrolling';

@NgModule({
  declarations: [CrudGrupoUserComponent, GruUserViewComponent],
  imports: [
    CommonModule,
    GruUserRoutingModule,
    MaterialModule,
    FormsModule,
    ScrollingModule,
    ReactiveFormsModule,
    SharedModule,
    NgxMaskModule.forChild(),
  ],
})
export class GruUserModule {}
