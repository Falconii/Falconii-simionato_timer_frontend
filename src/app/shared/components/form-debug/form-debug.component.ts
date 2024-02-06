import { Component, Input, OnInit } from '@angular/core';
import { Form, FormGroup } from '@angular/forms';

@Component({
  selector: 'app-form-debug',
  templateUrl: './form-debug.component.html',
  styleUrls: ['./form-debug.component.css']
})
export class FormDebugComponent implements OnInit {

  @ Input() form?:FormGroup;

  constructor() { }

  ngOnInit(): void {
    console.log(this.form);
  }

}
