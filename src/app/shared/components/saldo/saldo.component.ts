import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';

@Component({
  selector: 'app-saldo',
  templateUrl: './saldo.component.html',
  styleUrls: ['./saldo.component.css'],
})
export class SaldoComponent implements OnInit {
  parametro: FormGroup;
  dataLimite: string = '30/12/2023';

  constructor(private formBuilder: FormBuilder) {
    this.parametro = formBuilder.group({
      saldo: [{ value: '' }],
    });
  }

  ngOnInit(): void {
    this.setSaldo();
  }

  setSaldo() {
    this.parametro.setValue({
      saldo: 0,
    });
  }
}
