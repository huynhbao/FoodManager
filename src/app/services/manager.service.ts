import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})

//const baseUrl = `${environment.apiUrl}/users`;

export class ManagerService {

  constructor(private http: HttpClient) { }

  delete(id: string) {
    return this.http.delete(`https://fooma.free.beeceptor.com/delete/${id}`);
  }
}
