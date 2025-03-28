import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { HeaderComponent } from './header/header.component';
import { PostCreateComponent } from './posts/post-create/post-create.component';
import { PostListComponent } from './posts/post-list/post-list.component';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, HeaderComponent, PostCreateComponent, PostListComponent, CommonModule],
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
  host: { 'ngSkipHydration': '' }
})
export class AppComponent {
  title = 'mean-course';
}
