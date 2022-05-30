import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-create-post',
  templateUrl: './create-post.component.html',
  styleUrls: ['./create-post.component.scss']
})
export class CreatePostComponent implements OnInit {

  previews: string[] = [];
  selectedFiles?: FileList;
  hashtagValue: string = "";
  constructor() { }

  inputHashtag(hashtagValue) {
    //hashtagValue = hashtagValue.trim();
    this.hashtagValue = hashtagValue;
    if (hashtagValue.indexOf(' ') >= 0) {
      if (hashtagValue.substr(0, 1) != "#") hashtagValue = "#" + hashtagValue;
      console.log(hashtagValue.trim());
    }
  }

  selectFiles(event: any): void {
    this.selectedFiles = event.target.files;

    this.previews = [];
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

  ngOnInit(): void {
  }

}
