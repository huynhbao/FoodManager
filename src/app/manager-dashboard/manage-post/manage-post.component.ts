import { Component, OnInit } from '@angular/core';
import { NgbCarouselConfig } from '@ng-bootstrap/ng-bootstrap';
import { Image } from 'src/app/models/image.model';
import { Paging } from 'src/app/models/paging.model';
import { Post } from 'src/app/models/post.model';
import { User } from 'src/app/models/user.model';
import { ManagerService } from 'src/app/services/manager.service';

@Component({
  selector: 'app-manage-post',
  templateUrl: './manage-post.component.html',
  styleUrls: ['./manage-post.component.scss'],
  providers: [NgbCarouselConfig]
})
export class ManagePostComponent implements OnInit {
  images = [944, 1011, 984].map((n) => `https://picsum.photos/id/${n}/900/500`);
  listPost: Post[] = [];
  paging?: Paging;
  currentPage: number = 1;
  itemsPerPage = 5;
  pageSize: number = 10;
  collectionSize: number = 0;
  masterSelected: boolean = false;
  numSelected: number = 0;
  isLoading: boolean = false;
  //masterSelected: boolean;
  //https://ks89.github.io/angular-modal-gallery-2018-v7.github.io/
  //https://www.npmjs.com/package/ngx-toastr
  constructor(private managerService: ManagerService) {
  }

  private loadPosts() {
    let defaultPostImages: Image[] = [
      {
        id: "1",
        imageUrl: "https://picsum.photos/id/944/900/500",
        isThumbnail: false,
        status: 1,
      }
    ]
    
    this.managerService.getPosts(this.currentPage).subscribe({
      next: (res:any) => {
        this.collectionSize = res.totalItem;
        let listPost: Post[] = res.items;
        this.listPost = listPost;
        this.listPost.forEach(post => {
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
        
      },
      error: (error) => {
        console.log(error);
      }
    });
  }

  public onPageChange(pageNum: number): void {
    //this.pageSize = this.itemsPerPage * (pageNum - 1);
    this.loadPosts();
  }

  public changePagesize(num: number): void {
    this.itemsPerPage = this.pageSize + num;
  }

  // The master checkbox will check/ uncheck all items
  public checkUncheckAll() {
    for (var i = 0; i < this.listPost.length; i++) {
      this.listPost[i].isSelected = this.masterSelected;
    }
    this.numSelected = this.masterSelected ? this.listPost.length : 0;
  }

  // Check All Checkbox Checked
  public isAllSelected() {
    let count = 0;
    this.masterSelected = this.listPost.every(function (item: any) {
      if (item.isSelected == true) {
        count++;
      }
      return item.isSelected == true;
    })
    this.numSelected = count;
  }

  hashTagColor = [];
  myColor = ['#e7f8f0', '#e128f0', '#e7f321', '#edecff', '#ffecfe'];    
  splitDescription(value: string) {
    value = value.replace(/\s/g, '');
    let hashtag = value.split('#').slice(1);
    
    hashtag.forEach(element => {
      if (!this.hashTagColor[element]) {
        const random = Math.floor(Math.random() * this.myColor.length);
        this.hashTagColor[element] = this.myColor[random];
      }
    });
    
    return value.split('#').slice(1);
  }

  setPostByStatus(id: string, status: number) {
    this.isLoading = true;
    const post = this.listPost.find((x) => x.id === id);
    
    if (!post) return;
    
    this.managerService.setPostByStatus(id, status).subscribe({
      next: (res:any) => {
        console.log(res);
        if (res.code == 200) {
          this.listPost = this.listPost.filter((x) => x.id !== id);
        }
      },
      error: (error) => {
        console.log(error);
      },
      complete: () => {
        this.isLoading = false;
      }
    });
  }

  ngOnInit(): void {
    this.loadPosts();
    console.log(this.hashTagColor);
  }

}
