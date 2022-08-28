import { Component } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import { fromEvent } from 'rxjs';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  title = 'FoodManager';

  constructor(private toastr: ToastrService) {
    fromEvent(window, 'online').subscribe(e => {
      this.toastr.info(`Đã khôi phục kết nối mạng`);
    });

    fromEvent(window, 'offline').subscribe(e => {
      this.toastr.error(`Đã bị mất kết nối mạng. Vui lòng kiểm tra lại đường truyền internet của bạn`);
    });
  }
}
