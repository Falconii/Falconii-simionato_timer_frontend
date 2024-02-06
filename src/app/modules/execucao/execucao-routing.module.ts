import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { CrudExecucaoLancamentoComponent } from './crud-execucao-lancamento/crud-execucao-lancamento.component';

const routes: Routes = [
  { path: '', redirectTo: 'execucao', pathMatch: 'full' },
  { path: 'execucao', component: CrudExecucaoLancamentoComponent },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ExecucaoRoutingModule {}
