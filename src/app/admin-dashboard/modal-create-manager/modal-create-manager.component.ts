import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { ToastrService } from 'ngx-toastr';
import { AdminManageService } from 'src/app/services/admin-manage.service';
import { Utils } from 'src/app/shared/tools/utils';

@Component({
  selector: 'app-modal-create-manager',
  templateUrl: './modal-create-manager.component.html',
  styleUrls: ['./modal-create-manager.component.scss']
})
export class ModalCreateManagerComponent implements OnInit {

  isLoading: boolean = false;
  submitted: boolean = false;
  form: FormGroup;
  
  constructor(public activeModal: NgbActiveModal, private adminService: AdminManageService, private toastr: ToastrService, private formBuilder: FormBuilder) {
    this.form = this.formBuilder.group({
      email: ['', [Validators.required, Validators.email, Utils.noWhitespaceValidator]],
      firstName: ['', [Validators.required, Utils.noWhitespaceValidator, Validators.pattern("^[a-zA-Z\s]*$")]],
      lastName: ['', [Validators.required, Utils.noWhitespaceValidator, Validators.pattern("^[a-zA-Z\s]*$")]],
    });
  }

  get f() { return this.form.controls; }

  capitalize(s)
  {
    return s && s[0].toUpperCase() + s.slice(1);
  }

  onSubmit() {
    this.submitted = true;
    console.log(this.form);
    if (this.form.invalid) {
      return;
    }
    this.isLoading = true;

    const email = this.form.get('email')?.value.trim();
    const name = Utils.capitalize(this.form.get('firstName')?.value.trim()) + " " + Utils.capitalize(this.form.get('lastName')?.value.trim());
    this.adminService.registerManager(email, name).subscribe({
      next: (res:any) => {
        console.log(res);
        if (res.code == 200) {
          this.toastr.success(`Đã tạo tài khoản quản lý thành công`);
          this.activeModal.close();
        } else if (res.code == 410) {
          this.toastr.error(`Email đã được sử dụng`);
        }
      },
      error: (error) => {
        console.log(error);
        /* if (error.error.message == ErrorMessage.WRONG_PASSWORD) {
          this.form.setErrors({ wrongPassword: true });
        }
        this.toastr.error(`Không thể cập nhật mật khẩu`); */
        this.toastr.error(`Không thể tạo tài khoản quản lý`);
        this.isLoading = false;
      },
      complete: () => {
        this.isLoading = false;
      }
    });

  }

  ngOnInit(): void {
  }

}
