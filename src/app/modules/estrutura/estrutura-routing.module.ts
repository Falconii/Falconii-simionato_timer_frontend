import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { CrudEstruturaSemControleComponent } from './crud-estrutura-sem-controle/crud-estrutura-sem-controle.component';
import { CrudEstruturaComponent } from './crud-estrutura/crud-estrutura.component';
import { CrudSubestruturaComponent } from './crud-subestrutura/crud-subestrutura.component';
import { CrudViewEstruturaComponent } from './crud-view-estrutura/crud-view-estrutura.component';
import { TreeEstruturaV2Component } from './tree-estrutura-v2/tree-estrutura-v2.component';

const routes: Routes = [
  { path: '', redirectTo: 'estruturas', pathMatch: 'full' },
  { path: 'estruturas', component: CrudEstruturaComponent },
  {
    path: 'estrutura/:id_empresa/:conta/:versao/:subconta/:acao',
    component: CrudViewEstruturaComponent,
  },
  {
    path: 'estruturasemcontrole/:id_empresa/:conta/:versao/:subconta/:acao',
    component: CrudEstruturaSemControleComponent,
  },
  {
    path: 'subconta/:id_empresa/:conta/:versao/:subconta/:descricao/:nivel/:controle/:acao',
    component: CrudSubestruturaComponent,
  },
  {
    path: 'treeconta/:id_empresa/:conta/:versao/:subconta/:descricao/:nivel',
    component: TreeEstruturaV2Component,
  },
];

//estrutura/:id_empresa/:conta/:subconta/:acao'
@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class EstruturaRoutingModule {}
