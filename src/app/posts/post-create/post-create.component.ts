import { Component, OnInit } from "@angular/core";
import { CommonModule } from '@angular/common';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from "@angular/forms";

import { PostsService } from "../posts.service";

import { MatCard } from "@angular/material/card";
import { MatFormFieldModule} from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatProgressSpinnerModule} from '@angular/material/progress-spinner';
import { ActivatedRoute, ParamMap } from "@angular/router";
import { Post } from "../post.model";
import { mimeType } from "./mime-type.validator";

@Component({
  selector: "app-post-create",
  templateUrl: "./post-create.component.html",
  styleUrls: ["./post-create.component.css"],
  standalone: true,
  imports: [MatCard, MatFormFieldModule, MatInputModule , CommonModule, MatButtonModule, MatProgressSpinnerModule, ReactiveFormsModule]
})
export class PostCreateComponent implements OnInit {
  enteredTitle = "";
  enteredContent = "";
  post: Post = {
    id: '',
    title: '',
    content: '',
    imagePath: ''
  };
  isLoading = false;
  private mode = "create";
  private postId: string = '';

  form: FormGroup =  new FormGroup({
    title: new FormControl(null, { validators: [Validators.required, Validators.minLength(3)]}),
    content: new FormControl(null, {validators: [Validators.required]}),
    image: new FormControl(null, {validators: [Validators.required], asyncValidators: [mimeType]})
  })
  imagePreview: string = '';

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
            content: postData.content,
            imagePath: postData.imagePath
          };
          this.form.setValue({
            title: this.post.title,
            content: this.post.content,
            image: this.post.imagePath
          })
        })
      } else {
        this.mode = 'create';
        this.postId = '';
      }
    })
  }

  onImagePicked(event: Event) {
    const file = (event.target as HTMLInputElement).files?.[0];
    this.form.patchValue({ image: file });
    this.form.get('image')?.updateValueAndValidity();
    const reader = new FileReader();
    if (file) {
      reader.readAsDataURL(file);
    }
    reader.onload = () => {
      this.imagePreview = reader.result as string;
    }

  }

  onSavePost() {
    if (this.form.invalid) {
      return;
    }
    this.isLoading = true;
    if (this.mode === 'edit') {
      this.postsService.updatePost(this.postId, this.form.value.title, this.form.value.content, this.form.value.image);
    } else {
      this.postsService.addPost(this.form.value.title, this.form.value.content, this.form.value.image);
    }
    this.form.reset()
  }



}
