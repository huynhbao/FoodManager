import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Post } from '../models/post.model';

@Injectable({
  providedIn: 'root'
})

//const baseUrl = `${environment.apiUrl}/users`;

export class ManagerService {

  constructor(private http: HttpClient) { }

  getPosts(page: number): Observable<any> {
    return this.http.get<any>(
      `https://foomaapp.ddns.net/api/post?page=${page}&size=5`
    );
  }

  getPostById(id: string): Observable<Post> {
    return this.http.get<Post>(
      `https://foomaapp.ddns.net/api/post/${id}`
    );
  }

  delete(id: string) {
    return this.http.delete(`https://fooma.free.beeceptor.com/delete/${id}`);
  }
}
