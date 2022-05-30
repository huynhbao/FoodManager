import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { BrowserModule } from '@angular/platform-browser';
import { JwtModule } from "@auth0/angular-jwt";
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { AdminComponent } from './admin-dashboard/admin/admin.component';
import { RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { AuthGuard } from './helpers/auth.guard';
import { AuthenticationService } from './services/authentication.service';
import { HttpClientModule } from '@angular/common/http';
import { NavbarComponent } from './shared/components/navbar/navbar.component';
import { ModalCreateComponent } from './shared/components/modal-create/modal-create.component';
import { ModalUpdateComponent } from './shared/components/modal-update/modal-update.component';
import { ManagerComponent } from './manager-dashboard/manager/manager.component';
import { SidebarComponent } from './shared/components/sidebar/sidebar.component';
import { LoginComponent } from './shared/pages/login/login.component';
import { ForgotPasswordComponent } from './shared/pages/forgot-password/forgot-password.component';
import { CodeConfirmComponent } from './shared/pages/code-confirm/code-confirm.component';
import { CodeInputModule } from 'angular-code-input';
import { ChangePasswordComponent } from './shared/pages/change-password/change-password.component';
import { ModalConfirmComponent } from './shared/components/modal-confirm/modal-confirm.component';
import { SharedModule } from './shared/modules/shared/shared.module';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';

export function tokenGetter() {
  let savedToken = localStorage.getItem("currentUser");
  if (savedToken) {
    return JSON.parse(savedToken).token;
  }
  return null;
}

@NgModule({
  declarations: [
    AppComponent,
    SidebarComponent,
    AdminComponent,
    NavbarComponent,
    ModalCreateComponent,
    ModalUpdateComponent,
    ManagerComponent,
    LoginComponent,
    ForgotPasswordComponent,
    CodeConfirmComponent,
    ChangePasswordComponent,
    ModalConfirmComponent,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    FormsModule,
    ReactiveFormsModule,
    RouterModule,
    NgbModule,
    HttpClientModule,
    CodeInputModule,
    SharedModule,
    JwtModule.forRoot({
      config: {
        tokenGetter: tokenGetter,
        allowedDomains: ["api.fooma.tech:8443"],
        disallowedRoutes: ["api.fooma.tech:8443/api/auth/login-system"],
      },
    }),
  ],
  providers: [
    AuthGuard,
    AuthenticationService,
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
