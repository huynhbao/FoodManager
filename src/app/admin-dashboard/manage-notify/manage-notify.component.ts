import { Component, OnInit } from '@angular/core';
import { FormArray, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { Notify, TimeAppSettings } from 'src/app/models/notify.model';
import { AdminManageService } from 'src/app/services/admin-manage.service';

@Component({
  selector: 'app-manage-notify',
  templateUrl: './manage-notify.component.html',
  styleUrls: ['./manage-notify.component.scss']
})

export class ManageNotifyComponent implements OnInit {

  isLoading: boolean = false;
  notify!:Notify;
  form: FormGroup;
  timeOption:TimeOption[] = [];
  listTime:any[] = [];
  submitted: boolean = false;

  checkTimeExisted: boolean = false;
  
  constructor(private adminService: AdminManageService, private toastr: ToastrService, private formBuilder: FormBuilder,) {
    this.form = this.formBuilder.group({
      dayYellowForIngredient: ['', [Validators.required, Validators.pattern("^[0-9]*$"), Validators.min(1), Validators.max(10)]],
      dayNotiForIngredient: ['', [Validators.required, Validators.pattern("^[0-9]*$"), Validators.min(1), Validators.max(10)]],
      dayNotiForPlan: ['', [Validators.required, Validators.pattern("^[0-9]*$"), Validators.min(1), Validators.max(10)]],
      timeAppSettings: this.formBuilder.array([]),
    });

    for (let i = 0; i < 24; i++) {
      this.timeOption.push({
        time: i,
        display: `${i} giờ`
      }); 
    }
  }

  get f() {
    return this.form.controls;
  }

  get formTimeAppSettings() { return this.f["timeAppSettings"] as FormArray; }

  setCheckTimeExisted(value: boolean) {
    this.checkTimeExisted = value;
  }

  private mapToForm() {
    this.form.setValue({
      dayYellowForIngredient: this.notify.dayYellowForIngredient,
      dayNotiForIngredient: this.notify.dayNotiForIngredient,
      dayNotiForPlan: this.notify.dayNotiForPlan,
      timeAppSettings: []
    });

    this.notify.timeAppSettings.forEach(timeAppSetting => {
      this.formTimeAppSettings.push(this.formBuilder.group({
        timeForNoti: [timeAppSetting.timeForNoti, [Validators.required, Validators.pattern("^[0-9]*$")]],
      }));
    });

    /* for (let i = 0; i < this.formTimeAppSettings.controls.length; i++) {
      const element = this.formTimeAppSettings.controls[i];
      console.log(element);
    } */

  }

  initListTime(index: number, currentTimeStr?: string):TimeOption[] {
    
    this.listTime[index] = [];
    
    this.listTime[index].push(this.timeOption);

    /* for (let i = 0; i < this.timeOption.length; i++) {
      const timeOption = this.timeOption[i];
      let check: boolean = false;
    } */

    for (let j = 0; j < this.formTimeAppSettings.controls.length; j++) {
      const timeValue = this.stringToNumber(this.formTimeAppSettings.controls[j].value.timeForNoti);

      this.listTime[index][0] = this.listTime[index][0].filter(
        (time: TimeOption) => time.time !== timeValue
      )
     
    }

    const currentTime: number = this.stringToNumber(currentTimeStr);
    this.listTime[index][0].push(this.timeOption.filter((time: TimeOption) => time.time === currentTime)[0]);
    this.listTime[index][0].sort((a, b) => a.time > b.time ? 1 : -1);
    //this.listTime[index][0] = this.listTime[index][0].push(this.timeOption[index]);
    /* console.log(
      this.listTime[index][0].filter(
        (time: TimeOption) => time.time !== 1
      )
    ); */

    return this.listTime[index][0];

    
  }

  setTime(indexForm: number, timeValue: number) {
    // console.log(indexTimeOption, this.listTime[indexTimeOption]);
    this.formTimeAppSettings.controls[indexForm]['controls']['timeForNoti'].patchValue(timeValue);
  }

  addTime() {
    const index:number = this.formTimeAppSettings.controls.length + 1;
    this.formTimeAppSettings.push(this.formBuilder.group({
      timeForNoti: [this.initListTime(index)[0].time, [Validators.required, Validators.pattern("^[0-9]*$")]],
    }));
  }

  removeTime(index:number) {
    this.formTimeAppSettings.removeAt(index);
  }
  
  onSubmit() {
    this.submitted = true;
    console.log(this.form);
    if (
      this.form.invalid
    ) {
      this.scrollToError();
      this.toastr.error(`Kiểm tra các thông tin chưa điền đầy đủ`, `Đã xảy ra lỗi`);
      return;
    }
    this.isLoading = true;

    let timeAppSettings: TimeAppSettings[] = [];
    for (let c of this.formTimeAppSettings.controls) {
      const ingredientForm = c["controls"]["timeForNoti"].value;
      const timeAppSetting: TimeAppSettings = {
        timeForNoti: ingredientForm,
      }
      timeAppSettings.push(timeAppSetting);
    }

    timeAppSettings.sort((a, b) => a.timeForNoti > b.timeForNoti ? 1 : -1);
    const notify:Notify = {
      dayYellowForIngredient: this.f['dayYellowForIngredient'].value,
      dayNotiForIngredient: this.f['dayNotiForIngredient'].value,
      dayNotiForPlan: this.f['dayNotiForPlan'].value,
      timeAppSettings: timeAppSettings
    }


    this.adminService.updateNotify(notify).subscribe({
      next: (res:any) => {
        console.log(res);
        if (res.code == 200) {
          this.toastr.success(`Đã cập nhật thông báo`);
          window.scroll({ 
            top: 0, 
            left: 0, 
            behavior: 'smooth' 
          });
        } else if (res.code == 204) {
          this.toastr.info(`Không có gì thay đổi`);
        }
      },
      error: (error) => {
        console.log(error);
        this.toastr.error(`Không thể cập nhật thông báo`, `Đã xảy ra lỗi`);
        this.isLoading = false;
      },
      complete: () => {
        this.isLoading = false;
      }
    });
  }

  scrollTo(el: Element): void {
    if (el) {
      el.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }
  }

  scrollToError(): void {
    const firstElementWithError = document.querySelector('.ng-invalid[formControlName]')!;
    this.scrollTo(firstElementWithError);
  }

  private loadNotify() {
    this.isLoading = true;
    this.adminService.getNotify().subscribe({
        next: (res: Notify) => {
          this.notify = res;
          this.mapToForm();
          // console.log(this.notify);
        },
        error: (error) => {
          console.log(error);
        },
        complete: () => {
          this.isLoading = false;
        }
      });
  }

  ngOnInit(): void {
    this.loadNotify();
  }

  print(value) {
    console.log(value);
  }

  stringToNumber(value){
    return parseFloat(value)
  }

}

export interface TimeOption {
  time: number;
  display: string;
}