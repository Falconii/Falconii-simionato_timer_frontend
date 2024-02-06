import { Injectable } from '@angular/core';
import {
  ActivatedRouteSnapshot,
  CanActivate,
  RouterStateSnapshot,
  UrlTree,
} from '@angular/router';
import { Observable, Subscription } from 'rxjs';
import { GlobalService } from '../services/global.service';

@Injectable({
  providedIn: 'root',
})
export class OpcoesGuard implements CanActivate {
  constructor(private globalService: GlobalService) {}

  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ):
    | Observable<boolean | UrlTree>
    | Promise<boolean | UrlTree>
    | boolean
    | UrlTree {
    if (route.routeConfig?.path === 'empresa/:id/:acao') {
      return this.validar('empresa', route);
    }
    if (route.routeConfig?.path == 'usuario/:id_empresa/:id/:acao') {
      return this.validar('usuario', route);
    }
    if (route.routeConfig?.path == 'cliente/:id_empresa/:id/:acao') {
      return this.validar('cliente', route);
    }
    if (route.routeConfig?.path == 'economico/:id_empresa/:id/:acao') {
      return this.validar('economico', route);
    }
    if (route.routeConfig?.path == 'user/:id_empresa/:id/:acao') {
      return this.validar('user', route);
    }
    if (route.routeConfig?.path == 'motivo/:id_empresa/:codigo/:acao') {
      return this.validar('motivo', route);
    }
    if (route.routeConfig?.path == 'projeto/:id_empresa/:id/:acao') {
      return this.validar('projeto', route);
    }
    if (
      route.routeConfig?.path ==
      'anexaratividade/:id_empresa/:id_projeto/:id_atividade'
    ) {
      return this.validar('anexa_atividade', route);
    }

    return true;
  }

  validar(menu: string, route: ActivatedRouteSnapshot): boolean {
    let id: number;
    console.log(menu);
    if (typeof route.params.acao === 'undefined') return false;
    if (typeof route.params.id === 'undefined') {
      id = 0;
    } else {
      id = route.params.id as number;
    }
    return this.globalService.validarGuardiaoOpcoes(
      menu,
      route.params.acao,
      id
    );
  }
}
