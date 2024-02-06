import { OpcoesGuard } from './guards/opcoes.guard';
import { GlobalService } from './services/global.service';
import { DiganaoGuard } from './guards/diganao.guard';
import { MaterialModule } from './material/material.module';
import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { MAT_DATE_LOCALE } from '@angular/material/core';
import { LOCALE_ID } from '@angular/core';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { HomeComponent } from './home/home.component';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { NgxMaskModule } from 'ngx-mask';
import { SharedModule } from './shared/shared.module';
import { MatPaginatorIntl } from '@angular/material/paginator';
import { BrPaginatorIntl } from './shared/classes/br-PaginatorIntl';
import { DatePipe, DecimalPipe, registerLocaleData } from '@angular/common';
import { BarAtividadesComponent } from './home/bar-atividades/bar-atividades.component';
import { SituacaoProjetoPipe } from './shared/pipes/situacao-projeto.pipe';
import localePt from '@angular/common/locales/pt';
import { HoraSexagenalPipe } from './shared/pipes/hora-sexagenal.pipe';
import { SimNaoPipe } from './shared/pipes/sim-nao.pipe';
import { FeriadoTipoPipe } from './shared/pipes/feriado-tipo.pipe';
import { FeriadoNivelPipe } from './shared/pipes/feriado-nivel.pipe';
import { FirstNamePipe } from './shared/pipes/first-name.pipe';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
registerLocaleData(localePt);

@NgModule({
  declarations: [AppComponent, HomeComponent, BarAtividadesComponent],
  imports: [
    SharedModule,
    BrowserModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    MaterialModule,
    FormsModule,
    ReactiveFormsModule,
    HttpClientModule,
    NgxMaskModule.forRoot({
      dropSpecialCharacters: false,
    }),
  ],
  providers: [
    HttpClient,
    DatePipe,
    DecimalPipe,
    HoraSexagenalPipe,
    SituacaoProjetoPipe,
    FeriadoTipoPipe,
    FeriadoNivelPipe,
    SimNaoPipe,
    FirstNamePipe,
    { provide: MAT_DATE_LOCALE, useValue: 'pt-BR' },
    { provide: LOCALE_ID, useValue: 'pt' },
    DiganaoGuard,
    OpcoesGuard,
    GlobalService,
    { provide: MatPaginatorIntl, useClass: BrPaginatorIntl },
  ],
  bootstrap: [AppComponent],
})
export class AppModule {}
