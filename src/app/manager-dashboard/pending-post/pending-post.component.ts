import {
  Component,
  ElementRef,
  HostListener,
  OnInit,
  ViewChild,
} from '@angular/core';
import { NgbCarouselConfig } from '@ng-bootstrap/ng-bootstrap';
import { Image } from 'src/app/models/image.model';
import { Post } from 'src/app/models/post.model';
import { User } from 'src/app/models/user.model';
import { ManagerService } from 'src/app/services/manager.service';
import { PostStatus } from 'src/app/shared/constants/app-const';

@Component({
  selector: 'app-pending-post',
  templateUrl: './pending-post.component.html',
  styleUrls: ['./pending-post.component.scss'],
})
export class PendingPostComponent implements OnInit {
  images = [944, 1011, 984].map((n) => `https://picsum.photos/id/${n}/900/500`);
  listPost: Post[] = [];
  masterSelected: boolean;
  currentPage = 1;
  totalPost: number = 0;
  // https://stackblitz.com/edit/angular-11-crud-example-2jndjj?file=src%2Fapp%2Fusers%2Flist.component.ts
  constructor(
    config: NgbCarouselConfig,
    private managerService: ManagerService
  ) {
    config.interval = 0;
    /* let user: User = {
      id: "a1",
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

    for (let i = 1; i <= 5; i++) {
      let post: Post = {
        id: `${i}`,
        user: user,
        title: "This is a title no " + i,
        content: "With supporting text below as a natural lead-in to additional content.",
        postImages: postImages,
        publishedDate: new Date(),
        totalComment: 0,
        totalReact: 0,
        hashtag: "#aaa",
        status: 1,
        isSelected: false,
      };
      this.listPost.push(post);
    }
 */
    this.masterSelected = false;
  }

  // The master checkbox will check/ uncheck all items
  checkUncheckAll() {
    for (var i = 0; i < this.listPost.length; i++) {
      this.listPost[i].isSelected = this.masterSelected;
    }
  }

  // Check All Checkbox Checked
  isAllSelected() {
    this.masterSelected = this.listPost.every(function (item: any) {
      return item.isSelected == true;
    });
  }

  approvePost(id: string) {
    const post = this.listPost.find((x) => x.id === id);
    if (!post) return;
    this.listPost = this.listPost.filter((x) => x.id !== id);
    /* this.managerService.delete(id)
        .pipe(first())
        .subscribe(() => this.listPost = this.listPost.filter(x => x.id !== id)); */
  }

  declinePost(id: string) {}

  loadPosts() {
    let defaultPostImages: Image[] = [
      {
        id: '1',
        imageUrl: 'https://picsum.photos/id/944/900/500',
        isThumbnail: false,
        status: 1,
      },
    ];

    if (this.listPost.length === this.totalPost && this.totalPost != 0) {
      this.isLoading = false;
      return
    }

    this.managerService
      .getPostsByStatus(PostStatus.PENDING, this.currentPage)
      .subscribe({
        next: (res: any) => {
          let listPost: Post[] = res.items;
          listPost.forEach((post) => {
            if (post.postImages.length == 0) {
              post.postImages = defaultPostImages;
            }
            let user: User = {
              id: post['userId'],
              fullname: post['name'],
              avatarUrl: post['userImageUrl'],
            };
            post.user = user;
          });

          if (this.listPost.length === 0) {
            this.totalPost = res.totalItem;
            this.listPost = listPost;
          } else {
            this.listPost =  [...this.listPost, ...listPost];
          }
          this.isLoading = false;
        },
        error: (error) => {
          console.log(error);
        },
      });
  }

  @ViewChild('postsConent') postsConent!: ElementRef;
  isLoading = false;

  @HostListener('window:scroll', [])
  getScrollHeight(): void {
    if (window.innerHeight + window.scrollY >= this.postsConent.nativeElement.offsetHeight && !this.isLoading) {
      this.isLoading = true;
      this.currentPage++;
      this.loadPosts();
    }
  }

  ngOnInit(): void {
    this.loadPosts();
  }
}
