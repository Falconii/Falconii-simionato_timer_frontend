import { CrudProjetoComponent } from './crud-projeto/crud-projeto.component';
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ProjetoViewComponent } from './projeto-view/projeto-view.component';
import { CrudAtividadeProjetoComponent } from './crud-atividade-projeto/crud-atividade-projeto.component';
import { CrudPlanejamentoLancamentoComponent } from './crud-planejamento-lancamento/crud-planejamento-lancamento.component';
import { ManutAtividadeLoteComponent } from './manut-atividade-lote/manut-atividade-lote.component';
import { HorasDiretoriaComponent } from './horas-diretoria/horas-diretoria.component';
import { AnexarV2Component } from './anexar-v2/anexar-v2.component';
import { OpcoesGuard } from 'src/app/guards/opcoes.guard';
import { Dashboardv1Component } from './dashboardv1/dashboardv1.component';
import { FinanceiroComponent } from './financeiro/financeiro.component';

const routes: Routes = [
  { path: '', redirectTo: 'projetos', pathMatch: 'full' },
  { path: 'projetos', component: CrudProjetoComponent },
  { path: 'projetos/:retorno', component: CrudProjetoComponent },
  {
    path: 'projeto/:id_empresa/:id/:acao',
    component: ProjetoViewComponent,
    canActivate: [OpcoesGuard],
  },
  {
    path: 'anexaratividade/:id_empresa/:id_projeto/:id_atividade',
    component: CrudAtividadeProjetoComponent,
  },
  {
    path: 'planejamentoagenda/:id_empresa/:id_atividade',
    component: CrudPlanejamentoLancamentoComponent,
  },
  {
    path: 'manuemlote/:id_empresa/:conta/:id_projeto',
    component: ManutAtividadeLoteComponent,
  },
  {
    path: 'anexarv2/:conta/:conta_versao/:id_projeto/:id_resp/:id_exec',
    component: AnexarV2Component,
  },
  {
    path: 'horasdiretoria/:id_empresa/:id_projeto',
    component: HorasDiretoriaComponent,
  },
  {
    path: 'dashboardv1/:id_empresa/:id_projeto',
    component: Dashboardv1Component,
  },
  {
    path: 'financeiro/:id_empresa/:id_projeto',
    component: FinanceiroComponent,
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ProjetoRoutingModule {}
