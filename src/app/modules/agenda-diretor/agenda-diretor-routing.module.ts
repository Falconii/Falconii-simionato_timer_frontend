import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AgendaViewComponent } from './agenda-view/agenda-view.component';

const routes: Routes = [
  { path: '', redirectTo: 'agendaprojeto', pathMatch: 'full' },
  { path: 'agendaprojeto', component: AgendaViewComponent },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class AgendaDiretorRoutingModule {}
