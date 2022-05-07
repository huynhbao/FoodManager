import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Post } from 'src/app/models/post.model';
import { User } from 'src/app/models/user.model';
import { Image } from 'src/app/models/image.model';
import { ManagerService } from 'src/app/services/manager.service';

@Component({
  selector: 'app-post-detail',
  templateUrl: './post-detail.component.html',
  styleUrls: ['./post-detail.component.scss']
})
export class PostDetailComponent implements OnInit {
  post!:Post;

  constructor(private managerService: ManagerService, private route: ActivatedRoute, private router: Router) {
    /* let user: User = {
      username: "1",
      email: "a@gmail.com",
      fullname: "Nguyễn Văn A",
      address: "HCM",
      status: true,
      role: "user"
    };

    let postImages: Image[] = [
      {
        id: "1",
        imageUrl: "https://picsum.photos/id/944/900/500",
        isThumbnail: false,
        status: 1,
      },
      {
        id: "2",
        imageUrl: "https://picsum.photos/id/1011/900/500",
        isThumbnail: false,
        status: 1,
      },
      {
        id: "3",
        imageUrl: "https://picsum.photos/id/984/900/500",
        isThumbnail: false,
        status: 1,
      }
    ]

    this.post = {
      id: "",
      user: user,
      title: "string",
      content: "string",
      publishedDate: new Date,
      status: 0,
      totalComment: 0,
      totalReact: 0,
      postImages: postImages
    } */
  }

  ngOnInit(): void {
    let id = this.route.snapshot.params['id'];
    if (id) {
      this.loadPost(id);
    } else {
      this.router.navigate(['manager/manage/post']);
    }
  }

  private loadPost(id: string) {
    this.managerService.getPostById(id).subscribe({
      next: (post: Post) => {
        let user: User = {
          id: post["userId"],
          fullname: post["name"],
        } 
        this.post = post;
        this.post.user = user;
      },
      error: (error) => {
        this.router.navigate(['manager/manage/post']);
      }
    });
  }

}
