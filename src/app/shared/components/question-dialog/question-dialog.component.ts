import { QuestionDialogData } from './Question-Dialog-Data';
import { Component, OnInit, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';

@Component({
  selector: 'app-question-dialog',
  templateUrl: './question-dialog.component.html',
  styleUrls: ['./question-dialog.component.css'],
})
export class QuestionDialogComponent implements OnInit {
  constructor(
    public dialogRef: MatDialogRef<QuestionDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: QuestionDialogData
  ) {}

  ngOnInit(): void {
    this.data.resposta = 'N';
  }

  actionFunction() {
    this.data.resposta = 'S';
    this.closeModal();
  }

  closeModal() {
    this.dialogRef.close();
  }
}
