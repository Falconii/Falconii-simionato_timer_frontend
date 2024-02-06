import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ClienteScrollRoutingModule } from './cliente-scroll-routing.module';
import { CrudClienteComponent } from './crud-cliente/crud-cliente.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgxMaskModule } from 'ngx-mask';
import { MaterialModule } from 'src/app/material/material.module';
import { SharedModule } from 'src/app/shared/shared.module';
import { ScrollingModule } from '@angular/cdk/scrolling';
import { ClienteViewComponent } from './cliente-view/cliente-view.component';

@NgModule({
  declarations: [CrudClienteComponent, ClienteViewComponent],
  imports: [
    CommonModule,
    ClienteScrollRoutingModule,
    MaterialModule,
    FormsModule,
    ReactiveFormsModule,
    ScrollingModule,
    SharedModule,
    NgxMaskModule.forChild(),
  ],
})
export class ClienteScrollModule {}
