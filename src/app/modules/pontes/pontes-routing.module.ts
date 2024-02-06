import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { CrudPonteComponent } from './crud-ponte/crud-ponte.component';
import { PonteViewComponent } from './ponte-view/ponte-view.component';

const routes: Routes = [
  { path: '', redirectTo: 'pontes', pathMatch: 'full' },
  { path: 'pontes', component: CrudPonteComponent },
  { path: 'ponte/:id_empresa/:data/:acao', component: PonteViewComponent },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class PontesRoutingModule {}
