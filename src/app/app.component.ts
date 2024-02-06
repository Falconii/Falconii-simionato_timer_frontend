import { Component, OnInit } from '@angular/core';
import { GlobalService } from './services/global.service';
import { Router } from '@angular/router';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
})
export class AppComponent {
  title = 'timer';

  showMenu: boolean = false;

  opcao: string = '';

  apiURL: string = '';

  constructor(private globalService: GlobalService, private router: Router) {}

  ngOnInit(): void {
    this.apiURL = environment.apiURL;
    this.globalService.shomMenuEmitter.subscribe((show) => {
      this.showMenu = show;
    });
    this.onLogin();
  }

  ngOnDestroy(): void {
    this.globalService.shomMenuEmitter.unsubscribe();
  }

  onLogin() {
    this.router.navigate(['/login']);
  }

  getUsuario(): string {
    return this.globalService.getNomeusuarioLogado();
  }

  okCadastros(): boolean {
    return this.globalService.okCadastros();
  }

  okProjetos(): boolean {
    return this.globalService.okProjetos();
  }

  okPlanejamento(): boolean {
    return this.globalService.okPlanejamento();
  }

  okExecucao(): boolean {
    return this.globalService.okExecucao();
  }

  okGerencial(): boolean {
    return this.globalService.okGerencial();
  }

  getClassMenu(): string {
    if (this.opcao == 'Cadastros') return 'menu-ativo';
    return 'menu-standyby';
  }

  setOpcao(value: string): void {
    this.opcao = value;
  }

  getUsuarioId(): number {
    return this.globalService.getUsuario().id;
  }
}
