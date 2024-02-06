import { ParametroAuditoria01 } from './../../../parametros/parametro-auditoria01';
import { ParametroAtividade01 } from 'src/app/parametros/parametro-atividade01';
import { AuditoriasService } from './../../../services/auditorias.service';
import { AuditoriaModel } from './../../../Models/auditoria-model';
import { GlobalService } from './../../../services/global.service';
import { Component, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { unsupported } from '@angular/compiler/src/render3/view/util';
import { DataYYYYMMDDTHHMMSSZ } from 'src/app/shared/classes/util';

@Component({
  selector: 'app-dashboard01',
  templateUrl: './dashboard01.component.html',
  styleUrls: ['./dashboard01.component.css'],
})
export class Dashboard01Component implements OnInit {
  constructor(
    private globalService: GlobalService,
    private auditoriasService: AuditoriasService
  ) {}

  inscricaoInsertAuditoria!: Subscription;
  inscricaoUpdateAuditoria!: Subscription;
  inscricaoDeleteAuditoria!: Subscription;
  inscricaoGetAuditoria!: Subscription;

  auditoria: AuditoriaModel = new AuditoriaModel();
  lsAuditorias: AuditoriaModel[] = [];
  retorno: any = '';

  ngOnInit(): void {
    this.insertAuditoria();
  }

  ngOnDestroy(): void {
    this.inscricaoGetAuditoria?.unsubscribe();
    this.inscricaoDeleteAuditoria?.unsubscribe();
    this.inscricaoInsertAuditoria?.unsubscribe();
    this.inscricaoUpdateAuditoria?.unsubscribe();
  }

  onDelete() {
    this.deleteAuditoria();
  }

  insertAuditoria() {
    this.auditoria = new AuditoriaModel();
    this.auditoria.id_empresa = this.globalService.id_empresa;
    this.auditoria.descricao = 'TESTE DE INCLUSÃO';
    this.auditoria.data = DataYYYYMMDDTHHMMSSZ(new Date());
    this.auditoria.user_insert = this.globalService.getUsuario().id;
    this.inscricaoInsertAuditoria = this.auditoriasService
      .auditoriaInsert(this.auditoria)
      .subscribe(
        async (data: AuditoriaModel) => {
          this.auditoria = data;
          this.updateAuditoria();
        },
        (error: any) => {
          console.log('Error', error);
        }
      );
  }

  updateAuditoria() {
    this.auditoria.descricao = 'Eu Fui Alterado!';
    this.auditoria.user_update = this.globalService.getUsuario().id;
    this.auditoria.data = DataYYYYMMDDTHHMMSSZ(new Date());
    this.inscricaoUpdateAuditoria = this.auditoriasService
      .auditoriaUpdate(this.auditoria)
      .subscribe(
        async (data: any) => {
          this.retorno = data;
          this.getAuditoria();
        },
        (error: any) => {
          console.log('Error', error);
        }
      );
  }

  deleteAuditoria() {
    this.auditoria = this.lsAuditorias[this.lsAuditorias.length - 1];
    this.inscricaoUpdateAuditoria = this.auditoriasService
      .auditoriaDelete(this.auditoria.id_empresa, this.auditoria.id)
      .subscribe(
        async (data: any) => {
          this.retorno = data;
          this.getAuditoria();
        },
        (error: any) => {
          console.log('Error', error);
        }
      );
  }

  getAuditoria() {
    const par: ParametroAuditoria01 = new ParametroAuditoria01();

    par.id_empresa = 1;

    this.inscricaoGetAuditoria = this.auditoriasService
      .getAuditorias_01(par)
      .subscribe(
        (data: AuditoriaModel[]) => {
          this.lsAuditorias = data;
        },
        (error: any) => {
          this.lsAuditorias = [];
          console.log('Error', error);
        }
      );
  }
}
