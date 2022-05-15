import { Component, OnInit, QueryList, ViewChildren } from '@angular/core';
import { FormArray, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AccountService } from 'src/app/services/account.service';
import { ErrorMessage } from '../../constants/app-const';

@Component({
  selector: 'app-code-confirm',
  templateUrl: './code-confirm.component.html',
  styleUrls: ['./code-confirm.component.scss']
})
export class CodeConfirmComponent implements OnInit {
  submitted = false;
  form: FormGroup;
  confirmCode!: string;
  invalidCode: boolean = true;
  invalidServerCode: boolean = false;
  loading: boolean = false;

  constructor(private formBuilder: FormBuilder, private accountService: AccountService, private router: Router) {
    this.form = this.formBuilder.group({
      digits: this.formBuilder.array([])
    });
  }

  get f() { return this.form.controls; }

  onSubmit() {
    this.submitted = true;
    if (this.form.invalid) {
      return;
    }

    this.loading = true;
    const forgotData = this.accountService.getForgotData;
    this.accountService.forgotPassValidate(this.confirmCode).subscribe({
      next: (value) => {
        if (value.code) {
          forgotData.code = value.code;
          this.accountService.changeForgotDataValue(forgotData);
          this.router.navigate(['change-password']);
        }
      },
      error: error => {
        console.log(error);
        this.loading = false
        if (error.error.message == ErrorMessage.WRONG_CODE) {
          this.invalidServerCode = true;
        }
      }
    });
  }

  onCodeChanged(code: string) {
    this.confirmCode = code;
    this.invalidCode = true;
  }

  // this called only if user entered full code
  onCodeCompleted(code: string) {
    this.confirmCode = code;
    this.invalidCode = false;
  }

  ngOnInit(): void {
    const forgotData = this.accountService.getForgotData;
    if (forgotData.email.length === 0) {
      this.router.navigate(['login']);
    }
  }

}
