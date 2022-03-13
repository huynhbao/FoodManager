import { Component, OnInit } from '@angular/core';


export interface User {
  id: number;
  email: string;
  fullname: string;
  address: string;
  status: boolean;

  /* constructor(id: number, email: string, fullname: string, address: string, status: boolean) {
    this.id = id;
    this.email = email;
    this.fullname = fullname;
    this.address = address;
    this.status = status;
  } */
}

@Component({
  selector: 'app-manage-user',
  templateUrl: './manage-user.component.html',
  styleUrls: ['./manage-user.component.scss']
})

export class ManageUserComponent implements OnInit {
  public listUser: User[] = [];
  constructor() {
    let user1:User =  {
      id: 1,
      email: "a@gmail.com",
      fullname: "Nguyễn Văn A",
      address: "HCM",
      status: true,
    };
    let user2:User =  {
      id: 2,
      email: "b@gmail.com",
      fullname: "Nguyễn Văn B",
      address: "HN",
      status: true,
    };
    this.listUser.push(user1);
    this.listUser.push(user2);
    console.log(this.listUser.length);
  }

  ngOnInit(): void {
  }

}
