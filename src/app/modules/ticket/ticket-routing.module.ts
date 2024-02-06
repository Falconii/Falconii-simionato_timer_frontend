import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { CrudTicketComponent } from './crud-ticket/crud-ticket.component';
import { TicketViewComponent } from './ticket-view/ticket-view.component';
import { TicketLiberacaoComponent } from './ticket-liberacao/ticket-liberacao.component';

const routes: Routes = [
  { path: '', redirectTo: 'tickets', pathMatch: 'full' },
  { path: 'tickets', component: CrudTicketComponent },
  { path: 'tickets/:retorno', component: CrudTicketComponent },
  {
    path: 'tickets/:id_empresa/:referencia/:acao',
    component: TicketViewComponent,
    canActivate: [],
  },
  {
    path: 'tickets/liberacao',
    component: TicketLiberacaoComponent,
    canActivate: [],
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class TicketRoutingModule {}
