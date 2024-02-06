import { UsuarioGuard } from './usuario.guard';
import { UsuarioViewComponent } from './usuario-view/usuario-view.component';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { UsuarioRoutingModule } from './usuario-routing.module';
import { CrudUsuarioComponent } from './crud-usuario/crud-usuario.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgxMaskModule } from 'ngx-mask';
import { MaterialModule } from 'src/app/material/material.module';
import { SharedModule } from 'src/app/shared/shared.module';
import { ScrollingModule } from '@angular/cdk/scrolling';

@NgModule({
  declarations: [CrudUsuarioComponent, UsuarioViewComponent],
  imports: [
    CommonModule,
    UsuarioRoutingModule,
    MaterialModule,
    FormsModule,
    ScrollingModule,
    ReactiveFormsModule,
    SharedModule,
    NgxMaskModule.forChild(),
  ],
  providers: [UsuarioGuard],
})
export class UsuarioModule {}
