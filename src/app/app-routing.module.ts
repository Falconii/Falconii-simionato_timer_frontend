import { TicketModule } from './modules/ticket/ticket.module';
import { HorasControlExecModule } from './modules/horas-control-exec/horas-control-exec.module';
import { DiganaoGuard } from './guards/diganao.guard';
import { HomeComponent } from './home/home.component';
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
const routes: Routes = [
  { path: '', redirectTo: 'home', pathMatch: 'full' },
  { path: 'home', component: HomeComponent },
  {
    path: 'login',
    loadChildren: () =>
      import('./modules/login/login.module').then((m) => m.LoginModule),
  },
  {
    path: 'empresas',
    loadChildren: () =>
      import('./modules/empresa/empresa.module').then((m) => m.EmpresaModule),
    canActivate: [DiganaoGuard],
  },
  {
    path: 'usuarios',
    loadChildren: () =>
      import('./modules/usuario/usuario.module').then((m) => m.UsuarioModule),
    canActivate: [DiganaoGuard],
  },
  {
    path: 'atualizacao/:id_empresa/:email',
    loadChildren: () =>
      import('./modules/usuario/usuario.module').then((m) => m.UsuarioModule),
    canActivate: [DiganaoGuard],
  },
  {
    path: 'clientes',
    loadChildren: () =>
      import('./modules/cliente/cliente.module').then((m) => m.ClienteModule),
    canActivate: [],
  },
  {
    path: 'economicos',
    loadChildren: () =>
      import('./modules/gru-eco/gru-eco.module').then((m) => m.GruEcoModule),
    canActivate: [DiganaoGuard],
  },
  {
    path: 'users',
    loadChildren: () =>
      import('./modules/gru-user/gru-user.module').then((m) => m.GruUserModule),
    canActivate: [DiganaoGuard],
  },
  {
    path: 'motivos',
    loadChildren: () =>
      import('./modules/motivo-apo/motivo-apo.module').then(
        (m) => m.MotivoApoModule
      ),
    canActivate: [DiganaoGuard],
  },
  {
    path: 'estruturas',
    loadChildren: () =>
      import('./modules/estrutura/estrutura.module').then(
        (m) => m.EstruturaModule
      ),
    canActivate: [DiganaoGuard],
  },
  {
    path: 'projetos',
    loadChildren: () =>
      import('./modules/projeto/projeto.module').then((m) => m.ProjetoModule),
    canActivate: [DiganaoGuard],
  },
  {
    path: 'agendaprojeto',
    loadChildren: () =>
      import('./modules/agenda-diretor/agenda-diretor.module').then(
        (m) => m.AgendaDiretorModule
      ),
    canActivate: [DiganaoGuard],
  },
  {
    path: 'dashboard',
    loadChildren: () =>
      import('./modules/dashboard/dashboard.module').then(
        (m) => m.DashboardModule
      ),
    canActivate: [DiganaoGuard],
  },
  {
    path: 'horas-lista-01',
    loadChildren: () =>
      import('./modules/horas-control-exec/horas-control-exec.module').then(
        (m) => m.HorasControlExecModule
      ),
    canActivate: [],
  },
  {
    path: 'feriados',
    loadChildren: () =>
      import('./modules/feriado/feriado.module').then((m) => m.FeriadoModule),
    canActivate: [],
  },
  {
    path: 'especiais',
    loadChildren: () =>
      import('./modules/data-especial/data-especial.module').then(
        (m) => m.DataEspecialModule
      ),
    canActivate: [],
  },
  {
    path: 'gerencial',
    loadChildren: () =>
      import('./modules/gerencial/gerencial.module').then(
        (m) => m.GerencialModule
      ),
    canActivate: [DiganaoGuard],
  },
  {
    path: 'execucao',
    loadChildren: () =>
      import('./modules/execucao-v2/execucao-v2.module').then(
        (m) => m.ExecucaoV2Module
      ),
    canActivate: [DiganaoGuard],
  },
  {
    path: 'extratoaudi',
    loadChildren: () =>
      import('./modules/extrato-auditor/extrato-auditor.module').then(
        (m) => m.ExtratoAuditorModule
      ),
    canActivate: [DiganaoGuard],
  },
  {
    path: 'agendatrabalhos',
    loadChildren: () =>
      import('./modules/agenda-auditor/agenda-auditor.module').then(
        (m) => m.AgendaAuditorModule
      ),
    canActivate: [DiganaoGuard],
  },
  {
    path: 'agendacoordenador',
    loadChildren: () =>
      import('./modules/agenda-coordenador/agenda-coordenador.module').then(
        (m) => m.AgendaCoordenadorModule
      ),
    canActivate: [DiganaoGuard],
  },
  {
    path: 'programacao',
    loadChildren: () =>
      import('./modules/programacao/programacao.module').then(
        (m) => m.ProgramacaoModule
      ),
    canActivate: [DiganaoGuard],
  },
  {
    path: 'sobre',
    loadChildren: () =>
      import('./modules/sobre/sobre.module').then((m) => m.SobreModule),
    canActivate: [DiganaoGuard],
  },
  {
    path: 'tabela',
    loadChildren: () =>
      import('./modules/cliente-tabela/cliente-tabela.module').then(
        (m) => m.ClienteTabelaModule
      ),
    canActivate: [DiganaoGuard],
  },
  {
    path: 'clientes-scroll',
    loadChildren: () =>
      import('./modules/cliente-scroll/cliente-scroll.module').then(
        (m) => m.ClienteScrollModule
      ),
    canActivate: [],
  },
  {
    path: 'economicos-scroll',
    loadChildren: () =>
      import('./modules/gru-eco-scroll/gru-eco-scroll.module').then(
        (m) => m.GruEcoScrollModule
      ),
    canActivate: [],
  },
  {
    path: 'tickets',
    loadChildren: () =>
      import('./modules/ticket/ticket.module').then((m) => m.TicketModule),
    canActivate: [],
  },
  {
    path: 'tickets-liberacao',
    loadChildren: () =>
      import('./modules/ticket/ticket.module').then((m) => m.TicketModule),
    canActivate: [],
  },

  {
    path: '**',
    redirectTo: 'home',
  },
];
@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
