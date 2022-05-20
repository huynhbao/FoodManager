import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Post } from 'src/app/models/post.model';
import { User } from 'src/app/models/user.model';
import { ManagerService } from 'src/app/services/manager.service';
import { NgbCarouselConfig } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-post-detail',
  templateUrl: './post-detail.component.html',
  styleUrls: ['./post-detail.component.scss']
})
export class PostDetailComponent implements OnInit {
  
  post!:Post;
  isLoading: boolean = true;

  constructor(private managerService: ManagerService, private route: ActivatedRoute, private router: Router, private config: NgbCarouselConfig) {
    config.interval = 0;
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

  splitDescription(value: string) {
    value = value.replace(/\s/g, '');
    let hashtag = value.split('#').slice(1);
    
    return hashtag;
  }

  ngOnInit(): void {
    let id = this.route.snapshot.params['id'];
    if (id) {
      this.loadPost(id);
    }/*  else {
      this.router.navigate(['manager/manage/post']);
    } */
  }

  private loadPost(id: string) {
    this.managerService.getPostById(id).subscribe({
      next: (post: Post) => {
        
        let user: User = {
          id: post["userId"],
          fullname: post["name"],
          avatarUrl: post["userImageUrl"]
        } 
        this.post = post;
        this.post.user = user;
        console.log(this.post);
      },
      error: (error) => {
        //this.router.navigate(['manager/manage/post']);
      },
      complete: () => {
        this.isLoading = false;
      }
    });
  }

}
