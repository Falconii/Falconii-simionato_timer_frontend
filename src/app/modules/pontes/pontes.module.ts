import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PontesRoutingModule } from './pontes-routing.module';
import { MaterialModule } from 'src/app/material/material.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ScrollingModule } from '@angular/cdk/scrolling';
import { SharedModule } from 'src/app/shared/shared.module';
import { NgxMaskModule } from 'ngx-mask';
import { CrudPonteComponent } from './crud-ponte/crud-ponte.component';
import { PonteViewComponent } from './ponte-view/ponte-view.component';
import { AlterDescricaoDialogComponent } from './alter-descricao-dialog/alter-descricao-dialog.component';

@NgModule({
  declarations: [
    CrudPonteComponent,
    PonteViewComponent,
    AlterDescricaoDialogComponent,
  ],
  imports: [
    CommonModule,
    PontesRoutingModule,
    MaterialModule,
    FormsModule,
    ScrollingModule,
    ReactiveFormsModule,
    SharedModule,
    NgxMaskModule.forChild(),
  ],
})
export class PontesModule {}
