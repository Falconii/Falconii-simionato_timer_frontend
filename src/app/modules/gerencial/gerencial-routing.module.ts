import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { VisaoaComponent } from './visaoa/visaoa.component';
const routes: Routes = [
  { path: '', redirectTo: 'visaoa', pathMatch: 'full' },
  { path: 'visaoa', component: VisaoaComponent },
];
@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class GerencialRoutingModule {}
