import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { EmpresaRoutingModule } from './empresa-routing.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgxMaskModule } from 'ngx-mask';
import { MaterialModule } from 'src/app/material/material.module';
import { SharedModule } from 'src/app/shared/shared.module';
import { CrudEmpresaComponent } from './crud-empresa/crud-empresa.component';
import { EmpresaViewComponent } from './empresa-view/empresa-view.component';

@NgModule({
  declarations: [CrudEmpresaComponent, EmpresaViewComponent],
  imports: [
    CommonModule,
    EmpresaRoutingModule,
    MaterialModule,
    FormsModule,
    ReactiveFormsModule,
    SharedModule,
    NgxMaskModule.forChild(),
  ],
})
export class EmpresaModule {}
