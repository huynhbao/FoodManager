import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { ToastrService } from 'ngx-toastr';
import { AuthenticationService } from 'src/app/services/authentication.service';
import { SharedService } from 'src/app/services/shared.service';
import { ErrorMessage } from '../../constants/app-const';
import { PasswordValidators } from './pw-validators';

@Component({
  selector: 'app-modal-update-password',
  templateUrl: './modal-update-password.component.html',
  styleUrls: ['./modal-update-password.component.scss']
})
export class ModalUpdatePasswordComponent implements OnInit {

  isLoading: boolean = false;
  form: FormGroup;
  submitted = false;
  fieldTextType: boolean = false;
  isMatching: boolean = false;
  isTyping: boolean = false;
  minLength: boolean = false;
  constructor(public activeModal: NgbActiveModal, private sharedService: SharedService, private toastr: ToastrService, private authenticationService: AuthenticationService, private formBuilder: FormBuilder) {
    this.form = this.formBuilder.group({
      currentPassword: ['', [Validators.required]],
      newPassword: ['', [Validators.required, Validators.minLength(8)]],
      confirm: ['', [Validators.required, Validators.minLength(8)]]
    });
  }

  get f() { return this.form.controls; }

  getUser() {
    return this.authenticationService.currentUserValue;
  }

  toggleFieldTextType() {
    this.fieldTextType = !this.fieldTextType;
  }

  onNewPWChange(searchValue) {
    if (this.f["newPassword"].errors && this.f["newPassword"].errors!["minlength"]) {
      this.minLength = true;
    } else {
      this.minLength = false;
    }
  }

  onConfirmChange(searchValue) {
    this.isTyping = true;
    const newPassword = this.form.get('newPassword')?.value;
    const confirmPassword = this.form.get('confirm')?.value;

    if (newPassword === confirmPassword) {
      this.isMatching = true;
    } else {
      this.isMatching = false;
    }
  }

  onSubmit() {
    this.submitted = true;
    console.log(this.form);
    if (this.form.invalid) {
      return;
    }

    this.isLoading = true;
    const currentPassword = this.form.get('currentPassword')?.value;
    const newPassword = this.form.get('newPassword')?.value;
    this.sharedService.updatePassword(currentPassword, newPassword).subscribe({
      next: (res:any) => {
        console.log(res);
        if (res.code == 200) {
          this.toastr.success(`Đã cập nhật mật khẩu thành công`);
          this.activeModal.close();
        }
      },
      error: (error) => {
        console.log(error);
        if (error.error.message == ErrorMessage.WRONG_PASSWORD) {
          this.form.setErrors({ wrongPassword: true });
        }
        this.toastr.error(`Không thể cập nhật mật khẩu`);
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
