import { formatDate } from '@angular/common';
import { Component, Input, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { NgbActiveModal, NgbModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { ToastrService } from 'ngx-toastr';
import { User } from 'src/app/models/user.model';
import { AdminManageService } from 'src/app/services/admin-manage.service';
import { ManagerService } from 'src/app/services/manager.service';
import { SharedService } from 'src/app/services/shared.service';
import { ModalBanUserComponent } from '../modal-ban-user/modal-ban-user.component';

@Component({
  selector: 'app-modal-user',
  templateUrl: './modal-user.component.html',
  styleUrls: ['./modal-user.component.scss']
})
export class ModalUserComponent implements OnInit {
  @Input() id!: string;
  @Input() reportId!: string;
  @Input() submitFunc!: Function;
  user!: User;
  isLoading: boolean = true;
  isGettingData: boolean = true;
  modalRef!: NgbModalRef;
  confirmModalRef!: NgbModalRef;

  form: FormGroup;
  isDisabled: boolean = true;
  
  constructor(private sharedService: SharedService, private adminService: AdminManageService, public activeModal: NgbActiveModal, private modalService: NgbModal, private formBuilder: FormBuilder, private toastr: ToastrService) {
    this.form = this.formBuilder.group({
      fullName: [{value: '', disabled: this.isDisabled}, Validators.required],
      bio: [{value: '', disabled: this.isDisabled}, Validators.required],
      phone: [{value: '', disabled: this.isDisabled}, [ Validators.required,
        Validators.pattern("^[0-9]*$"),
        Validators.minLength(10),
        Validators.maxLength(10)
      ]],
      dob: [{value:'', disabled: this.isDisabled}, Validators.required],
    });
  }

  get f() { return this.form.controls; }

  toggleEdit() {
    const formStatus:boolean = this.form.enabled;
    if (formStatus) {
      this.form.disable();
    } else {
      this.form.enable();
    }
  }

  acceptReport() {
    this.isLoading = true;
    this.sharedService.acceptReportUser(this.reportId).subscribe({
      next: (res:any) => {
        console.log(res);
        if (res.code == 200) {
          this.toastr.success(`Đã bỏ qua báo cáo`);
          this.activeModal.close();
          this.submitFunc();
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

  showPopup() {
    this.modalRef = this.modalService.open(ModalBanUserComponent, {ariaLabelledBy: 'modal-basic-title'});
    this.modalRef.componentInstance.user = this.user;
    this.modalRef.componentInstance.submitFunc = this.submitBanUser.bind(this);
  }

  submitBanUser() {
    this.isLoading = true;
    this.sharedService.acceptReportUser(this.reportId).subscribe({
      next: (res:any) => {
        console.log(res);
        if (res.code == 200) {
          this.activeModal.close();
          this.submitFunc();
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

  ngOnInit(): void {
    if (this.id) {
      this.adminService.getUserById(this.id).subscribe({
        next: (user: User) => {
          this.user = user;
          this.form.setValue({
            fullName: this.user.name,
            bio: this.user.bio,
            phone: this.user.phoneNumber,
            dob: formatDate(new Date(this.user.birthDate || new Date), 'yyyy-MM-dd', 'en'),
          });
        },
        error: (error) => {
        },
        complete: () => {
          this.isLoading = false;
          this.isGettingData = false;
        }
      });
    }
  }

}
