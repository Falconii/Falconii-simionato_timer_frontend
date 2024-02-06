import { GlobalService } from 'src/app/services/global.service';
import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-spins',
  templateUrl: './spins.component.html',
  styleUrls: ['./spins.component.css'],
})
export class SpinsComponent implements OnInit {
  showSpin: boolean = false;

  constructor(private globalService: GlobalService) {
    this.globalService.showSpinEmitter.subscribe((ativar) => {
      this.showSpin = ativar;
    });
  }
  ngOnInit() {
    this.showSpin = false;
  }
}
