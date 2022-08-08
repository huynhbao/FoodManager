import { Component, Input, OnInit } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-modal-input',
  templateUrl: './modal-input.component.html',
  styleUrls: ['./modal-input.component.scss']
})
export class ModalInputComponent implements OnInit {

  @Input() id: any;
  @Input() status: any;
  @Input() submitFunc!: Function;
  reasonModel: string = "";
  reasonsOption = [
    {
      id: 1,
      display: "Bài đăng có từ ngữ không văn hóa"
    },
    {
      id: 2,
      display: "Bài đăng có hình ảnh không phù hợp"
    },
    {
      id: 3,
      display: "Bài đăng có nội dung không phù hợp"
    },
    {
      id: 4,
      display: "Bài đăng có nội dung không rõ ràng"
    },
    {
      id: 5,
      display: "Bài đăng spam"
    },
    {
      id: 6,
      display: "Bài đăng vi phạm tiêu chuẩn công đồng FOOMA app"
    },
    {
      id: 0,
      display: "Khác"
    },
  ];
  selectedReason = 0;

  constructor(public activeModal: NgbActiveModal) { }

  onSubmit() {
    let reason = "";
    if (this.selectedReason === 0) {
      reason = this.reasonModel;
    } else {
      reason = this.reasonsOption[this.selectedReason].display;
    }
    this.submitFunc(this.id, this.reasonModel, this.status);
  }

  ngOnInit(): void {
  }

}
