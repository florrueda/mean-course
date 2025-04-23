import { Injectable } from '@angular/core';
import { map, ReplaySubject, Subject } from 'rxjs';
import { HttpClient, HttpHeaders } from '@angular/common/http';

import { Post } from './post.model';
import { Router } from '@angular/router';

import { environment } from '../../environments/environment';

const BACKEND_URL = environment.apiUrl + '/posts/';

@Injectable({providedIn: 'root'})
export class PostsService {
  private posts: Post[] = [];
  private postsUpdated = new ReplaySubject<{posts: Post[], postCount: number}>();

  constructor(private httpClient: HttpClient, private router: Router) {}

  getPosts(postsPerPage: number, currentPage: number) {
    const queryParams = `?pagesize=${postsPerPage}&page=${currentPage}`;
    this.httpClient.get<{message: string, posts: any, maxPosts: number}>(BACKEND_URL + queryParams)
      .pipe(map(postData => {
        return {
        posts: postData.posts.map((post: any) => {
          return {
            title: post.title,
            content: post.content,
            id: post._id,
            imagePath: post.imagePath,
            creator: post.creator
          };
        }),
        maxPosts: postData.maxPosts};
      }))
      .subscribe((transformedPosts) => {
        console.log('📦 Posts received:', transformedPosts);

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
    return this.httpClient.get<{_id: string, title: string, content: string, imagePath: string, creator: string }>(BACKEND_URL + id);
  }

  addPost(title: string, content: string, image: File) {
    const authToken = localStorage.getItem('token');  // Obtener el token desde localStorage
  const headers = new HttpHeaders({
    'Authorization': `Bearer ${authToken}`  // Agregar el token en las cabeceras
  });

    const postData = new FormData();
    postData.append('title', title);
    postData.append('content', content);
    postData.append('image', image, title);
    this.httpClient.post<{message: string, post: Post}>(BACKEND_URL, postData, { headers })
      .subscribe((responseData) => {
        console.log(responseData);

        this.router.navigate(["/"])
      })
  }

  updatePost(id: string, title: string, content: string, image: File | string) {
    const authToken = localStorage.getItem('token');  // Obtener el token desde localStorage
  const headers = new HttpHeaders({
    'Authorization': `Bearer ${authToken}`  // Agregar el token en las cabeceras
  });

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
        imagePath: image,
        creator: null
      }
    }
    this.httpClient
    .put(BACKEND_URL + id, postData, { headers })
    .subscribe(response => {
      this.router.navigate(["/"])

    })
  }

  deletePost(postId: string) {
    const authToken = localStorage.getItem('token');  // Obtener el token desde localStorage
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${authToken}`  // Agregar el token en las cabeceras
    });
    return this.httpClient.delete(BACKEND_URL + postId,  { headers })
  }


}
