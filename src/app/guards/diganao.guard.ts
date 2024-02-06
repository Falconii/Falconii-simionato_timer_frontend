import { GlobalService } from './../services/global.service';
import { Injectable } from '@angular/core';
import {
  ActivatedRouteSnapshot,
  CanActivate,
  Router,
  RouterStateSnapshot,
} from '@angular/router';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class DiganaoGuard implements CanActivate {
  constructor(private globalService: GlobalService, private router: Router) {}
  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): boolean {
    let retorno = false;
    if (!this.globalService.getLogado()) return false;
    retorno = this.globalService.validarGuardiaoMestre(route.routeConfig?.path);
    if (!retorno) {
      this.router.navigate(['/home']);
    }
    return retorno;
  }
}
