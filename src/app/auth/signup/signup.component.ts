import { CommonModule, NgFor } from "@angular/common";
import { Component, OnDestroy, OnInit } from "@angular/core";
import { FormsModule, NgForm, ReactiveFormsModule } from "@angular/forms";
import { MatButtonModule } from "@angular/material/button";
import { MatCard } from "@angular/material/card";
import { MatFormFieldModule } from "@angular/material/form-field";
import { MatInputModule } from "@angular/material/input";
import { MatProgressSpinnerModule } from "@angular/material/progress-spinner";
import { AuthService } from "../auth.service";
import { error } from "node:console";
import { Subscription } from "rxjs";

@Component({
  selector: "app-signup",
  templateUrl: "./signup.component.html",
  styleUrls: ["./signup.component.css"],
  standalone: true,
  imports: [MatCard, MatFormFieldModule, MatInputModule , CommonModule, MatButtonModule, MatProgressSpinnerModule, ReactiveFormsModule, FormsModule]
})
export class SignUpComponent implements OnInit, OnDestroy {
  isLoading = false;
  private authStatusSub: Subscription = new Subscription();

  constructor(public authService: AuthService) {}

  ngOnInit(): void {
    this.authStatusSub = this.authService.getAuthStatusListener().subscribe((authStatus) => {
      this.isLoading = false;

    })
  }

  onSignUp(form: NgForm) {
    if(form.invalid) {
      return;
    }
    this.isLoading = true;
    this.authService.createUser(form.value.email, form.value.password)
  }

  ngOnDestroy(): void {
    this.authStatusSub.unsubscribe();
  }
}
