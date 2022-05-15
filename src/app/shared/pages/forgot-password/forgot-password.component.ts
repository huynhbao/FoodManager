import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AccountService } from 'src/app/services/account.service';
import { ErrorMessage } from '../../constants/app-const';

@Component({
  selector: 'app-forgot-password',
  templateUrl: './forgot-password.component.html',
  styleUrls: ['./forgot-password.component.scss']
})
export class ForgotPasswordComponent implements OnInit {

  submitted = false;
  loading = false;
  form!: FormGroup;
  
  constructor(private formBuilder: FormBuilder, private accountService: AccountService, private router: Router) { }

  get f() { return this.form.controls; }

  onSubmit() {
    this.submitted = true;
    if (this.form.invalid) {
      return;
    }
    this.loading = true;

    const email: string = this.f['email'].value;
    
    this.accountService.forgotPassInit(email).subscribe({
      next: (value) => {
        if (value.code == 200) {          
          this.accountService.currentForgotData.subscribe((data) => {
            data.email = email;
            this.router.navigate(['code-confirm']);
          });
        }
      },
      error: error => {
        console.log(error);
        this.loading = false
        if (error.error.message == ErrorMessage.USER_NOT_FOUND) {
          this.form.setErrors({ userNotFound: true });
        }
      }
    });
  }

  ngOnInit(): void {
    this.form = this.formBuilder.group({
      email: ["", [Validators.required, Validators.email]]
    });
  }

}
