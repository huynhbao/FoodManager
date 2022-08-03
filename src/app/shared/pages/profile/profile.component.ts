import { Component, OnInit } from '@angular/core';
import { User } from 'src/app/models/user.model';
import { AuthenticationService } from 'src/app/services/authentication.service';
import { AdminManageService } from 'src/app/services/admin-manage.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { formatDate } from '@angular/common';
import { SharedService } from 'src/app/services/shared.service';
import { ToastrService } from 'ngx-toastr';
import { NgbModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { ModalUpdatePasswordComponent } from '../../components/modal-update-password/modal-update-password.component';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.scss']
})
export class ProfileComponent implements OnInit {
  user!: User;
  isLoading: boolean = true;
  isGettingData: boolean = true;
  form: FormGroup;
  isDisabled: boolean = true;
  submitted = false;
  isNewAvatar: boolean = false;
  modalRef!: NgbModalRef;

  constructor(private sharedService: SharedService, private authenticationService: AuthenticationService, private modalService: NgbModal, private formBuilder: FormBuilder, private toastr: ToastrService) {
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

  getAge(dateString) {
    var today = new Date();
    var birthDate = new Date(dateString);
    var age = today.getFullYear() - birthDate.getFullYear();
    var m = today.getMonth() - birthDate.getMonth();
    if (m < 0 || (m === 0 && today.getDate() < birthDate.getDate())) {
        age--;
    }
    return age;
  }

  toggleEdit() {
    const formStatus:boolean = this.form.enabled;
    if (formStatus) {
      this.form.disable();
    } else {
      this.form.enable();
    }
  }

  onSelectFile(event) {
    if (event.target.files && event.target.files[0]) {
      const reader = new FileReader();

      reader.readAsDataURL(event.target.files[0]); // read file as data url

      reader.onload = (e: any) => { // called once readAsDataURL is completed
        //console.log(e.target.result);
        this.isNewAvatar = true;
        this.user.imageUrl = e.target.result;
        this.form.enable();
      }
    }
  }

  async onSubmit() {
    this.submitted = true;
    if (this.form.invalid) {
      return;
    }

    this.isLoading = true;

    if (this.isNewAvatar) {
      await new Promise(resolve => {
        this.sharedService.uploadImage(this.user.imageUrl!).subscribe({
          next: (res:any) => {
            const imgUrl:string = res.secure_url;
            if (imgUrl) {
              this.user.imageUrl = imgUrl;
              resolve("");
            }
          },
          error: (error) => {
            console.log(error);
          }
        });
      });
    }

    let updateInfo = {
      name: this.f['fullName'].value,
      birthDate: this.f['dob'].value,
      phoneNumber: this.f['phone'].value,
      imageUrl: this.user.imageUrl,
      bio: this.f['bio'].value
    }

    this.sharedService.updateUser(updateInfo).subscribe({
      next: async (res:any) => {
        console.log(res);
        if (res.code == 204) {
          this.toastr.info(`Không có thay đổi thông tin nào mới`);
        } else if (res.code == 200) {
          this.toastr.success(`Đã cập nhật thông tin thành công`);
          this.form.disable();
          let userInfo = this.authenticationService.currentUserValue;
          await new Promise(resolve => {
            this.sharedService.getProfile().subscribe({
              next: (user: User) => {
                userInfo["currentProfile"] = user;
                this.authenticationService.setCurrentUserValue(userInfo);
                resolve("");
              },
              error: (error) => {
              },
              complete: () => {
              }
            });
          });
          
        }
      },
      error: (error) => {
        console.log(error);
        this.toastr.error(`Không thể cập nhật thông tin`, `Đã xảy ra lỗi`);
      },
      complete: () => {
        this.isLoading = false;
      }
    });
  }

  changePassword() {
    this.modalRef = this.modalService.open(ModalUpdatePasswordComponent, {ariaLabelledBy: 'modal-basic-title'});
  }

  ngOnInit(): void {
    //const userStorage = this.authenticationService.currentUserValue.currentProfile;
    this.user = this.authenticationService.currentUserValue.currentProfile;
    this.form.setValue({
      fullName: this.user.name,
      bio: this.user.bio,
      phone: this.user.phoneNumber,
      dob: formatDate(new Date(this.user.birthDate || new Date), 'yyyy-MM-dd', 'en')
    });
    this.isLoading = false;
    this.isGettingData = false;
    /* this.sharedService.getProfile().subscribe({
      next: (user: User) => {
        this.user = user;
        console.log(this.user);
        this.form.setValue({
          fullName: this.user.name,
          bio: this.user.bio,
          phone: this.user.phoneNumber,
          dob: formatDate(new Date(this.user.birthDate || new Date), 'yyyy-MM-dd', 'en')
        });
      },
      error: (error) => {
      },
      complete: () => {
        this.isLoading = false;
        this.isGettingData = false;
      }
    }); */
  }

}
