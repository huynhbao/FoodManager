import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { BrowserModule } from '@angular/platform-browser';
import { JwtModule } from "@auth0/angular-jwt";
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { LoginComponent } from './login/login.component';
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
import { ManageIngredientComponent } from './shared/pages/manage-ingredient/manage-ingredient.component';

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
    LoginComponent,
    SidebarComponent,
    AdminComponent,
    NavbarComponent,
    ModalCreateComponent,
    ModalUpdateComponent,
    ManagerComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    FormsModule,
    ReactiveFormsModule,
    CommonModule,
    RouterModule,
    NgbModule,
    HttpClientModule,
    JwtModule.forRoot({
      config: {
        tokenGetter: tokenGetter,
        allowedDomains: ["foomacdn.ddns.net"],
        disallowedRoutes: ["foomacdn.ddns.net/api/auth/login-system"],
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
