import { Component, Input, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { NgbActiveModal, NgbModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { ToastrService } from 'ngx-toastr';
import { Post } from 'src/app/models/post.model';
import { User } from 'src/app/models/user.model';
import { AuthenticationService } from 'src/app/services/authentication.service';
import { ManagerService } from 'src/app/services/manager.service';
import { SharedService } from 'src/app/services/shared.service';
import { ModalConfirmComponent } from '../modal-confirm/modal-confirm.component';
import { ModalInputComponent } from '../modal-input/modal-input.component';

@Component({
  selector: 'app-modal-post',
  templateUrl: './modal-post.component.html',
  styleUrls: ['./modal-post.component.scss']
})
export class ModalPostComponent implements OnInit {

  @Input() id!: string;
  @Input() reportId!: string;
  @Input() showAction!: boolean;
  @Input() submitFunc!: Function;
  post!: Post;
  isLoading: boolean = true;
  modalRef!: NgbModalRef;
  confirmModalRef!: NgbModalRef;
  
  constructor(private sharedService: SharedService, private managerService: ManagerService, public activeModal: NgbActiveModal, private modalService: NgbModal, private toastr: ToastrService, private authenticationService: AuthenticationService, private route: ActivatedRoute, private router: Router) { }

  splitDescription(value: string) {
    value = value.replace(/\s/g, '');
    let hashtag = value.split('#').slice(1);
    
    return hashtag;
  }

  getUser() {
    return this.authenticationService.currentUserValue;
  }

  acceptReport() {
    this.isLoading = true;
    this.sharedService.acceptReportPost(this.reportId).subscribe({
      next: (res:any) => {
        console.log(res);
        if (res.code == 200) {
          this.toastr.success(`Đã bỏ qua báo cáo`);
        }
      },
      error: (error) => {
        console.log(error);
        this.toastr.error(`Không thể thực hiện hành động này`, `Đã xảy ra lỗi`);
      },
      complete: () => {
        this.isLoading = false;
      }
    });
  }

  showPopupDenied() {
    this.modalRef = this.modalService.open(ModalInputComponent, {ariaLabelledBy: 'modal-basic-title', size: 'md'});
    this.modalRef.componentInstance.id = this.post.id;
    this.modalRef.componentInstance.submitFunc = this.showPopupDeniedCb.bind(this);
  }

  showPopupDeniedCb(id: string, reason: string) {
    this.setPostByStatus(3, reason);
    this.modalRef.close();
  }

  setPostByStatus(status: number, reason?: string) {
    this.isLoading = true;
    this.managerService.setPostByStatus(this.post.id, status, reason).subscribe({
      next: (res:any) => {
        console.log(res);
        if (res.code == 200) {
          if (this.confirmModalRef) {
            this.confirmModalRef.close();
          }
          this.activeModal.close();
          if (status === 0) {
            this.toastr.success(`Đã gỡ bài viết`);
          } else if (status === 1) {
            this.toastr.success(`Đã duyệt bài viết`);
          } else if (status === 3) {
            this.toastr.success(`Lý do: ${reason}` ,`Đã từ chối bài viết`);
          }
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

  setReportPostStatus(status: number) {
    this.isLoading = true;
    this.sharedService.acceptReportPost(this.reportId).subscribe({
      next: (res:any) => {
        console.log(res);
        if (res.code == 200) {
          this.managerService.setPostByStatus(this.post.id, status).subscribe({
            next: (res:any) => {
              console.log(res);
              if (res.code == 200) {
                this.confirmModalRef.close();
                this.activeModal.close();
                this.toastr.success(`Đã gỡ bài viết`);
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
      },
      error: (error) => {
        console.log(error);
      },
      complete: () => {
        this.isLoading = false;
      }
    });
  }

  confirmDelete() {
    if (this.showAction) {
      this.setPostByStatus(0);
    } else {
      this.setReportPostStatus(2);
    }
  }

  showPopup(content) {
    this.confirmModalRef = this.modalService.open(content, {ariaLabelledBy: 'modal-basic-title'})
  }

  editPost(id: string) {
    this.activeModal.close();
    this.router.navigate(["../../manager/manage/post/edit", id], { relativeTo: this.route });
  }
  
  ngOnInit(): void {
    if (this.id) {
      this.isLoading = true;
      this.managerService.getPostById(this.id).subscribe({
        next: (post: Post) => {
          let user: User = {
            id: post["userId"],
            fullname: post["name"],
            avatarUrl: post["userImageUrl"],
            role: post["role"],
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
