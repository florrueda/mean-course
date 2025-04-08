import { Component, OnInit } from "@angular/core";
import { CommonModule } from '@angular/common';
import { NgForm } from "@angular/forms";
import { FormsModule } from '@angular/forms';

import { PostsService } from "../posts.service";

import { MatCard } from "@angular/material/card";
import { MatFormFieldModule} from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatProgressSpinnerModule} from '@angular/material/progress-spinner';
import { ActivatedRoute, ParamMap } from "@angular/router";
import { Post } from "../post.model";

@Component({
  selector: "app-post-create",
  templateUrl: "./post-create.component.html",
  styleUrls: ["./post-create.component.css"],
  standalone: true,
  imports: [MatCard, MatFormFieldModule,FormsModule, MatInputModule , CommonModule, MatButtonModule, MatProgressSpinnerModule]
})
export class PostCreateComponent implements OnInit {
  enteredTitle = "";
  enteredContent = "";
  post: Post = {
    id: '',
    title: '',
    content: ''
  };
  isLoading = false;
  private mode = "create";
  private postId: string = '';


  constructor(public postsService: PostsService, public route: ActivatedRoute) {}

  ngOnInit(): void {
    this.route.paramMap.subscribe((paramMap: ParamMap) => {
      if(paramMap.has('postId')) {
        this.mode = 'edit';
        this.postId = paramMap.get('postId') || '';
        this.isLoading= true;
        this.postsService.getPost(this.postId).subscribe((postData) => {
          this.isLoading = false;
          this.post = {
            id: postData._id,
            title: postData.title,
            content: postData.content
          };
        })
      } else {
        this.mode = 'create';
        this.postId = '';
      }
    })
  }

  onSavePost(form: NgForm) {
    if (form.invalid) {
      return;
    }
    this.isLoading = true;
    if (this.mode === 'edit') {
      this.postsService.updatePost(this.postId, form.value.title, form.value.content);
    } else {
      this.postsService.addPost(form.value.title, form.value.content);
    }
    form.resetForm();
  }
}
