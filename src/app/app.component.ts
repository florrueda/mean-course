import { Component, OnInit } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { HeaderComponent } from './header/header.component';
import { PostCreateComponent } from './posts/post-create/post-create.component';
import { PostListComponent } from './posts/post-list/post-list.component';
import { CommonModule } from '@angular/common';
import { LoginComponent } from './auth/login/login.component';
import { SignUpComponent } from './auth/signup/signup.component';
import { AuthService } from './auth/auth.service';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, HeaderComponent, PostCreateComponent, PostListComponent, CommonModule, LoginComponent, SignUpComponent],
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
  host: { 'ngSkipHydration': '' }
})
export class AppComponent implements OnInit {

  constructor(private authService: AuthService) { }


  ngOnInit(): void {
    this.authService.autoAuthUser();
  }
}
