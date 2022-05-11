import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { Post } from '../models/post.model';

@Injectable({
  providedIn: 'root'
})

//const baseUrl = `${environment.apiUrl}/users`;

export class ManagerService {
  baseUrl = environment.apiUrl
  constructor(private http: HttpClient) { }

  getPosts(page: number): Observable<any> {
    return this.http.get<any>(
      `${this.baseUrl}/post?page=${page}&size=5`
    );
  }

  getPostById(id: string): Observable<Post> {
    return this.http.get<Post>(
      `${this.baseUrl}/post/${id}`
    );
  }

  delete(id: string) {
    return this.http.delete(`https://fooma.free.beeceptor.com/delete/${id}`);
  }
}
