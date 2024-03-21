import { FeriadoViewComponent } from './feriado-view/feriado-view.component';
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { CrudFeriadoComponent } from './crud-feriado/crud-feriado.component';

const routes: Routes = [
  { path: '', redirectTo: 'feriados', pathMatch: 'full' },
  { path: 'feriados', component: CrudFeriadoComponent },
  { path: 'feriados/:retorno', component: CrudFeriadoComponent },
  {
    path: 'feriado/:id_empresa/:id_usuario/:id_tipo/:data/:acao',
    component: FeriadoViewComponent,
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class FeriadoRoutingModule {}
