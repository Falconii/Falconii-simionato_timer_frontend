import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { CrudEspecialComponent } from './crud-especial/crud-especial.component';
import { EspecialViewComponent } from './especial-view/especial-view.component';

const routes: Routes = [
  { path: '', redirectTo: 'especiais', pathMatch: 'full' },
  { path: 'especiais', component: CrudEspecialComponent },
  { path: 'especiais/:retorno', component: CrudEspecialComponent },
  {
    path: 'especial/:id_empresa/:id_usuario/:id_tipo/:data/:acao',
    component: EspecialViewComponent,
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class DataEspecialRoutingModule {}
