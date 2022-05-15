import { Component, OnInit } from '@angular/core';
import { AbstractControl, FormBuilder, FormGroup, ValidationErrors, ValidatorFn, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AccountService } from 'src/app/services/account.service';
import { ErrorMessage } from '../../constants/app-const';

@Component({
  selector: 'app-change-password',
  templateUrl: './change-password.component.html',
  styleUrls: ['./change-password.component.scss']
})
export class ChangePasswordComponent implements OnInit {

  submitted = false;
  loading = true;
  success = false;
  form!: FormGroup;
  constructor(private formBuilder: FormBuilder, private accountService: AccountService, private router: Router) {
  }

  get forgotData() {
    return this.accountService.getForgotData;
  }

  get f() { return this.form.controls; }

  onSubmit() {
    this.submitted = true;
    
    if (this.form.invalid) {
      return;
    }

    this.loading = true;

    const password: string = this.f['password'].value;

    this.accountService.forgotPassComplete(password).subscribe({
      next: (value) => {
        console.log(value);
        if (value.code == 200) {
          //this.accountService.changeForgotDataValue({email: "", code: ""});
          this.success = true;
        }
      },
      error: error => {
        console.log(error);
        this.loading = false
        if (error.error.message == ErrorMessage.WRONG_CODE) {
          this.form.setErrors({ wrongCode: true });
        }
      }
    });
  }

  
  onPasswordChange() {
    let pass = this.f['password'].value;
    let confirmPass = this.f['confirmPassword'].value;
    
    if (pass == confirmPass) {
      this.form.setErrors(null);
    } else {
      this.form.setErrors({ mismatch: true });
    }
    this.loading = pass != confirmPass;
  }

  ngOnInit(): void {
    if (this.forgotData.email.length === 0 && !this.success) {
      this.router.navigate(['login']);
    }

    this.form = this.formBuilder.group({
      password: ["", [Validators.required, Validators.minLength(1)]],
      confirmPassword: ["", [Validators.required]],
    });
  }

}
