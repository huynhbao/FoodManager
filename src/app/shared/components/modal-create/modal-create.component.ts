import { formatDate } from '@angular/common';
import { Component, Input, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { NgbActiveModal, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { SharedService } from 'src/app/services/shared.service';

@Component({
  selector: 'app-modal-create',
  templateUrl: './modal-create.component.html',
  styleUrls: ['./modal-create.component.scss']
})
export class ModalCreateComponent implements OnInit {
  @Input() fromParent: any;
  @Input() submitFunc!: Function;
  @Input() createFromRecipeCb!: Function;
  form: FormGroup;
  submitted: boolean = false;
  previews: string[] = [];
  selectedFiles?: FileList;
  currentDate;
  constructor(private sharedService: SharedService, private formBuilder: FormBuilder, private modalService: NgbModal, public activeModal: NgbActiveModal) {
    this.form = this.formBuilder.group({});
  }

  ngOnInit(): void {
    this.currentDate = new Date().toISOString().slice(0, 10);
    for (let i = 0; i < this.fromParent.length; i++) {
      let value = this.fromParent[i];
      if (i == 0) {

      } else {
        for (let _ in value) {
          if (value.type === "date") {
            this.form.addControl(value.key, new FormControl(formatDate(new Date(value.validator.defaultValue), 'yyyy-MM-dd', 'en'), value.validator.valid))
          } else {
            this.form.addControl(value.key, new FormControl(value.validator.defaultValue, value.validator.valid))
          }
        }
      }
    }
  }

  get f() { return this.form.controls; }

  selectFiles(event: any): void {
    this.selectedFiles = event.target.files;
    
    if (this.selectedFiles && this.selectedFiles[0]) {
      this.previews = [];
      const numberOfFiles = this.selectedFiles.length;
      for (let i = 0; i < numberOfFiles; i++) {
        const reader = new FileReader();

        reader.onload = (e: any) => {
          this.previews.push(e.target.result);
        };

        reader.readAsDataURL(this.selectedFiles[i]);
      }
    }
  }

  onSubmit() {
    this.submitted = true;
    if (this.form.invalid || (this.previews.length === 0 && this.fromParent[0].thumbnail)) {
      return;
    }
    
    let form:any = {};
    for (const field in this.form.controls) {
      const control = this.form.get(field);
      form[field] = control?.value
    }
    if (this.submitFunc) {
      this.submitFunc(form, this.previews);
    }

    if (this.createFromRecipeCb) {
      this.createFromRecipeCb(form, this.previews, this.fromParent[0].indexRecipe);
    }
  }
}
