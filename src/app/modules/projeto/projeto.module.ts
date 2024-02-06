import { PeriodoDialogComponent } from '../../shared/components/periodo-dialog/periodo-dialog.component';
import { HorasDiretoriaComponent } from './horas-diretoria/horas-diretoria.component';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ProjetoRoutingModule } from './projeto-routing.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgxMaskModule } from 'ngx-mask';
import { MaterialModule } from 'src/app/material/material.module';
import { SharedModule } from 'src/app/shared/shared.module';
import { ProjetoViewComponent } from './projeto-view/projeto-view.component';
import { CrudProjetoComponent } from './crud-projeto/crud-projeto.component';
import { CrudAtividadeProjetoComponent } from './crud-atividade-projeto/crud-atividade-projeto.component';
import { CrudPlanejamentoLancamentoComponent } from './crud-planejamento-lancamento/crud-planejamento-lancamento.component';
import { RespAudiDialogComponent } from './crud-atividade-projeto/resp-audi-dialog/resp-audi-dialog.component';
import { ManutAtividadeLoteComponent } from './manut-atividade-lote/manut-atividade-lote.component';
import { ScrollingModule } from '@angular/cdk/scrolling';
import { HorasDiretoriaDialogComponent } from './horas-diretoria/horas-diretoria-dialog/horas-diretoria-dialog.component';
import { AnexarV2Component } from './anexar-v2/anexar-v2.component';
import { Dashboardv1Component } from './dashboardv1/dashboardv1.component';
import { FinanceiroComponent } from './financeiro/financeiro.component';
import { TreeAtividadesComponent } from './tree-atividades/tree-atividades.component';

@NgModule({
  declarations: [
    CrudProjetoComponent,
    ProjetoViewComponent,
    CrudAtividadeProjetoComponent,
    CrudPlanejamentoLancamentoComponent,
    RespAudiDialogComponent,
    ManutAtividadeLoteComponent,
    HorasDiretoriaComponent,
    HorasDiretoriaDialogComponent,
    RespAudiDialogComponent,
    AnexarV2Component,
    Dashboardv1Component,
    FinanceiroComponent,
    TreeAtividadesComponent,
  ],
  imports: [
    ScrollingModule,
    CommonModule,
    ProjetoRoutingModule,
    MaterialModule,
    FormsModule,
    ScrollingModule,
    ReactiveFormsModule,
    SharedModule,
    NgxMaskModule.forChild(),
  ],
})
export class ProjetoModule {}
