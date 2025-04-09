import { Component, OnInit, OnDestroy, ChangeDetectorRef } from "@angular/core";
import { Subscription } from 'rxjs';
import {} from "@angular/material/menu"

import { Post } from "../post.model";
import { PostsService } from "../posts.service";
import {MatExpansionModule} from '@angular/material/expansion';
import { CommonModule } from '@angular/common';
import { MatButtonModule } from "@angular/material/button";
import { RouterLink } from "@angular/router";
import { MatProgressSpinnerModule } from "@angular/material/progress-spinner";
import {MatPaginatorModule, PageEvent} from '@angular/material/paginator';

@Component({
  selector: "app-post-list",
  templateUrl: "./post-list.component.html",
  styleUrls: ["./post-list.component.css"],
  standalone: true,
  imports: [MatExpansionModule,MatButtonModule,  CommonModule, RouterLink, MatProgressSpinnerModule, MatPaginatorModule]
})
export class PostListComponent implements OnInit, OnDestroy {
  posts: Post[] = [];
  isLoading = false;
  totalPosts = 0;
  postsPerPage = 2;
  pageSizeOptions = [1, 2, 5, 10];
  currentPage = 1;
  private postsSub: Subscription = new Subscription();

  constructor(public postsService: PostsService, private cdRef: ChangeDetectorRef) {}

  ngOnInit() {
    this.postsService.getPosts(this.postsPerPage, this.currentPage);
    this.isLoading = true;
    this.postsSub = this.postsService
    .getPostUpdateListener()
    .subscribe((postData:{posts: Post[], postCount: number}) => {
      this.isLoading = false;
      this.posts = postData.posts;
      this.totalPosts = postData.postCount;
      // this.cdRef.detectChanges(); // 🔥 Fuerza la actualización de la vista
    });
  }

  onChangedPage(pageData: PageEvent) {
    this.isLoading = true;
    this.currentPage = pageData.pageIndex + 1;
    this.postsPerPage = pageData.pageSize;
    this.postsService.getPosts(this.postsPerPage, this.currentPage);
  }

  onDelete(postId:string) {
    this.isLoading = true;
    this.postsService.deletePost(postId).subscribe(() =>{
      this.postsService.getPosts(this.postsPerPage, this.currentPage);
    })
  }

  ngOnDestroy() {
    this.postsSub.unsubscribe();
  }
}
