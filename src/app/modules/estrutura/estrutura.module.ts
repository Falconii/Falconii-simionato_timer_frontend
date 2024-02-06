import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { EstruturaRoutingModule } from './estrutura-routing.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgxMaskModule } from 'ngx-mask';
import { MaterialModule } from 'src/app/material/material.module';
import { SharedModule } from 'src/app/shared/shared.module';
import { CrudEstruturaComponent } from './crud-estrutura/crud-estrutura.component';
import { CrudSubestruturaComponent } from './crud-subestrutura/crud-subestrutura.component';
import { TreeEstruturaV2Component } from './tree-estrutura-v2/tree-estrutura-v2.component';
import { CrudViewEstruturaComponent } from './crud-view-estrutura/crud-view-estrutura.component';
import { CrudEstruturaSemControleComponent } from './crud-estrutura-sem-controle/crud-estrutura-sem-controle.component';

@NgModule({
  declarations: [
    CrudEstruturaComponent,
    TreeEstruturaV2Component,
    CrudSubestruturaComponent,
    CrudViewEstruturaComponent,
    CrudEstruturaSemControleComponent,
  ],
  imports: [
    CommonModule,
    EstruturaRoutingModule,
    MaterialModule,
    FormsModule,
    ReactiveFormsModule,
    SharedModule,
    NgxMaskModule.forChild(),
  ],
})
export class EstruturaModule {}
