import { Component, OnInit } from '@angular/core';
import { NgbCarouselConfig } from '@ng-bootstrap/ng-bootstrap';
import { Post } from 'src/app/models/post.model';
import { User } from 'src/app/models/user.model';
import { ManagerService } from 'src/app/services/manager.service';
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
  masterSelected: boolean;
  //https://ks89.github.io/angular-modal-gallery-2018-v7.github.io/
  //https://www.npmjs.com/package/ngx-toastr
  constructor(config: NgbCarouselConfig, private managerService: ManagerService) {
    config.interval = 0;
    let user: User = {
      username: "1",
      email: "a@gmail.com",
      fullname: "Nguyễn Văn A",
      address: "HCM",
      status: true,
      role: "user"
    };

    for (let i = 1; i <= 5; i++) {
      let post: Post = {
        id: `${i}`,
        user: user,
        title: "This is a title no " + i,
        content: "With supporting text below as a natural lead-in to additional content.",
        img: this.images,
        postDate: new Date(),
        status: 1,
        isSelected: false,
      };
      this.listPost.push(post);
    }

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
    })
  }

  approvePost(id: string) {
    const post = this.listPost.find(x => x.id === id);
    if (!post) return;
    this.listPost = this.listPost.filter(x => x.id !== id);
    /* this.managerService.delete(id)
        .pipe(first())
        .subscribe(() => this.listPost = this.listPost.filter(x => x.id !== id)); */
  }

  declinePost(id: string) {

  }

  ngOnInit(): void {

  }

}
