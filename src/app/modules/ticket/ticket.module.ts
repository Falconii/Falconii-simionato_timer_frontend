import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { TicketRoutingModule } from './ticket-routing.module';
import { CrudTicketComponent } from './crud-ticket/crud-ticket.component';
import { TicketViewComponent } from './ticket-view/ticket-view.component';
import { TicketLiberacaoComponent } from './ticket-liberacao/ticket-liberacao.component';


@NgModule({
  declarations: [
    CrudTicketComponent,
    TicketViewComponent,
    TicketLiberacaoComponent
  ],
  imports: [
    CommonModule,
    TicketRoutingModule
  ]
})
export class TicketModule { }
