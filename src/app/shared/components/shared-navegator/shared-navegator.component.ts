import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { ControlePaginas } from '../../classes/controle-paginas';

@Component({
  selector: 'app-navegator',
  templateUrl: './shared-navegator.component.html',
  styleUrls: ['./shared-navegator.component.css'],
})
export class SharedNavegatorComponent implements OnInit {
  @Input('controle') controlePaginas!: ControlePaginas;

  @Output('changePage') change = new EventEmitter();

  constructor() {}

  ngOnInit(): void {}

  getAtual(): string {
    return `${this.controlePaginas.getPaginalAtual()}/${this.controlePaginas.getTotalPaginas()}`;
  }

  firstPage() {
    this.controlePaginas.goFirst();
    this.change.emit('');
  }

  lastPage() {
    this.controlePaginas.goLast();
    this.change.emit('');
  }

  forwardPage() {
    this.controlePaginas.forwardPage();
    this.change.emit('');
  }

  nextPage() {
    this.controlePaginas.nextPage();
    this.change.emit('');
  }
}
