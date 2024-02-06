import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { CrudMotivoApoComponent } from './crud-motivo-apo/crud-motivo-apo.component';
import { MotivoApoViewComponent } from './motivo-apo-view/motivo-apo-view.component';
import { OpcoesGuard } from 'src/app/guards/opcoes.guard';

const routes: Routes = [
  { path: '', redirectTo: 'motivos', pathMatch: 'full' },
  { path: 'motivos', component: CrudMotivoApoComponent },
  { path: 'motivos/:retorno', component: CrudMotivoApoComponent },
  {
    path: 'motivo/:id_empresa/:codigo/:acao',
    component: MotivoApoViewComponent,
    canActivate: [OpcoesGuard],
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class MotivoApoRoutingModule {}
