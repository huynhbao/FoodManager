import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { CreatePost, Post } from 'src/app/models/post.model';
import { ManagerService } from 'src/app/services/manager.service';
import { SharedService } from 'src/app/services/shared.service';
import { Image } from 'src/app/models/image.model';
import { ToastrService } from 'ngx-toastr';
import { AppConst } from 'src/app/shared/constants/app-const';
import { User } from 'src/app/models/user.model';
import { Utils } from 'src/app/shared/tools/utils';

@Component({
  selector: 'app-edit-post',
  templateUrl: './edit-post.component.html',
  styleUrls: ['./edit-post.component.scss']
})
export class EditPostComponent implements OnInit {
  previews: string[] = [];
  post!:Post;
  selectedFiles?: FileList;
  hashtagValue: string = "";
  hashtags = [];
  thumbnailNumber: number = 0;
  editForm: FormGroup;
  submitted: boolean = false;
  isLoading: boolean = false;
  isDone: boolean = false;
  constructor(private managerService: ManagerService, private sharedService: SharedService, private formBuilder: FormBuilder, private route: ActivatedRoute, private router: Router, private toastr: ToastrService) {
    this.editForm = this.formBuilder.group({
      title: ['', Validators.required],
      content: ['', Validators.required],
    });
  }

  get f() { return this.editForm.controls; }

  mapToForm() {
    this.editForm.setValue({
      title: this.post.title,
      content: this.post.content
    });

    for (let i = 0; i < this.post.postImages.length; i++) {
      const element = this.post.postImages[i];
      this.previews.push(element.imageUrl);
      this.thumbnailNumber = element.isThumbnail ? i : 0
    }
    
  }

  loadPost(id: string) {
    this.managerService.getPostById(id).subscribe({
      next: (post: Post) => {
        let user: User = {
          id: post["userId"],
          fullname: post["name"],
          avatarUrl: post["userImageUrl"]
        } 
        this.post = post;
        this.post.user = user;
        console.log(this.post);
        this.mapToForm();
      },
      error: (error) => {
        //this.router.navigate(['manager/manage/post']);
      },
      complete: () => {
        this.isLoading = false;
      }
    });
  }

  async editPost() {
    this.submitted = true;

    if (this.editForm.invalid || this.previews.length === 0) {
      this.scrollToError();
      return;
    }
    this.isLoading = true;
    
    const hashtag = "";
    let postImages:Image[] = []; 
    for (let i = 0; i < this.previews.length; i++) {
      const img = this.previews[i];
      let postImage: Image = {
        orderNumber: i,
        imageUrl: img,
        isThumbnail: i == this.thumbnailNumber,
        status: 1
      }

      if (!Utils.isURL(img)) {
        await new Promise(resolve => {
          this.sharedService.uploadImage(img).subscribe({
            next: (res:any) => {
              const imgUrl:string = res.secure_url;
              if (imgUrl) {
                postImage.imageUrl = imgUrl;
                resolve("");
              }
            },
            error: (error) => {
              console.log(error);
            }
          });

        });
      }
      postImages.push(postImage);
    }
    
    let post:CreatePost = {
      id: this.post.id,
      title: this.f['title'].value,
      content: this.f['content'].value,
      hashtag: hashtag,
      postImages: postImages
    }

    console.log(post);

    this.managerService.updatePost(post).subscribe({
      next: (res:any) => {
        console.log(res);
        if (res.code == 200) {
          this.isDone = true;
          this.toastr.success(`Đã cập nhật bài viết thành công`);
          //this.router.navigate(['../'], { relativeTo: this.route });
        }
      },
      error: (error) => {
        console.log(error);
        this.toastr.error(`Không thể cập nhật bài viết`);
        this.isDone = false;
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
    if (index == this.thumbnailNumber) {
      this.thumbnailNumber = 0;
    }
  }

  setThumbnail(index) {
    this.thumbnailNumber = index;
  }

  ngOnInit(): void {
    let id = this.route.snapshot.params['id'];
    if (id) {
      this.loadPost(id);
    }  else {
      this.router.navigate(['../'], { relativeTo: this.route });
    }
  }

}
