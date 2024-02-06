import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ProgramacaoComponent } from './programacao/programacao.component';

const routes: Routes = [
  { path: '', redirectTo: 'programacao', pathMatch: 'full' },
  { path: 'programacao', component: ProgramacaoComponent },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ProgramacaoRoutingModule {}
