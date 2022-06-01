import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { Observable } from 'rxjs/internal/Observable';
import { Image } from 'src/app/models/image.model';
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
  submitted: boolean = false;
  isLoading: boolean = false;
  isDone: boolean = false;
  constructor(private managerService: ManagerService, private sharedService: SharedService, private formBuilder: FormBuilder, private route: ActivatedRoute, private router: Router) {
    this.createForm = this.formBuilder.group({
      title: ['', Validators.required],
      content: ['', Validators.required],
    });
  }

  get f() { return this.createForm.controls; }

  async createPost() {
    this.submitted = true;

    if (this.createForm.invalid || this.previews.length === 0 || this.hashtags.length === 0) {
      return;
    }
    this.isLoading = true;
    
    const hashtag = "#" + this.hashtags.map(e => e["value"]).join(" #");
    let postImages:Image[] = []; 
    for (let i = 0; i < this.previews.length; i++) {
      
      await new Promise(resolve => {
        const img = this.previews[i];
        let postImage: Image = {
          orderNumber: i,
          imageUrl: "",
          isThumbnail: i == this.thumbnailNumber,
          status: 1
        }

        this.sharedService.uploadImage(img).subscribe({
          next: (res:any) => {
            const imgUrl:string = res.secure_url;
            if (imgUrl) {
              postImage.imageUrl = imgUrl
              postImages.push(postImage);
              resolve("");
            }
          },
          error: (error) => {
            console.log(error);
          }
        });


      });
      
    }
    let post:CreatePost = {
      title: this.f['title'].value,
      content: this.f['content'].value,
      hashtag: hashtag,
      postImages: postImages
    }

    this.managerService.createPost(post).subscribe({
      next: (res:any) => {
        console.log(res);
        if (res.code == 200) {
          this.isDone = true;
          //this.router.navigate(['../'], { relativeTo: this.route });
        }
      },
      error: (error) => {
        console.log(error);
      },
      complete: () => {
        
      }
    });
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
