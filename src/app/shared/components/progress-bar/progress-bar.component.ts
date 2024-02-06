/*
Usado como teoria para montar dialogmodal
https://medium.com/swlh/how-to-create-a-modal-dialog-component-in-angular-8-88028d909be0
*/

import { Component, OnInit, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { ProgressBarClass } from './ProgressBar-class';

@Component({
  selector: 'app-progress-bar',
  templateUrl: './progress-bar.component.html',
  styleUrls: ['./progress-bar.component.css'],
})
export class ProgressBarComponent implements OnInit {
  constructor(
    public dialogRef: MatDialogRef<ProgressBarComponent>,
    @Inject(MAT_DIALOG_DATA) public data: ProgressBarClass
  ) {}

  ngOnInit() {}

  // When the user clicks the action button a.k.a. the logout button in the\
  // modal, show an alert and followed by the closing of the modal
  actionFunction() {
    alert('You have logged out.');
    this.data.mensagem = this.dialogRef.id;
    this.closeModal();
  }

  // If the user clicks the cancel button a.k.a. the go back button, then\
  // just close the modal
  closeModal() {
    this.dialogRef.close();
  }
}
