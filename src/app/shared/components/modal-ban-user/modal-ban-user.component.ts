import {NgbActiveModal} from '@ng-bootstrap/ng-bootstrap';
import { Component, Input, OnInit } from '@angular/core';
import { User } from 'src/app/models/user.model';
import '../../prototypes/date.extensions';
import { AdminManageService } from 'src/app/services/admin-manage.service';
import { ToastrService } from 'ngx-toastr';
import { DatePipe } from '@angular/common';
@Component({
  selector: 'app-modal-ban-user',
  templateUrl: './modal-ban-user.component.html',
  styleUrls: ['./modal-ban-user.component.scss']
})
export class ModalBanUserComponent implements OnInit {

  @Input() user!: User;
  @Input() reportId!: string;
  @Input() submitFunc!: Function;

  reason: string = "";
  banInfo = [
    {
      time: 24, //hour
      display: "1 ngày"
    },
    {
      time: 24 * 3,
      display: "3 ngày"
    },
    {
      time: 24 * 7,
      display: "7 ngày"
    },
    {
      time: 24 * 15,
      display: "15 ngày"
    },
    {
      time: 24 * 30,
      display: "30 ngày"
    },
  ];
  
  selectedBanDay: number = 0;
  constructor(public activeModal: NgbActiveModal, private adminService: AdminManageService, private toastr: ToastrService) {
  }

  onSubmit() {
    const datePipe = new DatePipe('en-US');
    const banHour:number = this.banInfo[this.selectedBanDay].time;
    const expiredDate = new Date().addHours(banHour);
    const formattedDate = datePipe.transform(expiredDate, 'yyyy-MM-dd') || "";
    this.adminService.banUser(this.user.id, this.reason.trim(), formattedDate).subscribe({
      next: (res: any) => {
        if (this.submitFunc) {
          this.submitFunc(this.reportId);
        }
        this.toastr.success(`Thời gian ban: ${this.banInfo[this.selectedBanDay].display}`, `Đã ban người dùng ${this.user.name}`, );
        this.activeModal.close();
      },
      error: (error) => {
        console.log(error);
      },
      complete: () => {
      }
    });
  }
  

  ngOnInit(): void {
    
  }

}
