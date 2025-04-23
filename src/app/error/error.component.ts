import { Component, Inject } from "@angular/core";
import { MAT_DIALOG_DATA, MatDialogActions, MatDialogClose, MatDialogContent, MatDialogTitle } from "@angular/material/dialog";

@Component({
  templateUrl: './error.component.html',
  styleUrls: ['./error.component.css'],
  imports: [
    MatDialogTitle,
    MatDialogContent,
    MatDialogActions,
    MatDialogClose,
  ],
  standalone: true,

})
export class ErrorComponent{
  constructor(@Inject(MAT_DIALOG_DATA) public data: {message: string}) { }

}
