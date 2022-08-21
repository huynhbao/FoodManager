import { Component, Input, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { NgbActiveModal, NgbCarouselConfig, NgbModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { ToastrService } from 'ngx-toastr';
import { Recipe } from 'src/app/models/recipe.model';
import { User } from 'src/app/models/user.model';
import { ManagerService } from 'src/app/services/manager.service';
import { SharedService } from 'src/app/services/shared.service';
import { ModalInputComponent } from '../modal-input/modal-input.component';

@Component({
  selector: 'app-modal-recipe',
  templateUrl: './modal-recipe.component.html',
  styleUrls: ['./modal-recipe.component.scss']
})
export class ModalRecipeComponent implements OnInit {

  @Input() id!: string;
  @Input() reportId!: string;
  @Input() showAction!: boolean;
  @Input() urlParam!: boolean;
  @Input() showActionSystem!: boolean;
  @Input() submitFunc!: Function;
  modalRef!: NgbModalRef;
  confirmModalRef!: NgbModalRef;
  recipe!: Recipe;
  isLoading: boolean = true;
  
  constructor(private sharedService: SharedService, private managerService: ManagerService, private config: NgbCarouselConfig, public activeModal: NgbActiveModal, private modalService: NgbModal, private toastr: ToastrService, private route: ActivatedRoute, private router: Router) {
    config.interval = 0;
  }

  splitDescription(value: string) {
    value = value.replace(/\s/g, '');
    let hashtag = value.split('#').slice(1);
    
    return hashtag;
  }

  acceptReport() {
    this.isLoading = true;
    this.sharedService.acceptReportRecipe(this.reportId).subscribe({
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
    this.modalRef = this.modalService.open(ModalInputComponent, {ariaLabelledBy: 'modal-basic-title', size: 'lg', windowClass: 'appcustom-modal'});
    this.modalRef.componentInstance.id = this.recipe.id;
    this.modalRef.componentInstance.submitFunc = this.showPopupDeniedCb.bind(this);
  }

  showPopupDeniedCb(id: string, reason: string) {
    this.setRecipeByStatus(3, reason);
    this.modalRef.close();
  }

  setRecipeByStatus(status: number, reason?: string) {
    this.isLoading = true;
    this.managerService.setRecipeByStatus(this.recipe.id, status, reason).subscribe({
      next: (res:any) => {
        console.log(res);
        if (this.confirmModalRef) {
          this.confirmModalRef.close();
        }
        this.activeModal.close();
        if (status === 0) {
          this.toastr.success(`Đã xóa bài viết`);
        } else if (status === 1) {
          this.toastr.success(`Đã duyệt bài viết`);
        } else if (status === 3) {
          this.toastr.success(`Lý do: ${reason}` ,`Đã từ chối bài viết`);
        }
        
        this.submitFunc();
      },
      error: (error) => {
        this.toastr.error(`Không thể thực hiện hành động này`, `Đã xảy ra lỗi`);
        console.log(error);
      },
      complete: () => {
        this.isLoading = false;
      }
    });
  }

  setReportRecipeStatus(status: number) {
    this.isLoading = true;
    this.sharedService.acceptReportRecipe(this.reportId).subscribe({
      next: (res:any) => {
        console.log(res);
        if (res.code == 200) {
          this.managerService.setRecipeByStatus(this.recipe.id, status).subscribe({
            next: (res:any) => {
              console.log(res);
              this.confirmModalRef.close();
              this.activeModal.close();
              this.toastr.success(`Đã xóa bài viết`);
              this.submitFunc();
            },
            error: (error) => {
              this.toastr.error(`Không thể xóa bài viết này`, `Đã xảy ra lỗi`);
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
        this.toastr.error(`Không thể xóa bài viết này`, `Đã xảy ra lỗi`);
      },
      complete: () => {
        this.isLoading = false;
      }
    });
  }

  confirmDelete() {
    if (this.showAction || this.showActionSystem) {
      this.setRecipeByStatus(0);
    } else {
      this.setReportRecipeStatus(2);
    }
    
  }

  showPopup(content) {
    this.confirmModalRef = this.modalService.open(content, {ariaLabelledBy: 'modal-basic-title'})
  }

  editRecipe(id) {
    this.activeModal.close();
    this.router.navigate(["../../manager/recipe-system/edit", id], { relativeTo: this.route });
    sessionStorage.setItem("recipeId", "");
  }

  ngOnInit(): void {
    if (this.id) {
      this.isLoading = true;
      this.managerService.getRecipeById(this.id).subscribe({
        next: (recipe: Recipe) => {
          
          let user: User = {
            id: recipe["userId"],
            fullname: recipe["name"],
            avatarUrl: recipe["userImageUrl"] || "https://i.imgur.com/EreYJ0D.png",
            role: recipe["role"]
          } 
          this.recipe = recipe;
          this.recipe.user = user;
          console.log(this.recipe);
        },
        error: (error) => {
          //this.isLoading = false;
        },
        complete: () => {
          this.isLoading = false;
        }
      });
    }
  }

}
