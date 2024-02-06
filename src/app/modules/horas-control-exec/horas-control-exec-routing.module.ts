import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { HorasLista01Component } from './horas-lista01/horas-lista01.component';

const routes: Routes = [
  { path: '', redirectTo: 'horas-lista-01', pathMatch: 'full' },
  { path: 'horas-lista-01', component: HorasLista01Component },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class HorasControlExecRoutingModule {}
