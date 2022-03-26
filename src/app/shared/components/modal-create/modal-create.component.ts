import { Component, Input, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { NgbActiveModal, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { Category } from 'src/app/models/category.model';
import { User } from 'src/app/models/user.model';

@Component({
  selector: 'app-modal-create',
  templateUrl: './modal-create.component.html',
  styleUrls: ['./modal-create.component.scss']
})
export class ModalCreateComponent implements OnInit {
  @Input() fromParent: any;
  categoryForm: FormGroup;
  selectedStatus?: string;
  selectedCategory?: Category;
  constructor(private formBuilder: FormBuilder, private modalService: NgbModal, public activeModal: NgbActiveModal) {
    this.categoryForm = this.formBuilder.group(
      {
        categoryID: ["", Validators.required],
        categoryName: ["", Validators.required],
      }
    );
    
  }

  ngOnInit(): void {
    //console.log((this.fromParent[0].createDate));
    this.selectedStatus = this.fromParent[0].status;
    this.categoryForm = this.formBuilder.group({});
    for (let i = 0; i < this.fromParent.length; i++) {
      let value = this.fromParent[i];
      if (i == 0) {

      } else {
        for (let _ in value) {
          this.categoryForm.addControl(value.key, this.formBuilder.control(value.state, value.valid))
        }
      }

    }

  }

  triggerModal(content: any) {
    this.categoryForm.reset();
    this.modalService.open(content, { ariaLabelledBy: 'modal-basic-title', size: 'lg', windowClass: 'appcustom-modal', backdrop: 'static' }).result.then((result) => {
      //this.closeResult = `Closed with: ${result}`;
    }, (reason) => {
      //this.closeResult = `Dismissed ${this.getDismissReason(reason)}`;
    });
  }


  log(val: any) { console.log(val); }


  changeSelectStatus(selectedStatus: string) {
    this.selectedStatus = selectedStatus;
  }

}
