import { Component, OnInit } from '@angular/core';
import { NgbModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import Chart from 'chart.js';
import { ToastrService } from 'ngx-toastr';
import { User } from 'src/app/models/user.model';
import { AdminManageService } from 'src/app/services/admin-manage.service';
import { SharedService } from 'src/app/services/shared.service';
import { ModalUserComponent } from 'src/app/shared/components/modal-user/modal-user.component';

// core components
import {
  chartOptions,
  parseOptions,
  chartExample1,
  chartExample2
} from "../../variables/charts";

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss']
})
export class DashboardComponent implements OnInit {

  users: User[] = [];
  collectionSize: any = {
    manager: 0,
    user: 0,
    category_recipe: 0,
    origin: 0,
    method: 0,
    category_ingredient: 0
  };
  isLoading: boolean = true;
  modalRef!: NgbModalRef;

  constructor(private adminService: AdminManageService, private sharedService: SharedService, private modalService: NgbModal, private toastr: ToastrService) {
  }

  loadUsers(role: number) {
    this.adminService.getUsersTop(role).subscribe({
      next: (res: any) => {
        if (role === 1) {
          this.collectionSize.manager = res.totalItem;
        } else if (role === 4) {
          this.collectionSize.user = res.totalItem;
          let users: User[] = res.items;
          this.users = users;
        }
      },
      error: (error) => {
        console.log(error);
      },
      complete: () => {
      }
    });
  }

  loadRecipeCategories() {
    this.adminService
      .getRecipeCategory("", 0)
      .subscribe({
        next: (res: any) => {
          this.collectionSize.category_recipe = res.totalItem;
        },
        error: (error) => {
          console.log(error);
        },
        complete: () => {
        }
      });
  }

  loadOrigins() {
    this.adminService
      .getOrigins("", 0)
      .subscribe({
        next: (res: any) => {
          this.collectionSize.origin = res.totalItem;
        },
        error: (error) => {
          console.log(error);
        },
        complete: () => {
        }
      });
  }

  loadMethods() {
    this.adminService
      .getMethods("", 0)
      .subscribe({
        next: (res: any) => {
          this.collectionSize.method = res.totalItem;
        },
        error: (error) => {
          console.log(error);
        },
        complete: () => {
        }
      });
  }

  loadCategories() {
    this.isLoading = true;
    this.adminService.getCategories("", 0).subscribe({
      next: (res: any) => {
        this.collectionSize.category_ingredient = res.totalItem;
      },
      error: (error) => {
        console.log(error);
      },
      complete: () => {
        this.isLoading = false;
      }
    });
  }

  showUser(userId: string) {
    this.modalRef = this.modalService.open(ModalUserComponent, {ariaLabelledBy: 'modal-basic-title', size: 'lg', windowClass: 'appcustom-modal'});
    this.modalRef.componentInstance.id = userId;
    //this.modalRef.componentInstance.submitFunc = this.submitFunc.bind(this);
  }

  private async loadData() {
    await new Promise(resolve => {
      this.loadUsers(1);
      resolve("");
    });

    await new Promise(resolve => {
      this.loadUsers(4);
      resolve("");
    });

    await new Promise(resolve => {
      this.loadRecipeCategories();
      resolve("");
    });

    await new Promise(resolve => {
      this.loadOrigins();
      resolve("");
    });

    await new Promise(resolve => {
      this.loadMethods();
      resolve("");
    });

    await new Promise(resolve => {
      this.loadCategories();
      resolve("");
    });

    this.isLoading = false;
  }

  ngOnInit() {
    this.loadData();
  }
}
