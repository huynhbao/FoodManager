import { Component, OnInit } from '@angular/core';
import { NgbCarouselConfig } from '@ng-bootstrap/ng-bootstrap';
import { Post } from 'src/app/models/post.model';
import { User } from 'src/app/models/user.model';
import { Utils } from 'src/app/shared/tools/utils';

@Component({
  selector: 'app-manage-post',
  templateUrl: './manage-post.component.html',
  styleUrls: ['./manage-post.component.scss'],
  providers: [NgbCarouselConfig]
})
export class ManagePostComponent implements OnInit {
  images = [944, 1011, 984].map((n) => `https://picsum.photos/id/${n}/900/500`);
  listPost: Post[] = [];
  constructor(config: NgbCarouselConfig) {
    config.interval = 0;
    let user:User =  {
      username: "1",
      email: "a@gmail.com",
      fullname: "Nguyễn Văn A",
      address: "HCM",
      status: true,
      role: "user"
    };

    for (let i = 1; i <= 5; i++) {
      let post:Post =  {
        id: i,
        user: user,
        title: "This is a title",
        content: "With supporting text below as a natural lead-in to additional content.",
        img: this.images,
        postDate: new Date(),
        status: 1,
      };
      this.listPost.push(post);
    }
  }

  ngOnInit(): void {
    
  }

}
