import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { CreatePost, Post } from '../models/post.model';
import { Recipe } from '../models/recipe.model';

@Injectable({
  providedIn: 'root'
})

//const baseUrl = `${environment.apiUrl}/users`;

export class ManagerService {
  baseUrl = environment.apiUrl
  constructor(private http: HttpClient) { }

  createPost(post: CreatePost): Observable<any> {
    return this.http.post<CreatePost>(
      `${this.baseUrl}/post/create`, post
    );
  }

  getPosts(status: number, hashtag: string, page: number): Observable<any> {
    return this.http.get<any>(
      `${this.baseUrl}/post/by-status/as-manager?status=${status}&hashtag=${hashtag}&page=${page}&size=5`
    );
  }

  getPostById(id: string): Observable<Post> {
    return this.http.get<Post>(
      `${this.baseUrl}/post/as-manager/${id}`
    );
  }

  getPostsByHashtag(hashtag: string, page: number): Observable<any> {
    return this.http.get<any>(
      `${this.baseUrl}/post/by-hashtag?hashtag=${hashtag}&page=${page}&size=5`
    );
  }

  getPendingPosts(page: number): Observable<Post> {
    return this.http.get<any>(
      `${this.baseUrl}/post/as-manager?page=${page}&size=2`
    );
  }

  setPostByStatus(id: string, status: number) {
    return this.http.put<any>(
      `${this.baseUrl}/post/update-status`, {id: id, status: status}
    );
  }

  getRecipes(page: number): Observable<any> {
    return this.http.get<any>(
      `${this.baseUrl}/recipe?page=${page}&size=5`
    );
  }

  getRecipeById(id: string): Observable<Recipe> {
    return this.http.get<Recipe>(
      `${this.baseUrl}/recipe/${id}`
    );
  }

  getHashtag() {
    return this.http.get<any>(
      `${this.baseUrl}/post/hashtag`
    );
  }
}
