import { Component, Input, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup } from '@angular/forms';
import { NgbActiveModal, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { SharedService } from 'src/app/services/shared.service';

@Component({
  selector: 'app-modal-update',
  templateUrl: './modal-update.component.html',
  styleUrls: ['./modal-update.component.scss']
})
export class ModalUpdateComponent implements OnInit {
  @Input() fromParent: any;
  @Input() submitFunc!: Function;
  form: FormGroup;
  submitted: boolean = false;
  previews: string[] = [];
  selectedFiles?: FileList;
  constructor(private sharedService: SharedService, private formBuilder: FormBuilder, private modalService: NgbModal, public activeModal: NgbActiveModal) {
    this.form = this.formBuilder.group({});
  }

  ngOnInit(): void {
    for (let i = 0; i < this.fromParent.length; i++) {
      let value = this.fromParent[i];
      if (i == 0) {

      } else {
        for (let _ in value) {
          this.form.addControl(value.key, new FormControl({value: value.validator.defaultValue, disabled: value.validator.disabled}, value.validator.valid))
        }
      }
    }
  }

  get f() { return this.form.controls; }

  selectFiles(event: any, controlName: string): void {
    this.selectedFiles = event.target.files;
    
    if (this.selectedFiles && this.selectedFiles[0]) {
      this.previews = [];
      const numberOfFiles = this.selectedFiles.length;
      for (let i = 0; i < numberOfFiles; i++) {
        const reader = new FileReader();

        reader.onload = (e: any) => {
          this.form.get(controlName)?.setValue(e.target.result);
          //this.previews.push(e.target.result);
        };

        reader.readAsDataURL(this.selectedFiles[i]);
      }
    }
  }

  onSubmit() {
    this.submitted = true;
    if (this.form.invalid) {
      return;
    }

    let form:any = {};
    form["id"] = this.fromParent[0].id;
    for (const field in this.form.controls) {
      const control = this.form.get(field);
      form[field] = control?.value
    }
    this.submitFunc(form, this.fromParent[0].imgUrl);
  }

}
