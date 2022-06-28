import { Component, Input, OnInit } from '@angular/core';
import { NgbActiveModal, NgbCarouselConfig, NgbModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { Recipe } from 'src/app/models/recipe.model';
import { User } from 'src/app/models/user.model';
import { ManagerService } from 'src/app/services/manager.service';
import { SharedService } from 'src/app/services/shared.service';

@Component({
  selector: 'app-modal-recipe',
  templateUrl: './modal-recipe.component.html',
  styleUrls: ['./modal-recipe.component.scss']
})
export class ModalRecipeComponent implements OnInit {

  @Input() id!: string;
  @Input() reportId!: string;
  @Input() submitFunc!: Function;
  modalRef!: NgbModalRef;
  confirmModalRef!: NgbModalRef;
  recipe!: Recipe;
  isLoading: boolean = true;
  
  constructor(private sharedService: SharedService, private managerService: ManagerService, private config: NgbCarouselConfig, public activeModal: NgbActiveModal, private modalService: NgbModal) {
    config.interval = 0;
  }

  splitDescription(value: string) {
    value = value.replace(/\s/g, '');
    let hashtag = value.split('#').slice(1);
    
    return hashtag;
  }

  setRecipeByStatus(id: string, status: number) {
    this.managerService.setRecipeByStatus(id, status).subscribe({
      next: (res:any) => {
        console.log(res);
        this.activeModal.close();
        this.submitFunc();
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
    this.setRecipeByStatus(this.id, 0);
    this.sharedService.acceptReportRecipe(this.reportId).subscribe({
      next: (res:any) => {
        console.log(res);
        if (res.code == 200) {
          if (status === 2) {
            console.log(this.id);
            this.setRecipeByStatus(this.id, 0);
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

  confirmDelete() {
    this.setReportStatus(2);
  }

  showPopup(content) {
    this.confirmModalRef = this.modalService.open(content, {ariaLabelledBy: 'modal-basic-title'})
  }

  ngOnInit(): void {
    if (this.id) {
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
          this.isLoading = false;
        },
        complete: () => {
          this.isLoading = false;
        }
      });
    }
  }

}
