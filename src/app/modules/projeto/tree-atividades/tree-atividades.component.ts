import { Component, OnInit, Injectable, Input } from '@angular/core';
import {
  CollectionViewer,
  SelectionChange,
  DataSource,
} from '@angular/cdk/collections';
import { FlatTreeControl } from '@angular/cdk/tree';
import { BehaviorSubject, merge, Observable, Subscription } from 'rxjs';
import { map } from 'rxjs/operators';
import { DynamicFlatNodeV2 } from './Dynamic-FlatNode-V2';
import { ParametroAtividade01 } from 'src/app/parametros/parametro-atividade01';
import { AtividadesService } from 'src/app/services/atividades.service';
import { GlobalService } from 'src/app/services/global.service';
import { AtividadeQuery_01Model } from 'src/app/Models/atividade-query_01-model';
import { AppSnackbar } from 'src/app/shared/classes/app-snackbar';
import { messageError } from 'src/app/shared/classes/util';
import { DynamicDatabase } from './Dynamic-Database';
import { DynamicDataSource } from './Dynamic-Data-Source';

@Component({
  selector: 'app-tree-atividades',
  templateUrl: './tree-atividades.component.html',
  styleUrls: ['./tree-atividades.component.css'],
})
export class TreeAtividadesComponent {
  @Input('CONTRATO') contrato: number = 0;

  inscricaoAtividades!: Subscription;

  dynamicFlatNodeV2: DynamicFlatNodeV2[] = [];

  atividades: AtividadeQuery_01Model[] = [];

  dynamicDatabase!: DynamicDatabase;

  treeControl: FlatTreeControl<DynamicFlatNodeV2>;

  //dataSource: DynamicDataSource;

  database!: DynamicDatabase;

  constructor(
    private atividadesService: AtividadesService,
    private globalService: GlobalService,
    private appSnackBar: AppSnackbar
  ) {
    this.treeControl = new FlatTreeControl<DynamicFlatNodeV2>(
      this.getLevel,
      this.isExpandable
    );

    //this.dataSource = new DynamicDataSource(this.treeControl, database);

    //this.dataSource.data = database.initialData();
  }

  ngOnInit(): void {
    this.getAtividades();
  }
  ngOnDestroy(): void {
    this.inscricaoAtividades?.unsubscribe();
  }

  getAtividades() {
    let para = new ParametroAtividade01();
    para.id_empresa = this.globalService.getIdEmpresa();
    para.id_projeto = this.contrato;
    para.orderby = 'projeto';
    this.globalService.setSpin(true);
    this.inscricaoAtividades = this.atividadesService
      .getAtividades_01(para)
      .subscribe(
        (data: AtividadeQuery_01Model[]) => {
          this.globalService.setSpin(false);
          this.atividades = data;
          this.dynamicDatabase = new DynamicDatabase(this.atividades);
        },
        (error: any) => {
          this.globalService.setSpin(false);
          this.appSnackBar.openFailureSnackBar(`${messageError(error)}`, 'OK');
        }
      );
  }

  getLevel = (node: DynamicFlatNodeV2) => node.level;

  isExpandable = (node: DynamicFlatNodeV2) => node.expandable;

  hasChild = (_: number, _nodeData: DynamicFlatNodeV2) => _nodeData.expandable;
}
