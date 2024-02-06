import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { CrudExecucaoComponent } from './crud-Execucao/crud-Execucao.component';
import { CrudExecucaoMultiComponent } from './crud-execucao-multi/crud-execucao-multi.component';

const routes: Routes = [
  { path: '', redirectTo: 'execucoesv2', pathMatch: 'full' },
  { path: 'execucoesv2', component: CrudExecucaoComponent },
  { path: 'execucoesv2/:data', component: CrudExecucaoComponent },
  { path: 'execucoesv2multi/:data', component: CrudExecucaoMultiComponent },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ExecucaoV2RoutingModule {}
