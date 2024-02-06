import { ShowClienteDialogData } from './show-cliente-dialog-data';
import { Component, Inject, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';

@Component({
  selector: 'app-show-cliente-dialog',
  templateUrl: './show-cliente-dialog.component.html',
  styleUrls: ['./show-cliente-dialog.component.css'],
})
export class ShowClienteDialogComponent implements OnInit {
  constructor(
    public dialogRef: MatDialogRef<ShowClienteDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: ShowClienteDialogData
  ) {}

  ngOnInit() {}
}
