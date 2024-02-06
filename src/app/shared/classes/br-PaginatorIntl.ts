import { Injectable } from '@angular/core';
import { MatPaginatorIntl } from '@angular/material/paginator';
import { Subject } from 'rxjs';

@Injectable()
export class BrPaginatorIntl implements MatPaginatorIntl {
  changes = new Subject<void>();

  // For internationalization, the `$localize` function from
  // the `@angular/localize` package can be used.
  firstPageLabel = 'Pag. Inicial';
  itemsPerPageLabel = 'Itens Por Página';
  lastPageLabel = 'Pag. Final';

  // You can set labels to an arbitrary string too, or dynamically compute
  // it through other third-party internationalization libraries.
  nextPageLabel = 'Próxima Página';
  previousPageLabel = 'Última Página';

  getRangeLabel(page: number, pageSize: number, length: number): string {
    if (length === 0) {
      return `Página 1 of 1`;
    }
    const amountPages = Math.ceil(length / pageSize);
    return `Página ${page + 1} of ${amountPages}`;
  }
}
