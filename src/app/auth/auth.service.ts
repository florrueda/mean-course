import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Router } from '@angular/router';
import { AuthData } from "./auth-data.model";
import { Subject } from "rxjs";
import { environment } from '../../environments/environment';

const BACKEND_URL = environment.apiUrl + '/user';
@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private token: string | null = null;
  private isAuthenticated = false;
  private authStatusListener = new Subject<boolean>();
  private tokenTimer: any;
  private userId: string | null = null;

  constructor(private http: HttpClient, private router: Router) { }

  getToken() {
    console.log('TOKEN EN AUTHSERVICE:', this.token);
    return this.token;
  }

  getIsAuth() {
    return this.isAuthenticated;
  }

  getUserId() {
    return this.userId;
  }

  getAuthStatusListener() {
    return this.authStatusListener.asObservable()
  }

  createUser(email:string, password:string) {
    const authData: AuthData = {email: email, password: password};
    return this.http.post(BACKEND_URL + '/signup', authData)
    .subscribe(response => {
      this.router.navigate(['/'])

    }, error => {
      this.authStatusListener.next(false);

    })
  }

  loginUser(email: string,password: string) {
    const authData: AuthData = {email: email, password: password};
    this.http.post<{token: string, expiresIn: number, userId: string }>(BACKEND_URL + '/login', authData)
    .subscribe(response => {
      const token = response.token;
      this.token = token;
      if(token) {
        console.log('Token received:', token);

        const expiresInDuration = response.expiresIn;
        this.setAuthTimer(expiresInDuration)
        this.isAuthenticated = true;
        this.userId = response.userId;
        this.authStatusListener.next(true);
        const now = new Date();
        const expirationDate = new Date(now.getTime() + expiresInDuration * 1000)
        this.saveAuthData(token, expirationDate, this.userId )
        this.router.navigate(['/'])
      }
    }, error => {
      this.authStatusListener.next(false);
    })
  }

  autoAuthUser() {
    const authInfo = this.getAuthData();
    console.log('AUTOFETCH TOKEN:', authInfo);
    if (!authInfo) {
      return;
    }
    const now = new Date();
    const expiresIn = authInfo.expirationDate.getTime() - now.getTime();
    if(expiresIn > 0) {
      this.token = authInfo.token;
      this.isAuthenticated = true;
      this.userId  = authInfo.userId
      this.setAuthTimer(expiresIn / 1000)
      this.authStatusListener.next(true);
    }
  }

  logout(){
    this.token = null;
    this.isAuthenticated = false;
    this.authStatusListener.next(false)
    clearTimeout(this.tokenTimer);
    this.clearAuthData();
    this.userId = null;
    this.router.navigate(['/'])
  }

  private setAuthTimer(duration: number) {
    this.tokenTimer = setTimeout(()=> {
      this.logout()
    }, duration * 1000)
  }

  private saveAuthData(token: string, expirationDate: Date, userId: string) {
    localStorage.setItem('token', token);
    localStorage.setItem('expiration', expirationDate.toISOString())
    localStorage.setItem('userId', userId)
  }

  private clearAuthData() {
    localStorage.removeItem('token')
    localStorage.removeItem('expiration')
    localStorage.removeItem('userId')
  }

  private getAuthData() {
    if (typeof window === 'undefined') {
      return null;
    }
    const token = localStorage.getItem('token');
    console.log('Token received:', token);
    const expirationDate = localStorage.getItem('expiration');
    const userId = localStorage.getItem('userId');
    if(!token || !expirationDate) {
      return;
    }
    return {
      token: token,
      expirationDate: new Date(expirationDate),
      userId: userId
    }
  }
}
