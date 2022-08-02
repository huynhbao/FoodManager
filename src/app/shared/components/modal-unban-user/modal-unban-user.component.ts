import { Component, Input, OnInit } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { ToastrService } from 'ngx-toastr';
import { User } from 'src/app/models/user.model';
import { AdminManageService } from 'src/app/services/admin-manage.service';

@Component({
  selector: 'app-modal-unban-user',
  templateUrl: './modal-unban-user.component.html',
  styleUrls: ['./modal-unban-user.component.scss']
})
export class ModalUnbanUserComponent implements OnInit {
  @Input() user!: User;
  @Input() submitFunc!: Function;
  isLoading: boolean = false;
  constructor(public activeModal: NgbActiveModal, private adminService: AdminManageService, private toastr: ToastrService) { }

  onSubmit() {
    this.isLoading = true;
    this.adminService.unbanUser(this.user.userId || "").subscribe({
      next: (res: any) => {
        console.log(res);
        if (this.submitFunc) {
          this.submitFunc();
        }
        this.toastr.success(`Đã gỡ ban người dùng ${this.user.name}`);
        this.activeModal.close();
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
    console.log(this.user);
  }

}
