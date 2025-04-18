import { Injectable } from '@angular/core';
import { map, ReplaySubject, Subject } from 'rxjs';
import { HttpClient } from '@angular/common/http';

import { Post } from './post.model';
import { Router } from '@angular/router';

@Injectable({providedIn: 'root'})
export class PostsService {
  private posts: Post[] = [];
  private postsUpdated = new ReplaySubject<{posts: Post[], postCount: number}>();

  constructor(private httpClient: HttpClient, private router: Router) {}

  getPosts(postsPerPage: number, currentPage: number) {
    const queryParams = `?pagesize=${postsPerPage}&page=${currentPage}`;
    this.httpClient.get<{message: string, posts: any, maxPosts: number}>('http://localhost:3000/api/posts'+queryParams)
      .pipe(map(postData => {
        return {
        posts: postData.posts.map((post: { title: string, content: string, _id: string, imagePath: string }) => {
          return {
            title: post.title,
            content: post.content,
            id: post._id,
            imagePath: post.imagePath
          };
        }),
        maxPosts: postData.maxPosts};
      }))
      .subscribe((transformedPosts) => {
      this.posts = transformedPosts.posts;
      this.postsUpdated.next({posts: [...this.posts], postCount: transformedPosts.maxPosts});  // 🚀 Notificar actualización
      }
    );
  }

  getPostUpdateListener() {
    console.log('🔍 Subscribers count:', this.postsUpdated.observed);
    return this.postsUpdated.asObservable();
  }

  getPost(id: string) {
    return this.httpClient.get<{_id: string, title: string, content: string, imagePath: string }>('http://localhost:3000/api/posts/' + id);
  }

  addPost(title: string, content: string, image: File) {
    const postData = new FormData();
    postData.append('title', title);
    postData.append('content', content);
    postData.append('image', image, title);
    this.httpClient.post<{message: string, post: Post}>('http://localhost:3000/api/posts', postData)
      .subscribe((responseData) => {
        this.router.navigate(["/"])
      })
  }

  updatePost(id: string, title: string, content: string, image: File | string) {
    let postData;
    if(typeof image === 'object') {
      postData = new FormData();
      postData.append('id', id);
      postData.append('title', title);
      postData.append('content', content);
      postData.append('image', image, title);
    } else {
      postData = {
        id: id,
        title: title,
        content: content,
        imagePath: image
      }
    }
    this.httpClient
    .put('http://localhost:3000/api/posts/' + id, postData)
    .subscribe(response => {
      this.router.navigate(["/"])

    })
  }

  deletePost(postId: string) {
    return this.httpClient.delete('http://localhost:3000/api/posts/' + postId)
  }


}
