import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { CrudGrupoEcoComponent } from './crud-grupo-eco/crud-grupo-eco.component';
import { GruEcoViewComponent } from './gru-eco-view/gru-eco-view.component';

const routes: Routes = [
  { path: '', redirectTo: 'economicos-scroll', pathMatch: 'full' },
  { path: 'economicos-scroll', component: CrudGrupoEcoComponent },
  { path: 'economicos-scroll/:retorno', component: CrudGrupoEcoComponent },
  {
    path: 'economico-scroll/:id_empresa/:id/:acao',
    component: GruEcoViewComponent,
    canActivate: [],
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class GruEcoScrollRoutingModule {}
