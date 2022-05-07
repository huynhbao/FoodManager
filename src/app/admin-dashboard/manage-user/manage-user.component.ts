import { Component, OnInit } from '@angular/core';
import { User } from 'src/app/models/user.model';

@Component({
  selector: 'app-manage-user',
  templateUrl: './manage-user.component.html',
  styleUrls: ['./manage-user.component.scss']
})

export class ManageUserComponent implements OnInit {
  public listUser: User[] = [];
  constructor() {
    let user1:User =  {
      id: "a1",
      username: "1",
      email: "a@gmail.com",
      fullname: "Nguyễn Văn A",
      address: "HCM",
      status: true,
      role: "user"
    };
    let user2:User =  {
      id: "a2",
      username: "2",
      email: "b@gmail.com",
      fullname: "Nguyễn Văn B",
      address: "HN",
      status: true,
      role: "user"
    };
    this.listUser.push(user1);
    this.listUser.push(user2);
    console.log(this.listUser.length);
  }

  ngOnInit(): void {
  }

}
