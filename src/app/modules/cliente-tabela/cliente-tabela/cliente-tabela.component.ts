import { ClientesModel } from 'src/app/Models/cliente-model';
import { ClientesQuery01Model } from './../../../Models/cliente-query_01-model';
import { ClientesService } from './../../../services/clientes.service';
import { GlobalService } from './../../../services/global.service';
import { Component, Inject, OnInit, ViewChild } from '@angular/core';
import { Subscription } from 'rxjs';
import { ParametroCliente01 } from 'src/app/parametros/parametro-cliente-01';
import { AppSnackbar } from 'src/app/shared/classes/app-snackbar';

@Component({
  selector: 'app-cliente-tabela',
  templateUrl: './cliente-tabela.component.html',
  styleUrls: ['./cliente-tabela.component.css'],
})
export class ClienteTabelaComponent implements OnInit {
  inscricaoGetAll!: Subscription;
  inscricaoGetContador!: Subscription;
  inscricaoGetCliente!: Subscription;

  lsClientes: ClientesQuery01Model[] = [];
  displayedColumns: string[] = ['id', 'razao', 'fantasi', 'grupo', 'acao'];

  length = 50;
  pageSize = 10;
  pageIndex = 0;
  pageSizeOptions = [5, 10, 25];

  hidePageSize = false;
  showPageSizeOptions = true;
  showFirstLastButtons = true;
  disabled = false;

  constructor(
    private globalService: GlobalService,
    private clientesServices: ClientesService,
    private appSnackBar: AppSnackbar
  ) {}

  ngOnInit(): void {
    this.getClientesContador();
  }

  ngOnDestroy(): void {
    this.inscricaoGetAll?.unsubscribe();
    this.inscricaoGetContador?.unsubscribe();
    this.inscricaoGetCliente?.unsubscribe();
  }

  getClientes() {
    let par = new ParametroCliente01();

    par.id_empresa = 1;
    par.contador = 'N';
    par.pagina = this.pageIndex + 1;
    par.tamPagina = this.pageSize;

    this.globalService.setSpin(true);
    this.inscricaoGetAll = this.clientesServices.getClientes_01(par).subscribe(
      (data: ClientesQuery01Model[]) => {
        this.globalService.setSpin(false);
        this.lsClientes = data;
      },
      (error: any) => {
        this.globalService.setSpin(false);
        this.lsClientes = [];
      }
    );
  }

  getClientesContador() {
    let par = new ParametroCliente01();

    par.id_empresa = 1;

    par.contador = 'S';

    this.globalService.setSpin(true);
    this.inscricaoGetContador = this.clientesServices
      .getClientes_01_C(par)
      .subscribe(
        (data: any) => {
          this.globalService.setSpin(false);
          this.length = data.total;
          this.getClientes();
        },
        (error: any) => {
          this.globalService.setSpin(false);
        }
      );
  }

  getClliente(cliente: ClientesQuery01Model) {
    this.globalService.setSpin(true);
    this.inscricaoGetAll = this.clientesServices
      .getCliente(cliente.id_empresa, cliente.id)
      .subscribe(
        (data: ClientesModel) => {
          this.globalService.setSpin(false);
        },
        (error: any) => {
          this.globalService.setSpin(false);
          this.lsClientes = [];
        }
      );
  }

  onEditar(cliente: ClientesQuery01Model) {
    alert(cliente.razao);
  }

  handlePageEvent(event: any) {
    console.log();
    this.pageIndex = event.pageIndex;
    this.pageSize = event.pageSize;
    this.getClientes();
  }
}
