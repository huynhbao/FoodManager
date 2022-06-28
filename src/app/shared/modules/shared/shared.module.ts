import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SpinnerComponent } from '../../components/spinner/spinner.component';
import { TimePipe } from '../../pipes/time.pipe';
import { FontAwesomeModule, FaIconLibrary } from '@fortawesome/angular-fontawesome';
import {
  faClock as farClock,
} from '@fortawesome/free-regular-svg-icons';
import { faClock, faUsers, faFire, faCheckCircle } from '@fortawesome/free-solid-svg-icons';

@NgModule({
  imports: [
    CommonModule,
    FontAwesomeModule,
  ],
  declarations: [
    SpinnerComponent,
    TimePipe,
  ],
  exports: [
    SpinnerComponent,
    TimePipe,
    FontAwesomeModule,
  ]
})
export class SharedModule {
  constructor(library: FaIconLibrary) {
    library.addIcons(
      faClock,
      farClock,
      faUsers,
      faFire,
      faCheckCircle
    );
  }
}
