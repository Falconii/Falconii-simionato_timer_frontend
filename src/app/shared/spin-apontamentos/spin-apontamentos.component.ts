import { Component, OnInit } from '@angular/core';
import { GlobalService } from 'src/app/services/global.service';

@Component({
  selector: 'app-spin-apontamentos',
  templateUrl: './spin-apontamentos.component.html',
  styleUrls: ['./spin-apontamentos.component.css'],
})
export class SpinApontamentosComponent implements OnInit {
  showSpin: boolean = false;

  constructor(private globalService: GlobalService) {
    this.globalService.showSpinApontamentosEmitter.subscribe((ativar) => {
      this.showSpin = ativar;
    });
  }

  ngOnInit() {}
}
