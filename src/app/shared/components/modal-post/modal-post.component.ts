import { Component, Input, OnInit } from '@angular/core';
import { NgbActiveModal, NgbModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { Post } from 'src/app/models/post.model';
import { User } from 'src/app/models/user.model';
import { ManagerService } from 'src/app/services/manager.service';
import { SharedService } from 'src/app/services/shared.service';
import { ModalConfirmComponent } from '../modal-confirm/modal-confirm.component';

@Component({
  selector: 'app-modal-post',
  templateUrl: './modal-post.component.html',
  styleUrls: ['./modal-post.component.scss']
})
export class ModalPostComponent implements OnInit {

  @Input() id!: string;
  @Input() reportId!: string;
  @Input() submitFunc!: Function;
  post!: Post;
  isLoading: boolean = true;
  modalRef!: NgbModalRef;
  
  constructor(private sharedService: SharedService, private managerService: ManagerService, public activeModal: NgbActiveModal, private modalService: NgbModal) { }

  splitDescription(value: string) {
    value = value.replace(/\s/g, '');
    let hashtag = value.split('#').slice(1);
    
    return hashtag;
  }

  setPostByStatus(id: string, status: number) {
    this.managerService.setPostByStatus(id, status).subscribe({
      next: (res:any) => {
        console.log(res);
        if (res.code == 200) {
          this.activeModal.close();
          this.submitFunc();
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

  setReportStatus(status: number = 2) {
    this.sharedService.acceptReportPost(this.reportId).subscribe({
      next: (res:any) => {
        console.log(res);
        if (res.code == 200) {
          if (status === 2) {
            this.setPostByStatus(this.id, 0);
          } else {
            this.activeModal.close();
            this.submitFunc();
          }
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

  showPopup() {
  }
  
  ngOnInit(): void {
    if (this.id) {
      this.managerService.getPostById(this.id).subscribe({
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

}
