import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AgendaViewComponent } from './agenda-view/agenda-view.component';

const routes: Routes = [
  { path: '', redirectTo: 'agendatrabalhos', pathMatch: 'full' },
  { path: 'agendatrabalhos', component: AgendaViewComponent },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class AgendaAuditorRoutingModule {}
