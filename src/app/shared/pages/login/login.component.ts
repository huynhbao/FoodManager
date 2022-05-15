import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { AuthenticationService } from '../../../services/authentication.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {
  form!: FormGroup;
  loading = false;
  submitted = false;

  constructor(
    private formBuilder: FormBuilder,
    private route: ActivatedRoute,
    private router: Router,
    private authenticationService: AuthenticationService,
  ) {
    if (this.authenticationService.currentUserValue) {
      let role:String = this.authenticationService.currentUserValue.currentUser.role;
      this.router.navigate([role.toLowerCase()]);
    }
  }

  ngOnInit(): void {
    this.form = this.formBuilder.group({
      email: ['', Validators.required],
      password: ['', Validators.required]
    });
  }

  get f() { return this.form.controls; }

  onSubmit() {
    this.submitted = true;

    // stop here if form is invalid
    if (this.form.invalid) {
      return;
    }

    this.loading = true;

    this.authenticationService.login(this.f['email'].value, this.f['password'].value)
      .subscribe({
        next: (value) => {
          // get return url from query parameters or default to home page
          //const returnUrl = this.route.snapshot.queryParams['returnUrl'] || '/';
          //this.router.navigateByUrl(value.role + "/dashboard");
          //this.router.navigate([value.role]);
          this.router.navigate([value.currentUser.role.toLowerCase()]);
        },
        error: error => {
          //this.alertService.error(error);
          this.loading = false;
          console.log(error);
          if (error.error.status === 401) {
            this.form.setErrors({unauthorized: true});
          }
        }
      });
  }
}
