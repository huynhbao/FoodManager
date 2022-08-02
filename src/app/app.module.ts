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
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { ReportPostComponent } from './shared/pages/report-post/report-post.component';
import { ModalPostComponent } from './shared/components/modal-post/modal-post.component';
import { TimePipe } from './shared/pipes/time.pipe';
import { ModalRecipeComponent } from './shared/components/modal-recipe/modal-recipe.component';
import { ReportRecipeComponent } from './shared/pages/report-recipe/report-recipe.component';
import { ReportUserComponent } from './shared/pages/report-user/report-user.component';
import { ModalUserComponent } from './shared/components/modal-user/modal-user.component';
import { ProfileComponent } from './shared/pages/profile/profile.component';
import { ModalInputComponent } from './shared/components/modal-input/modal-input.component';
import { ModalBanUserComponent } from './shared/components/modal-ban-user/modal-ban-user.component';
import { ModalUnbanUserComponent } from './shared/components/modal-unban-user/modal-unban-user.component';
import { ModalUpdatePasswordComponent } from './shared/components/modal-update-password/modal-update-password.component';

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
    ReportPostComponent,
    ModalPostComponent,
    ModalRecipeComponent,
    ReportRecipeComponent,
    ReportUserComponent,
    ModalUserComponent,
    ProfileComponent,
    ModalInputComponent,
    ModalBanUserComponent,
    ModalUnbanUserComponent,
    ModalUpdatePasswordComponent
  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
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
