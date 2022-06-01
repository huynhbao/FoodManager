import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { CreatePost } from 'src/app/models/post.model';
import { ManagerService } from 'src/app/services/manager.service';
import { SharedService } from 'src/app/services/shared.service';

@Component({
  selector: 'app-create-post',
  templateUrl: './create-post.component.html',
  styleUrls: ['./create-post.component.scss']
})
export class CreatePostComponent implements OnInit {

  previews: string[] = [];
  selectedFiles?: FileList;
  hashtagValue: string = "";
  hashtags = [];
  thumbnailNumber: number = 0;
  createForm: FormGroup;
  constructor(private managerService: ManagerService, private sharedService: SharedService, private formBuilder: FormBuilder) {
    this.createForm = this.formBuilder.group({
      title: ['', Validators.required],
      content: ['', Validators.required],
      img: ['', Validators.required]
    });
  }

  createPost() {
    console.log(this.createForm.invalid);
    /* if (this.createForm.invalid) {
      return;
    } */

    
    let hashtag = "#" + this.hashtags.map(e => e["value"]).join(" #");
    /* let post:CreatePost = {

    }
    this.managerService.createPost(post).subscribe({
      next: (res:any) => {
        console.log(res);
      },
      error: (error) => {
        console.log(error);
      },
      complete: () => {
        
      }
    }); */
    for (let i = 0; i < this.previews.length; i++) {
      const img = this.previews[i];
      this.sharedService.uploadImage(img).subscribe({
        next: (res:any) => {
          console.log(res);
        },
        error: (error) => {
          console.log(error);
        },
        complete: () => {
          
        }
      });
      
    }
  }

  selectFiles(event: any): void {
    this.selectedFiles = event.target.files;

    //this.previews = [];
    if (this.selectedFiles && this.selectedFiles[0]) {
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

  removeImgPreview(item) {
    var index = this.previews.indexOf(item);
    this.previews.splice(index, 1);
  }

  setThumbnail(index) {
    this.thumbnailNumber = index;
  }

  ngOnInit(): void {
  }

}
