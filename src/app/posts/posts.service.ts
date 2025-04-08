import { Injectable } from '@angular/core';
import { map, ReplaySubject, Subject } from 'rxjs';
import { HttpClient } from '@angular/common/http';

import { Post } from './post.model';
import { Router } from '@angular/router';

@Injectable({providedIn: 'root'})
export class PostsService {
  private posts: Post[] = [];
  private postsUpdated = new ReplaySubject<Post[]>();

  constructor(private httpClient: HttpClient, private router: Router) {}

  getPosts() {
    this.httpClient.get<{message: string, posts: any}>('http://localhost:3000/api/posts')
      .pipe(map(postData => {
        return postData.posts.map((post: { title: string, content: string, _id: string }) => {
          return {
            title: post.title,
            content: post.content,
            id: post._id
          };
        });
      }))
      .subscribe((transformedPosts) => {
        console.log('✅ Transformed Posts:', transformedPosts);  // 🔎 Datos después del mapeo
      this.posts = transformedPosts;
      console.log('🚀 Calling next() with:', [...this.posts]); // 🔍 Verifica si se llama a next()
      this.postsUpdated.next([...this.posts]);  // 🚀 Notificar actualización
      }
    );
  }

  getPostUpdateListener() {
    console.log('🔍 Subscribers count:', this.postsUpdated.observed);
    return this.postsUpdated.asObservable();
  }

  getPost(id: string) {
    return this.httpClient.get<{_id: string, title: string, content: string }>('http://localhost:3000/api/posts/' + id);
  }

  addPost(title: string, content: string) {
    const post: Post = {id: '', title: title, content: content};
    this.httpClient.post<{message: string, postId: string}>('http://localhost:3000/api/posts', post)
      .subscribe((responseData) => {
        const postId = responseData.postId;
        post.id = postId;
        this.posts.push(post);
        this.postsUpdated.next([...this.posts]);
        this.router.navigate(["/"])
      })
  }

  updatePost(id: string, title: string, content: string) {
    const post: Post = {id: id, title: title, content: content};
    this.httpClient.put('http://localhost:3000/api/posts/' + id, post)
    .subscribe(response => {
      const updatedPosts = [...this.posts];
      const oldPostIndex = updatedPosts.findIndex(p => p.id === post.id);
      updatedPosts[oldPostIndex] = post;
      this.posts = updatedPosts;
      this.postsUpdated.next([...this.posts])
      this.router.navigate(["/"])

    })
  }

  deletePost(postId: string) {
    this.httpClient.delete('http://localhost:3000/api/posts/' + postId)
      .subscribe(() => {
        const updatedPosts = this.posts.filter(post => post.id !== postId);
        this.posts = updatedPosts;
        this.postsUpdated.next([...this.posts]);

      })
  }


}
