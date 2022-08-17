import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { CreatePost, Post } from '../models/post.model';
import { CreateRecipe, Recipe } from '../models/recipe.model';

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

  updatePost(post: CreatePost): Observable<any> {
    return this.http.put<CreatePost>(
      `${this.baseUrl}/post/update`, post
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

  setPostByStatus(id: string, status: number, reason: string = "") {
    return this.http.put<any>(
      `${this.baseUrl}/post/update-status`, {id: id, status: status, reason: reason}
    );
  }

  createRecipe(recipe: CreateRecipe): Observable<any> {
    return this.http.post<CreateRecipe>(
      `${this.baseUrl}/recipe`, recipe
    );
  }

  updateRecipe(id: string, recipe: CreateRecipe): Observable<any> {
    return this.http.put<CreateRecipe>(
      `${this.baseUrl}/recipe/${id}`, recipe
    );
  }

  getRecipes(search: string = "", status: number, page: number, role: number = 0): Observable<any> {
    return this.http.get<any>(
      `${this.baseUrl}/recipe?search=${search}&status=${status}&page=${page}&size=5&role=${role}`
    );
  }

  getRecipesSort(search: string = "", status: number, page: number, role: number = 0, entityName: string, sortOption: string): Observable<any> {
    return this.http.get<any>(
      `${this.baseUrl}/recipe?search=${search}&status=${status}&page=${page}&size=5&role=${role}&entityName=${entityName}&sortOption=${sortOption}`
    );
  }

  getRecipesByFilter(search: string = "", status: number, hashtag: string, category: string, country: string, method: string, time: string, page: number, role: number = 0): Observable<any> {
    return this.http.get<any>(
      `${this.baseUrl}/recipe?search=${search}&hashtag=${hashtag}&category=${category}&country=${country}&method=${method}&time=${time}&status=${status}&page=${page}&size=5&role=${role}`
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

  setRecipeByStatus(id: string, status: number, reason: string = "") {
    console.log(id, status, reason);
    return this.http.put<any>(
      `${this.baseUrl}/recipe/status/${id}`, {status: status, reason: reason}
    );
  }
}
