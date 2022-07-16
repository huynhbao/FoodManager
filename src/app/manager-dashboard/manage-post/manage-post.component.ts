import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { NgbCarouselConfig, NgbModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { Image } from 'src/app/models/image.model';
import { Paging } from 'src/app/models/paging.model';
import { Post } from 'src/app/models/post.model';
import { User } from 'src/app/models/user.model';
import { ManagerService } from 'src/app/services/manager.service';
import { SharedService } from 'src/app/services/shared.service';
import { ModalInputComponent } from 'src/app/shared/components/modal-input/modal-input.component';

@Component({
  selector: 'app-manage-post',
  templateUrl: './manage-post.component.html',
  styleUrls: ['./manage-post.component.scss'],
  providers: [NgbCarouselConfig]
})
export class ManagePostComponent implements OnInit {
  images = [944, 1011, 984].map((n) => `https://picsum.photos/id/${n}/900/500`);
  listPost: Post[] = [];
  listHashtag: string[] = ["Tất cả"];
  paging?: Paging;
  currentPage: number = 1;
  itemsPerPage = 5;
  pageSize: number = 10;
  collectionSize: number = 0;
  masterSelected: boolean = false;
  numSelected: number = 0;
  hastagSelected: number = 0;
  isLoading: boolean = false;
  isLoadingHashtag: boolean = false;
  statusSelected: number = 1;
  modalRef!: NgbModalRef;
  //masterSelected: boolean;
  //https://ks89.github.io/angular-modal-gallery-2018-v7.github.io/
  //https://www.npmjs.com/package/ngx-toastr
  constructor(private managerService: ManagerService, private route: ActivatedRoute, private sharedService: SharedService, private modalService: NgbModal) {
  }

  private loadPosts() {
    this.isLoading = true;
    let defaultPostImages: Image[] = [
      {
        id: "1",
        imageUrl: "https://picsum.photos/id/944/900/500",
        isThumbnail: false,
        status: 1,
      }
    ]
    let hashtag = this.listHashtag[this.hastagSelected];
    if (hashtag == "Tất cả") {
      hashtag = "";
    }

    hashtag = hashtag.replace("#", "");

    
    this.managerService.getPosts(this.statusSelected, hashtag, this.currentPage).subscribe({
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
      },
      complete: () => {
        this.isLoading = false;
      }
    });
  }

  public onPageChange(pageNum: number): void {
    if (this.hastagSelected !== 0) {
      this.filterHashtag(this.hastagSelected, true);
    } else {
      this.loadPosts();
    }
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
    
    return hashtag;
  }

  showPopup(id: string) {
    this.modalRef = this.modalService.open(ModalInputComponent, {ariaLabelledBy: 'modal-basic-title', size: 'lg', windowClass: 'appcustom-modal'});
    this.modalRef.componentInstance.id = id;
    this.modalRef.componentInstance.submitFunc = this.submitFunc.bind(this);
  }

  setPostByStatus(id: string, status: number, reason?: string) {

    this.isLoading = true;
    const post = this.listPost.find((x) => x.id === id);
    
    if (!post) return;
    
    this.managerService.setPostByStatus(id, status, reason).subscribe({
      next: (res:any) => {
        console.log(res);
        if (res.code == 200) {
          this.listPost = this.listPost.filter((x) => x.id !== id);
          this.loadPosts();
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

  submitFunc(id: string, reason: string) {
    this.setPostByStatus(id, 3, reason);
    this.modalRef.close();
  }

  loadHashtag(hashtagParam?: string) {
    if (this.listHashtag.length !== 1) {
      return
    }
    this.isLoadingHashtag = true;
    this.managerService.getHashtag().subscribe({
      next: (res) => {
        this.listHashtag = ["Tất cả"];
        this.listHashtag =  [...this.listHashtag, ...res.items];
      },
      error: (error) => {
        console.log(error);
      },
      complete: () => {
        for (let i = 0; i < this.listHashtag.length; i++) {
          const hashtag = this.listHashtag[i];
          if (hashtag == hashtagParam) {
            this.hastagSelected = i;
            this.filterHashtag(i, false);
            break
          }
        }
        this.isLoadingHashtag = false;
      }
    });
  }

  filterByStatus(status: number) {
    this.statusSelected = status;
    this.hastagSelected = 0;
    this.loadPosts();
  }

  filterHashtag(index: number, pageChange: boolean) {
    this.isLoading = true;
    this.hastagSelected = index;
    let hastagValue: string = this.listHashtag[index].replace("#", "");
    if (index == 0) {
      hastagValue = "";
    }
    
    if (!pageChange) {
      this.currentPage = 0;
    }

    this.loadPosts();
    
    /* this.managerService.getPostsByHashtag(hastagValue, this.currentPage).subscribe({
      next: (res:any) => {
        this.listPost = [];
        this.collectionSize = res.totalItem;
        let listPost: Post[] = res.items;
        this.listPost = listPost;
        this.listPost.forEach(post => {
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
      },
      complete: () => {
        this.isLoading = false;
      }
    }); */
  }

  ngOnInit(): void {
    let hashtagParam = this.route.snapshot.params['hashtag'];
    if (hashtagParam) {
      this.loadHashtag("#" + hashtagParam);
    } else {
      this.loadPosts();
    }
    
  }

}
