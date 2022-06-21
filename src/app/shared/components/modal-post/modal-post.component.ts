import { Component, OnInit } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { Post } from 'src/app/models/post.model';

@Component({
  selector: 'app-modal-post',
  templateUrl: './modal-post.component.html',
  styleUrls: ['./modal-post.component.scss']
})
export class ModalPostComponent implements OnInit {

  post!:Post;
  isLoading: boolean = true;
  
  constructor(public activeModal: NgbActiveModal) { }

  splitDescription(value: string) {
    value = value.replace(/\s/g, '');
    let hashtag = value.split('#').slice(1);
    
    return hashtag;
  }
  
  ngOnInit(): void {
  }

}
