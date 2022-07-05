import { Component, OnInit } from '@angular/core';
import { User } from 'src/app/models/user.model';
import { AuthenticationService } from 'src/app/services/authentication.service';
import { AdminManageService } from 'src/app/services/admin-manage.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { formatDate } from '@angular/common';

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
  
  constructor(private authenticationService: AuthenticationService, private adminService: AdminManageService, private formBuilder: FormBuilder) {
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

  onSubmit() {
    this.submitted = true;
    
    if (this.form.invalid) {
      return;
    }

    this.isLoading = true;

    let updateInfo = {
      name: this.f['fullName'].value,
      birthDate: this.f['dob'].value,
      phoneNumber: this.f['phone'].value,
      imageUrl: "",
      bio: this.f['bio'].value
    }
  }

  ngOnInit(): void {
    const userStorage = this.authenticationService.currentUserValue.currentUser;
    this.adminService.getUserById(userStorage.nameid).subscribe({
      next: (user: User) => {
        this.user = user;
        console.log(this.user);
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
