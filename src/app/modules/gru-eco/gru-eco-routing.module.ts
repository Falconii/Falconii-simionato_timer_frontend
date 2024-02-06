import { GruEcoViewComponent } from './gru-eco-view/gru-eco-view.component';
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { CrudClienteComponent } from '../cliente/crud-cliente/crud-cliente.component';
import { CrudGrupoEcoComponent } from './crud-grupo-eco/crud-grupo-eco.component';
import { OpcoesGuard } from 'src/app/guards/opcoes.guard';

const routes: Routes = [
  { path: '', redirectTo: 'economicos', pathMatch: 'full' },
  { path: 'economicos', component: CrudGrupoEcoComponent },
  {
    path: 'economico/:id_empresa/:id/:acao',
    component: GruEcoViewComponent,
    canActivate: [OpcoesGuard],
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class GruEcoRoutingModule {}
