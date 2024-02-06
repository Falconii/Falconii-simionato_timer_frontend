import { ClienteViewComponent } from './cliente-view/cliente-view.component';
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { CrudClienteComponent } from './crud-cliente/crud-cliente.component';
import { ClienteGuard } from 'src/app/guards/cliente.guard';
import { GuardiaoOpcoes } from 'src/app/shared/classes/Guardiao-Opcoes';
import { OpcoesGuard } from 'src/app/guards/opcoes.guard';

const routes: Routes = [
  { path: '', redirectTo: 'clientes', pathMatch: 'full' },
  {
    path: 'clientes',
    component: CrudClienteComponent,
    canActivate: [ClienteGuard],
  },
  {
    path: 'cliente/:id_empresa/:id/:acao',
    component: ClienteViewComponent,
    canActivate: [OpcoesGuard],
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ClienteRoutingModule {}
