import { ClienteTabelaComponent } from './cliente-tabela/cliente-tabela.component';
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

const routes: Routes = [
  { path: '', redirectTo: 'clientetabela', pathMatch: 'full' },
  { path: 'clientetabela', component: ClienteTabelaComponent },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ClienteTabelaRoutingModule {}
