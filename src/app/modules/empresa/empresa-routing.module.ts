import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { CrudEmpresaComponent } from './crud-empresa/crud-empresa.component';
import { EmpresaViewComponent } from './empresa-view/empresa-view.component';
import { OpcoesGuard } from 'src/app/guards/opcoes.guard';

const routes: Routes = [
  { path: '', redirectTo: 'empresas', pathMatch: 'full' },
  { path: 'empresas', component: CrudEmpresaComponent },
  {
    path: 'empresa/:id/:acao',
    component: EmpresaViewComponent,
    canActivate: [OpcoesGuard],
  },
];
@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class EmpresaRoutingModule {}
