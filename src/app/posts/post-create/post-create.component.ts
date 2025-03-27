import { Component } from "@angular/core";
import { CommonModule } from '@angular/common';
import { NgForm } from "@angular/forms";
import { FormsModule } from '@angular/forms';

import { PostsService } from "../posts.service";

import { MatCard } from "@angular/material/card";
import { MatFormFieldModule} from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';

@Component({
  selector: "app-post-create",
  templateUrl: "./post-create.component.html",
  styleUrls: ["./post-create.component.css"],
  standalone: true,
  imports: [MatCard, MatFormFieldModule,FormsModule, MatInputModule , CommonModule, MatButtonModule]
})
export class PostCreateComponent {
  enteredTitle = "";
  enteredContent = "";

  constructor(public postsService: PostsService) {}

  onAddPost(form: NgForm) {
    if (form.invalid) {
      return;
    }
    this.postsService.addPost(form.value.title, form.value.content);
    form.resetForm();
  }
}
