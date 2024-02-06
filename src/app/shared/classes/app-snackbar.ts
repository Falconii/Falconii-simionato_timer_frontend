import { Injectable } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';

@Injectable({
  providedIn: 'root',
})
export class AppSnackbar {
  durationInSeconds: number = 2;

  constructor(private matSnackBar: MatSnackBar) {}

  openSuccessSnackBar(message: string, action: string) {
    this.matSnackBar.open(message, action, {
      duration: 3000,
      panelClass: ['green-snackbar'],
    });
  }

  openFailureSnackBar(message: string, action: string) {
    this.matSnackBar.open(message, action, {
      panelClass: ['red-snackbar'],
    });
  }
  openWarningnackBar(message: string, action: string) {
    this.matSnackBar.open(message, action, {
      duration: 3000,
      panelClass: ['yellow-snackbar'],
    });
  }
}
