import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { CrudClienteComponent } from './crud-cliente/crud-cliente.component';
import { ClienteViewComponent } from './cliente-view/cliente-view.component';

const routes: Routes = [
  { path: '', redirectTo: 'clientes-scroll', pathMatch: 'full' },
  {
    path: 'clientes-scroll',
    component: CrudClienteComponent,
    canActivate: [],
  },
  {
    path: 'clientes-scroll/:retorno',
    component: CrudClienteComponent,
    canActivate: [],
  },
  {
    path: 'cliente-scroll/:id_empresa/:id/:acao',
    component: ClienteViewComponent,
    canActivate: [],
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ClienteScrollRoutingModule {}
