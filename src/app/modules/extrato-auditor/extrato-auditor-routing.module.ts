import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ExtratoAudiComponent } from './extrato-audi/extrato-audi.component';

const routes: Routes = [
  { path: '', redirectTo: 'extratoaudi', pathMatch: 'full' },
  { path: 'extratoaudi', component: ExtratoAudiComponent },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ExtratoAuditorRoutingModule {}
