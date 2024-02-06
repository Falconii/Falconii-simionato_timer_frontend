import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AgendaViewComponent } from './agenda-view/agenda-view.component';

const routes: Routes = [
  { path: '', redirectTo: 'agendacoordenador', pathMatch: 'full' },
  { path: 'agendacoordenador', component: AgendaViewComponent },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class AgendaCoordenadorRoutingModule {}
