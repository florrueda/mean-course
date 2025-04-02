import { Component, OnInit, OnDestroy, ChangeDetectorRef } from "@angular/core";
import { Subscription } from 'rxjs';
import {} from "@angular/material/menu"

import { Post } from "../post.model";
import { PostsService } from "../posts.service";
import {MatExpansionModule} from '@angular/material/expansion';
import { CommonModule } from '@angular/common';
import { MatButtonModule } from "@angular/material/button";

@Component({
  selector: "app-post-list",
  templateUrl: "./post-list.component.html",
  styleUrls: ["./post-list.component.css"],
  standalone: true,
  imports: [MatExpansionModule,MatButtonModule,  CommonModule]
})
export class PostListComponent implements OnInit, OnDestroy {
  posts: Post[] = [];
  private postsSub: Subscription = new Subscription();

  constructor(public postsService: PostsService, private cdRef: ChangeDetectorRef) {}

  ngOnInit() {
    this.postsService.getPosts();
  this.postsSub = this.postsService.getPostUpdateListener()
    .subscribe((posts: Post[]) => {
      console.log('📢 Received Updated Posts:', posts);
      this.posts = posts;
      this.cdRef.detectChanges(); // 🔥 Fuerza la actualización de la vista
    });
  }

  onDelete(postId:string) {
    this.postsService.deletePost(postId);
  }

  ngOnDestroy() {
    this.postsSub.unsubscribe();
  }
}
