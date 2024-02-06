import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { CrudFeriadoComponent } from './crud-feriado/crud-feriado.component';

const routes: Routes = [
  { path: '', redirectTo: 'feriados', pathMatch: 'full' },
  { path: 'feriados', component: CrudFeriadoComponent },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class FeriadoRoutingModule {}
