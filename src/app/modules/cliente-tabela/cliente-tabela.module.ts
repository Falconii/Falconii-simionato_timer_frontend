import { MaterialModule } from './../../material/material.module';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ClienteTabelaRoutingModule } from './cliente-tabela-routing.module';
import { ClienteTabelaComponent } from './cliente-tabela/cliente-tabela.component';

@NgModule({
  declarations: [ClienteTabelaComponent],
  imports: [CommonModule, MaterialModule, ClienteTabelaRoutingModule],
})
export class ClienteTabelaModule {}
