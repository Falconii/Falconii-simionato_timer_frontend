import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { CrudGrupoUserComponent } from './crud-grupo-user/crud-grupo-user.component';
import { GruUserViewComponent } from './gru-user-view/gru-user-view.component';
import { OpcoesGuard } from 'src/app/guards/opcoes.guard';

const routes: Routes = [
  { path: '', redirectTo: 'users', pathMatch: 'full' },
  { path: 'users', component: CrudGrupoUserComponent },
  { path: 'users:/retorno', component: CrudGrupoUserComponent },
  {
    path: 'user/:id_empresa/:id/:acao',
    component: GruUserViewComponent,
    canActivate: [OpcoesGuard],
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class GruUserRoutingModule {}
